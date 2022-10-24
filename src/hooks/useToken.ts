import { useWeb3React } from "@web3-react/core"
import { Token } from "lib/entities"
import { useEffect, useMemo, useState } from "react"
import {
  TokenAddressMap,
  useCombinedActiveList,
  useCombinedUnsupportedList,
  useCombinedWhiteList,
} from "state/lists/hooks"
import { isAddress } from "utils"
import { useERC20 } from "hooks/useERC20"
import { useUserAddedTokens } from "state/user/hooks"

// reduce token map into standard address <-> Token mapping, optionally include user added tokens
function useTokensFromMap(
  tokenMap: TokenAddressMap,
  includeUserAdded: boolean
): {
  [address: string]: Token
} {
  const { chainId } = useWeb3React()
  const userAddedTokens = useUserAddedTokens()

  return useMemo(() => {
    if (!chainId) return {}

    // reduce to just tokens
    const mapWithoutUrls = Object.keys(tokenMap[chainId] ?? {}).reduce<{
      [address: string]: Token
    }>((newMap, address) => {
      newMap[address] = tokenMap[chainId][address].token
      return newMap
    }, {})

    if (!includeUserAdded) return mapWithoutUrls

    return (
      userAddedTokens
        // reduce into all ALL_TOKENS filtered by the current chain
        .reduce<{ [address: string]: Token }>(
          (tokenMap, token) => {
            tokenMap[token.address] = token
            return tokenMap
          },
          // must make a copy because reduce modifies the map, and we do not
          // want to make a copy in every iteration
          { ...mapWithoutUrls }
        )
    )
  }, [chainId, includeUserAdded, tokenMap, userAddedTokens])
}

export function useAllTokens(): { [address: string]: Token } {
  const allTokens = useCombinedActiveList()
  return useTokensFromMap(allTokens, true)
}

export function useWhitelistTokens(): { [address: string]: Token } {
  const whitelistTokens = useCombinedWhiteList()
  return useTokensFromMap(whitelistTokens, true)
}

export function useUnsupportedTokens(): { [address: string]: Token } {
  const unsupportedTokens = useCombinedUnsupportedList()
  return useTokensFromMap(unsupportedTokens, false)
}

export function useUserTokens(): { [address: string]: Token } {
  return useTokensFromMap({}, true)
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

export function useTryCustomToken(debouncedQuery: string) {
  const { chainId } = useWeb3React()
  const [customTokenAddress, setCustomTokenAddress] = useState("")
  const [, customTokenData] = useERC20(customTokenAddress)
  const isAddressSearch = isAddress(debouncedQuery)
  const searchToken = useToken(debouncedQuery)

  // if no results found try to initialize contract
  useEffect(() => {
    if (
      isAddressSearch &&
      !searchToken &&
      customTokenAddress !== debouncedQuery
    ) {
      setCustomTokenAddress(debouncedQuery)
    }
  }, [isAddressSearch, searchToken, debouncedQuery, customTokenAddress])

  return useMemo(
    () =>
      chainId && customTokenData && isAddressSearch
        ? new Token(
            chainId,
            customTokenData.address,
            customTokenData.decimals,
            customTokenData.symbol,
            customTokenData.name
          )
        : undefined,
    [customTokenData, chainId, isAddressSearch]
  )
}
