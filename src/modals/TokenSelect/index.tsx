import { FC, useCallback, useMemo, useState } from "react"

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
import { AppButton } from "common"
import { Manage } from "components/TokensList/Manage"
import { Route, Routes, useLocation, useNavigate } from "react-router-dom"

interface Props {
  onSelect: (token: Token) => void
}

const TokenSelect: FC<Props> = ({ onSelect }) => {
  const { account } = useWeb3React()
  const [searchQuery, setSearchQuery] = useState<string>("")
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isOpen = pathname.includes("modal")

  const debouncedQuery = useDebounce(searchQuery, 200)
  const allTokens = useWhitelistTokens()
  const customToken = useTryCustomToken(debouncedQuery)
  const addToken = useAddUserToken()

  const onClose = useCallback(() => {
    navigate(pathname.slice(0, pathname.indexOf("/modal")))
  }, [navigate, pathname])

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
    navigate("modal/import")
  }, [customToken, navigate])

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
      navigate("modal/search")
    },
    [addToken, navigate]
  )

  const handleManageTokens = useCallback(() => {
    navigate("modal/manage/tokens")
  }, [navigate])

  const importToken = customToken && (
    <ImportRow importToken={showImportToken} token={customToken} />
  )
  const noItems = importToken || (
    <S.Placeholder>No results found.</S.Placeholder>
  )

  const content = (
    <Routes>
      <Route
        path="modal/search"
        element={
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
            <S.Footer>
              <AppButton
                onClick={handleManageTokens}
                size="no-paddings"
                color="default"
                text="Manage Tokens"
              />
            </S.Footer>
          </S.Card>
        }
      />
      <Route
        path="modal/import"
        element={
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
        }
      />
      <Route path="modal/manage/*" element={<Manage />} />
    </Routes>
  )

  return (
    <Modal isOpen={isOpen} toggle={onClose} title={"Select token"}>
      {isOpen && content}
    </Modal>
  )
}

export default TokenSelect
