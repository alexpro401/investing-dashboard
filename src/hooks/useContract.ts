import { useMemo, useEffect, useState, useCallback } from "react"
import { Contract } from "@ethersproject/contracts"
import { BigNumber } from "@ethersproject/bignumber"
import { JsonRpcProvider } from "@ethersproject/providers"
import {
  ERC20,
  TraderPool,
  TraderPoolRiskyProposal,
  TraderPoolInvestProposal,
  BasicTraderPool,
  PriceFeed,
  PoolRegistry,
  InvestTraderPool,
  UserRegistry,
} from "abi"
import { getBalanceOf, getContract } from "utils/getContract"
import { useActiveWeb3React } from "hooks"
import { Token } from "interfaces"
import { isAddress } from "utils"
import { useSelector } from "react-redux"
import {
  selectPriceFeedAddress,
  selectTraderPoolRegistryAddress,
  selectUserRegistryAddress,
} from "state/contracts/selectors"
import { useERC20Data } from "state/erc20/hooks"

const provider = new JsonRpcProvider(
  "https://data-seed-prebsc-1-s1.binance.org:8545/"
)

export default function useContract(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true
): Contract | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !isAddress(address)) return null

    try {
      return getContract(
        address,
        ABI,
        library || provider,
        withSignerIfPossible && account ? account : undefined
      )
    } catch (error) {
      console.error("Failed to get contract", error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useERC20(
  address: string | undefined
): [Contract | null, Token | null, BigNumber, () => void] {
  const { account, library } = useActiveWeb3React()

  const [storedAddress, setAddress] = useState("")
  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0))

  const contract = useContract(storedAddress, ERC20)

  const [tokenData, dataLoading, fetchData] = useERC20Data(address)

  const init = useCallback(() => {
    if (!contract || !library || !storedAddress) return
    ;(async () => {
      if (tokenData === null && !dataLoading) {
        fetchData()
      }
    })()

    // GET token account info
    if (typeof account !== "string" || account.length !== 42) return
    ;(async () => {
      try {
        const balance = await getBalanceOf({
          tokenAddress: storedAddress,
          library,
          contract,
          account,
        })

        setBalance(balance)
      } catch (e) {
        // console.log(e, e.message)
      }
    })()
  }, [account, storedAddress, contract, library, tokenData, dataLoading])

  // check address and save
  useEffect(() => {
    if (!address) return

    if (address === storedAddress) return

    try {
      isAddress(address)
      setAddress(address)
    } catch (e) {}

    setBalance(BigNumber.from(0))
  }, [address, storedAddress])

  useEffect(() => {
    init()
  }, [contract, account, storedAddress, library, init])

  return [contract, tokenData, balance, init]
}

export function useTraderPoolContract(
  poolAddress: string | undefined
): Contract | null {
  return useContract(poolAddress, TraderPool)
}

export function useBasicPoolContract(
  poolAddress: string | undefined
): Contract | null {
  return useContract(poolAddress, BasicTraderPool)
}

export function useInvestPoolContract(
  poolAddress: string | undefined
): Contract | null {
  return useContract(poolAddress, InvestTraderPool)
}

export function usePriceFeedContract(): Contract | null {
  const priceFeedAddress = useSelector(selectPriceFeedAddress)

  return useContract(priceFeedAddress, PriceFeed)
}

export function useTraderPoolRegistryContract(): Contract | null {
  const traderPoolRegistryAddress = useSelector(selectTraderPoolRegistryAddress)

  return useContract(traderPoolRegistryAddress, PoolRegistry)
}

export function useProposalAddress(poolAddress) {
  const [proposalAddress, setProposalAddress] = useState("")

  const traderPool = useTraderPoolContract(poolAddress)

  useEffect(() => {
    if (!traderPool) return
    ;(async () => {
      const proposalAddress = await traderPool.proposalPoolAddress()
      setProposalAddress(proposalAddress)
    })()
  }, [traderPool])

  return proposalAddress
}

export function useRiskyProposalContract(
  poolAddress: string | undefined
): [Contract | null, string] {
  const proposalAddress = useProposalAddress(poolAddress)

  const proposalPool = useContract(proposalAddress, TraderPoolRiskyProposal)

  return [proposalPool, proposalAddress]
}

export function useInvestProposalContract(
  poolAddress: string | undefined
): [Contract | null, string] {
  const proposalAddress = useProposalAddress(poolAddress)

  const proposalPool = useContract(proposalAddress, TraderPoolInvestProposal)

  return [proposalPool, proposalAddress]
}

export function useUserRegistryContract(): Contract | null {
  const userRegistryAddress = useSelector(selectUserRegistryAddress)
  const userRegistry = useContract(userRegistryAddress, UserRegistry)

  return userRegistry
}
