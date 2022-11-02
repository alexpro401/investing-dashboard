import addresses from "constants/contracts"
import { Address } from "constants/types"

// by default selects the mainnet chain id (56)
export const getAddress = (address: Address, chainId?: number): string => {
  return chainId && address[chainId] ? address[chainId] : address[56]
}

export const getMulticallAddress = (chainId?: number) => {
  return getAddress(addresses.multiCall, chainId)
}
