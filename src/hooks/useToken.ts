import { useWeb3React } from "@web3-react/core"
import { Token } from "lib/entities"
import { useMemo } from "react"
import {
  TokenAddressMap,
  useCombinedActiveList,
  useCombinedUnsupportedList,
  useCombinedWhiteList,
} from "state/lists/hooks"

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

export function useWhitelistTokens(): { [address: string]: Token } {
  const whitelistTokens = useCombinedWhiteList()
  return useTokensFromMap(whitelistTokens)
}

export function useUnsupportedTokens(): { [address: string]: Token } {
  const unsupportedTokens = useCombinedUnsupportedList()
  return useTokensFromMap(unsupportedTokens)
}

// undefined if invalid or does not exist
// null if loading or null was passed
// otherwise returns the token
export function useToken(
  tokenAddress?: string | null
): Token | null | undefined {
  const tokens = useAllTokens()
  return tokens[tokenAddress ?? ""] ?? undefined
}
