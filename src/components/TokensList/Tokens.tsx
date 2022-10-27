import { useTryCustomToken, useUserTokens } from "hooks/useToken"
import { Token } from "lib/entities"
import { getTokenFilter } from "lib/hooks/useTokenList/filtering"
import { useSortTokensByQuery } from "lib/hooks/useTokenList/sorting"
import * as S from "modals/TokenSelect/styled"
import { FC, useMemo, useState } from "react"
import ImportRow from "./ImportRow"
import ImportToken from "./ImportToken"
import ManageToken from "./ManageToken"

interface Props {
  debouncedQuery: string
}

const Tokens: FC<Props> = ({ debouncedQuery }) => {
  const userTokens = useUserTokens()
  const [importToken, setImportToken] = useState(false)

  const filteredTokens: Token[] = useMemo(() => {
    return Object.values(userTokens).filter(getTokenFilter(debouncedQuery))
  }, [userTokens, debouncedQuery])

  const filteredSortedTokens = useSortTokensByQuery(
    debouncedQuery,
    filteredTokens
  )

  const customToken = useTryCustomToken(debouncedQuery)

  const importContent = importToken ? (
    <ImportToken
      token={customToken!}
      showImportToken={() => setImportToken(true)}
    />
  ) : (
    <ImportRow importToken={() => setImportToken(true)} token={customToken!} />
  )

  return (
    <>
      {customToken && importContent}
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
