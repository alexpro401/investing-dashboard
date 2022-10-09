import { useWeb3React } from "@web3-react/core"
import { Token } from "lib/entities"
import { useMemo } from "react"
import { TokenAddressMap, useCombinedActiveList } from "state/lists/hooks"

// reduce token map into standard address <-> Token mapping, optionally include user added tokens
function useTokensFromMap(tokenMap: TokenAddressMap): {
  [address: string]: Token
} {
  const { chainId } = useWeb3React()

  return useMemo(() => {
    if (!chainId) return {}

    // reduce to just tokens
    const mapWithoutUrls = Object.keys(tokenMap[chainId] ?? {}).reduce<{
      [address: string]: Token
    }>((newMap, address) => {
      newMap[address] = tokenMap[chainId][address].token
      return newMap
    }, {})

    return mapWithoutUrls
  }, [chainId, tokenMap])
}

export function useAllTokens(): { [address: string]: Token } {
  const allTokens = useCombinedActiveList()
  return useTokensFromMap(allTokens)
}
