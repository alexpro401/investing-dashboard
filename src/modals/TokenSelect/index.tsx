import { FC, ReactNode, useCallback, useMemo, useState } from "react"

import TokensList from "components/TokensList"
import Modal from "components/Modal"

import { useTryCustomToken, useWhitelistTokens } from "hooks/useToken"
import { Currency, Token } from "lib/entities"
import useDebounce from "hooks/useDebounce"
import { useTokenBalancesWithLoadingIndicator } from "hooks/useBalance"
import { useWeb3React } from "@web3-react/core"
import { getTokenFilter } from "lib/hooks/useTokenList/filtering"
import {
  tokenComparator,
  useSortTokensByQuery,
} from "lib/hooks/useTokenList/sorting"
import ImportToken from "components/TokensList/ImportToken"
import { useAddUserToken } from "state/user/hooks"

import * as S from "./styled"
import ImportRow from "components/TokensList/ImportRow"
import Search from "components/Search"

export enum CurrencyModalView {
  search,
  manage,
  importToken,
  importList,
  tokenSafety,
}

interface Props {
  isOpen: boolean
  onSelect: (token: Token) => void
  onClose: () => void
}

const TokenSelect: FC<Props> = ({ isOpen, onClose, onSelect }) => {
  const { account } = useWeb3React()
  const [searchQuery, setSearchQuery] = useState<string>("")

  const [modalView, setModalView] = useState<CurrencyModalView>(
    CurrencyModalView.search
  )
  const debouncedQuery = useDebounce(searchQuery, 200)
  const allTokens = useWhitelistTokens()
  const customToken = useTryCustomToken(debouncedQuery)
  const addToken = useAddUserToken()

  const allTokensArray = useMemo(
    () => Object.values(allTokens ?? {}),
    [allTokens]
  )

  const [balances, balancesIsLoading] = useTokenBalancesWithLoadingIndicator(
    account,
    allTokensArray
  )

  const filteredTokens: Token[] = useMemo(() => {
    return Object.values(allTokens).filter(getTokenFilter(debouncedQuery))
  }, [allTokens, debouncedQuery])

  const sortedTokens: Token[] = useMemo(
    () =>
      !balancesIsLoading
        ? [...filteredTokens].sort(tokenComparator.bind(null, balances))
        : [],
    [balances, filteredTokens, balancesIsLoading]
  )

  const filteredSortedTokens = useSortTokensByQuery(
    debouncedQuery,
    sortedTokens
  )

  const showImportToken = useCallback(() => {
    if (!customToken) return
    setModalView(CurrencyModalView.importToken)
  }, [customToken])

  const handleSelect = useCallback(
    (currency: Currency) => {
      const token = currency.isToken ? currency : undefined

      if (!token) return

      onSelect(token)
      onClose()
    },
    [onClose, onSelect]
  )

  const handleImportToken = useCallback(
    (token: Token) => {
      addToken(token)
      setModalView(CurrencyModalView.search)
    },
    [addToken]
  )

  let content: ReactNode
  let title = "Select a Token"

  switch (modalView) {
    case CurrencyModalView.search:
      title = "Select a Token"
      const importToken = customToken && (
        <ImportRow importToken={showImportToken} token={customToken} />
      )
      const noItems = importToken || (
        <S.Placeholder>No results found.</S.Placeholder>
      )

      content = (
        <S.Card>
          <S.CardHeader>
            <Search
              placeholder="Name, ticker, address"
              value={searchQuery}
              handleChange={setSearchQuery}
              height="40px"
            />
          </S.CardHeader>
          <S.CardList style={{ minHeight: 400 }}>
            {!!filteredSortedTokens.length ? (
              <TokensList
                balances={balances}
                onSelect={handleSelect}
                currencies={filteredSortedTokens}
              />
            ) : (
              noItems
            )}
          </S.CardList>
        </S.Card>
      )
      break
    case CurrencyModalView.importToken:
      title = "import token"
      content = (
        <S.Card>
          <S.CardHeader></S.CardHeader>
          <S.CardList style={{ minHeight: 400 }}>
            <ImportToken
              isImport
              showImportToken={showImportToken}
              token={customToken!}
            />
          </S.CardList>
          <S.Footer>
            <S.ImportButton
              onClick={() => handleImportToken(customToken!)}
              size="large"
              text="Import"
            />
          </S.Footer>
        </S.Card>
      )
      break
  }

  return (
    <Modal isOpen={isOpen} toggle={onClose} title={title}>
      {isOpen && content}
    </Modal>
  )
}

export default TokenSelect
