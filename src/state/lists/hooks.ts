import {
  ChainTokenMap,
  tokensToChainTokenMap,
} from "lib/hooks/useTokenList/utils"
import { useMemo } from "react"
import { AppState } from "state"
import { useAppSelector } from "state/hooks"
import sortByListPriority from "utils/listSort"

import { UNSUPPORTED_LIST_URLS, WHITELIST_LIST_URLS } from "consts/lists"

export type TokenAddressMap = ChainTokenMap

type Mutable<T> = {
  -readonly [P in keyof T]: Mutable<T[P]>
}

export function useAllLists(): AppState["lists"]["byUrl"] {
  return useAppSelector((state) => state.lists.byUrl)
}

/**
 * Combine the tokens in map2 with the tokens on map1, where tokens on map1 take precedence
 * @param map1 the base token map
 * @param map2 the map of additioanl tokens to add to the base map
 */
export function combineMaps(
  map1: TokenAddressMap,
  map2: TokenAddressMap
): TokenAddressMap {
  const chainIds = Object.keys(
    Object.keys(map1)
      .concat(Object.keys(map2))
      .reduce<{ [chainId: string]: true }>((memo, value) => {
        memo[value] = true
        return memo
      }, {})
  ).map((id) => parseInt(id))

  return chainIds.reduce<Mutable<TokenAddressMap>>((memo, chainId) => {
    memo[chainId] = {
      ...map2[chainId],
      // map1 takes precedence
      ...map1[chainId],
    }
    return memo
  }, {}) as TokenAddressMap
}

// merge tokens contained within lists from urls
function useCombinedTokenMapFromUrls(
  urls: string[] | undefined
): TokenAddressMap {
  const lists = useAllLists()
  return useMemo(() => {
    if (!urls) return {}
    return (
      urls
        .slice()
        // sort by priority so top priority goes last
        .sort(sortByListPriority)
        .reduce((allTokens, currentUrl) => {
          const current = lists[currentUrl]?.current
          if (!current) return allTokens
          try {
            const r = combineMaps(allTokens, tokensToChainTokenMap(current))
            return r
          } catch (error) {
            console.error("Could not show token list due to error", error)
            return allTokens
          }
        }, {})
    )
  }, [lists, urls])
}

// filter out unsupported lists
export function useActiveListUrls(): string[] | undefined {
  const activeListUrls = useAppSelector((state) => state.lists.activeListUrls)
  return useMemo(
    () => activeListUrls?.filter((url) => !UNSUPPORTED_LIST_URLS.includes(url)),
    [activeListUrls]
  )
}

export function useWhiteListUrls(): string[] | undefined {
  const activeListUrls = useAppSelector((state) => state.lists.byUrl)
  return useMemo(
    () =>
      Object.keys(activeListUrls)?.filter((url) =>
        WHITELIST_LIST_URLS.includes(url)
      ),
    [activeListUrls]
  )
}

export function useBlackListUrls(): string[] | undefined {
  const activeListUrls = useAppSelector((state) => state.lists.byUrl)
  return useMemo(
    () =>
      Object.keys(activeListUrls)?.filter((url) =>
        UNSUPPORTED_LIST_URLS.includes(url)
      ),
    [activeListUrls]
  )
}

export function useInactiveListUrls(): string[] {
  const lists = useAllLists()
  const allActiveListUrls = useActiveListUrls()
  return useMemo(
    () =>
      Object.keys(lists).filter(
        (url) =>
          !allActiveListUrls?.includes(url) &&
          !UNSUPPORTED_LIST_URLS.includes(url)
      ),
    [lists, allActiveListUrls]
  )
}

export function useCombinedWhiteList(): TokenAddressMap {
  const whiteListUrls = useWhiteListUrls()
  return useCombinedTokenMapFromUrls(whiteListUrls)
}

export function useCombinedUnsupportedList(): TokenAddressMap {
  const blackListUrls = useBlackListUrls()
  return useCombinedTokenMapFromUrls(blackListUrls)
}

// get all the tokens from active lists, combine with local default tokens
export function useCombinedActiveList(): TokenAddressMap {
  const activeListUrls = useActiveListUrls()
  return useCombinedTokenMapFromUrls(activeListUrls)
}

export function useIsListActive(url: string): boolean {
  const activeListUrls = useActiveListUrls()
  return Boolean(activeListUrls?.includes(url))
}
