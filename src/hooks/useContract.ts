import { useMemo, useEffect, useState } from "react"
import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import { getContract } from "utils/getContract"
import { useActiveWeb3React } from "hooks"

import { isAddress } from "utils"
import { useTraderPoolContract } from "contracts"

const provider = new JsonRpcProvider(
  "https://nd-027-868-988.p2pify.com/c0fd39a4c89c17c07e885517f619f415"
)

export default function useContract<T extends Contract = Contract>(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true
): T | null {
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
  }, [address, ABI, library, withSignerIfPossible, account]) as T
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
