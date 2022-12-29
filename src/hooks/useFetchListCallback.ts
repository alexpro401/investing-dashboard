import { nanoid } from "@reduxjs/toolkit"
import { SupportedChainId } from "consts/chains"
import { RPC_PROVIDERS } from "consts/providers"
import getTokenList from "lib/hooks/useTokenList/fetchTokenList"
import { TokenList } from "lib/token-list/TokenList"
import resolveENSContentHash from "lib/utils/resolveENSContentHash"
import { useCallback } from "react"
import { useAppDispatch } from "state/hooks"

import { fetchTokenList } from "../state/lists/actions"

export function useFetchListCallback(): (
  listUrl: string,
  sendDispatch?: boolean
) => Promise<TokenList> {
  const dispatch = useAppDispatch()

  // note: prevent dispatch if using for list search or unsupported list
  return useCallback(
    async (listUrl: string, sendDispatch = true) => {
      const requestId = nanoid()
      sendDispatch &&
        dispatch(fetchTokenList.pending({ requestId, url: listUrl }))
      return getTokenList(listUrl, (ensName: string) =>
        resolveENSContentHash(
          ensName,
          RPC_PROVIDERS[SupportedChainId.BINANCE_SMART_CHAIN_TESTNET]
        )
      )
        .then((tokenList) => {
          sendDispatch &&
            dispatch(
              fetchTokenList.fulfilled({ url: listUrl, tokenList, requestId })
            )
          return tokenList
        })
        .catch((error) => {
          console.debug(`Failed to get list at url ${listUrl}`, error)
          sendDispatch &&
            dispatch(
              fetchTokenList.rejected({
                url: listUrl,
                requestId,
                errorMessage: error.message,
              })
            )
          throw error
        })
    },
    [dispatch]
  )
}
