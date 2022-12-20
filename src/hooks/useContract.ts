import { useMemo } from "react"
import { Contract } from "@ethersproject/contracts"
import { getContract } from "utils/getContract"
import { useActiveWeb3React } from "hooks"

import { isAddress } from "utils"
import { RPC_PROVIDERS } from "constants/providers"

export function useContract<T extends Contract = Contract>(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true
): T | null {
  const { library, account, chainId } = useActiveWeb3React()

  const provider = chainId && RPC_PROVIDERS[chainId]

  return useMemo(() => {
    if (!address || !ABI || !isAddress(address)) return null

    if (!library && !provider) return

    const lib = withSignerIfPossible ? library : library || provider

    try {
      return getContract(
        address,
        ABI,
        lib,
        withSignerIfPossible && account ? account : undefined
      )
    } catch (error) {
      console.error("Failed to get contract", error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account, provider]) as T
}

export default useContract
