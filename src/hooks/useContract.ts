import { useMemo, useEffect, useState } from "react"
import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import {
  TraderPool,
  TraderPoolRiskyProposal,
  TraderPoolInvestProposal,
  BasicTraderPool,
  PriceFeed,
  PoolRegistry,
  InvestTraderPool,
  UserRegistry,
  Insurance,
} from "abi"
import { getContract } from "utils/getContract"
import { useActiveWeb3React } from "hooks"

import { isAddress } from "utils"
import { useSelector } from "react-redux"
import {
  selectInsuranceAddress,
  selectPriceFeedAddress,
  selectTraderPoolRegistryAddress,
  selectUserRegistryAddress,
} from "state/contracts/selectors"

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

export function useInsuranceContract(): Contract | null {
  const insuranceAddress = useSelector(selectInsuranceAddress)
  return useContract(insuranceAddress, Insurance)
}
