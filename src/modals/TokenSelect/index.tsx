import { FC, memo, useCallback, useMemo, useState } from "react"

import TokensList from "components/TokensList"
import Modal from "components/Modal"

import { useTryCustomToken } from "hooks/useToken"
import { Currency, Token } from "lib/entities"
import useDebounce from "hooks/useDebounce"
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
import ImportList from "components/TokensList/ImportList"
import { TokenList } from "lib/token-list"
import { useAllLists } from "state/lists/hooks"
import { useFetchListCallback } from "hooks/useFetchListCallback"
import { useAppDispatch } from "state/hooks"
import { enableList, removeList } from "state/lists/actions"
import { useAllTokenPrices } from "hooks/usePrice"
import { CurrencyAmount } from "lib/entities/fractions/currencyAmount"

interface Props {
  whitelistOnly?: boolean
  allTokens: { [address: string]: Token }
  allBalances: { [tokenAddress: string]: CurrencyAmount<Token> | undefined }
  balancesLoading: boolean
  onSelect: (token: Token, isRisky?: boolean) => void
  onClose: () => void
}

const TokenSelect: FC<Props> = ({
  whitelistOnly,
  allTokens,
  allBalances,
  balancesLoading,
  onClose,
  onSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState("")

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isOpen = pathname.includes("modal")

  const debouncedQuery = useDebounce(searchQuery, 200)
  const customToken = useTryCustomToken(debouncedQuery)
  const addToken = useAddUserToken()

  const [prices] = useAllTokenPrices()

  const filteredTokens: Token[] = useMemo(() => {
    return Object.values(allTokens).filter(getTokenFilter(debouncedQuery))
  }, [allTokens, debouncedQuery])

  const sortedTokens: Token[] = useMemo(
    () =>
      !balancesLoading
        ? [...filteredTokens].sort(tokenComparator.bind(null, allBalances))
        : [],
    [allBalances, filteredTokens, balancesLoading]
  )

  const filteredSortedTokens = useSortTokensByQuery(
    debouncedQuery,
    sortedTokens
  )

  const showImportToken = useCallback(() => {
    if (!customToken) return
    navigate("modal/import")
  }, [customToken, navigate])

  const showDefaultView = useCallback(() => {
    navigate("modal/search")
  }, [navigate])

  const handleSelect = useCallback(
    (currency: Currency, isRisky: boolean) => {
      const token = currency.isToken ? currency : undefined

      if (!token) return

      onSelect(token, isRisky)
    },
    [onSelect]
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

  const lists = useAllLists()
  const fetchList = useFetchListCallback()

  // used for import list
  const [importList, setImportList] = useState<TokenList | undefined>()
  const [listURL, setListUrl] = useState<string | undefined>()
  const [confirmed, setConfirmed] = useState(false)

  // monitor is list is loading
  const adding = Boolean(lists[listURL ?? ""]?.loadingRequestId)
  // TODO: addError UI
  const [addError, setAddError] = useState<string | null>(null)

  const handleAddList = useCallback(() => {
    if (adding) return
    setAddError(null)
    fetchList(listURL!)
      .then(() => {
        // turn list on
        dispatch(enableList(listURL!))
        // go back to lists
        navigate("modal/manage/lists")
      })
      .catch((error) => {
        setAddError(error.message)
        dispatch(removeList(listURL!))
      })
  }, [adding, dispatch, fetchList, listURL, navigate])

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
                  prices={prices}
                  whitelistOnly={whitelistOnly}
                  balances={allBalances}
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
            <S.CardList style={{ minHeight: 300 }}>
              {/* show import token view */}
              {customToken && (
                <ImportToken
                  confirmed={confirmed}
                  setConfirmed={setConfirmed}
                  showImportToken={showImportToken}
                  token={customToken!}
                />
              )}
              {/* show import list view */}
              {importList && (
                <ImportList
                  confirmed={confirmed}
                  setConfirmed={setConfirmed}
                  importList={importList}
                  listURL={listURL!}
                />
              )}
              {/* TODO: show no items view */}

              {!customToken && !importList && (
                <S.Error>Import failed! Reason: token not found</S.Error>
              )}
            </S.CardList>
            <S.Footer>
              {customToken && (
                <S.ImportButton
                  disabled={!confirmed}
                  onClick={() => handleImportToken(customToken!)}
                  size="large"
                  text="Import"
                />
              )}
              {importList && (
                <S.ImportButton
                  disabled={!confirmed}
                  onClick={handleAddList}
                  size="large"
                  text="Import"
                />
              )}
              {!customToken && !importList && (
                <AppButton
                  onClick={showDefaultView}
                  size="no-paddings"
                  color="default"
                  text="Search for a token"
                />
              )}
            </S.Footer>
          </S.Card>
        }
      />
      <Route
        path="modal/manage/*"
        element={
          <Manage
            whitelistOnly={whitelistOnly}
            customToken={customToken}
            setImportList={setImportList}
            setListUrl={setListUrl}
            mainQuery={searchQuery}
            setMainQuery={setSearchQuery}
          />
        }
      />
    </Routes>
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={"Select token"}>
      {isOpen && content}
    </Modal>
  )
}

export default memo(TokenSelect)
