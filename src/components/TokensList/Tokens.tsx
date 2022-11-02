import { FC, useCallback, useMemo } from "react"
import { useUserTokens } from "hooks/useToken"
import { Token } from "lib/entities"
import { getTokenFilter } from "lib/hooks/useTokenList/filtering"
import { useSortTokensByQuery } from "lib/hooks/useTokenList/sorting"
import * as S from "modals/TokenSelect/styled"
import { useLocation, useNavigate } from "react-router-dom"
import ImportRow from "./ImportRow"
import ManageToken from "./ManageToken"

interface Props {
  debouncedQuery: string
  customToken?: Token
}

const Tokens: FC<Props> = ({ debouncedQuery, customToken }) => {
  const userTokens = useUserTokens()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const filteredTokens: Token[] = useMemo(() => {
    return Object.values(userTokens).filter(getTokenFilter(debouncedQuery))
  }, [userTokens, debouncedQuery])

  const filteredSortedTokens = useSortTokensByQuery(
    debouncedQuery,
    filteredTokens
  )

  const root = useMemo(
    () => pathname.slice(0, pathname.indexOf("/modal")),
    [pathname]
  )

  const showImportToken = useCallback(() => {
    if (!customToken) return
    navigate(root + "/modal/import")
  }, [customToken, navigate, root])

  return (
    <>
      {customToken && (
        <ImportRow importToken={showImportToken} token={customToken} />
      )}
      {!customToken &&
        filteredSortedTokens.map((token) => (
          <ManageToken key={token.address} token={token} />
        ))}
      {!filteredSortedTokens.length && !customToken && (
        <S.Placeholder>No tokens found</S.Placeholder>
      )}
    </>
  )
}

export default Tokens
