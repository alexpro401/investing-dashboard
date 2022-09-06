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
import { ITokenBase } from "interfaces"
import { TokenData } from "constants/types"
import { isAddress } from "utils"
import { useSelector } from "react-redux"
import {
  selectPriceFeedAddress,
  selectTraderPoolRegistryAddress,
  selectUserRegistryAddress,
} from "state/contracts/selectors"
import { arraysEqual } from "utils/array"

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
): [Contract | null, TokenData | null, BigNumber, () => void] {
  const { account, library } = useActiveWeb3React()

  const [storedAddress, setAddress] = useState("")
  const [tokenData, setTokenData] = useState<ITokenBase | null>(null)
  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0))

  const contract = useContract(storedAddress, ERC20)

  const init = useCallback(() => {
    if (!contract || !library || !storedAddress) return
    ;(async () => {
      try {
        const symbol = await contract.symbol()
        const decimals = await contract.decimals()
        const name = await contract.name()

        setTokenData({
          address: storedAddress,
          name,
          symbol,
          decimals,
        })
      } catch (e) {
        // console.log(e, e.message)
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
  }, [account, storedAddress, contract, library])

  // check address and save
  useEffect(() => {
    if (!address) return

    if (address === storedAddress) return

    try {
      isAddress(address)
      setAddress(address)
    } catch (e) {}

    setTokenData(null)
    setBalance(BigNumber.from(0))
  }, [address, storedAddress])

  useEffect(() => {
    init()
  }, [contract, account, storedAddress, library, init])

  return [contract, tokenData, balance, init]
}

interface IERC20ListPayload {
  [n: string]: ITokenBase
}

interface IData {
  list: string[]
  _isPools: boolean
}

export function useERC20List(data: IData): IERC20ListPayload | null {
  const { library, account } = useActiveWeb3React()

  const [stop, setStop] = useState(false)
  const [addressList, setAddressList] = useState<string[] | null>(null)
  const [payload, setPayload] = useState<IERC20ListPayload | null>(null)

  const initContract = useCallback(
    async (address) => {
      if (isAddress(address) && !!library && !!account) {
        const c = await getContract(
          address,
          ERC20,
          library || provider,
          account ?? undefined
        )
        return c
      }
      return null
    },
    [account, library]
  )

  useEffect(() => {
    if (!data || stop || !account || !library) return
    ;(async () => {
      try {
        for (const a of data.list) {
          let address: string

          // Means that is pools addresses list or not
          if (data._isPools) {
            const traderPool = await getContract(
              a,
              TraderPool,
              library || provider,
              account ?? undefined
            )
            const poolInfo = await traderPool.getPoolInfo()

            address = poolInfo.parameters.baseToken
          } else {
            address = a
          }

          const contract = await initContract(address)

          if (contract) {
            const symbol = await contract.symbol()
            const decimals = await contract.decimals()
            const name = await contract.name()

            setPayload((prev) => ({
              ...(prev ?? {}),
              [data._isPools ? a : address]: {
                address,
                name,
                symbol,
                decimals,
              },
            }))

            if (data.list[data.list.length - 1] === address) {
              setStop(true)
            }
          }
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [account, data, initContract, library, stop])

  useEffect(() => {
    if (
      data.list &&
      data.list.length > 0 &&
      !arraysEqual(data.list, addressList)
    ) {
      setAddressList(data.list)
      setPayload(null)
      setStop(false)
    }
  }, [addressList, data.list])

  return payload
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
