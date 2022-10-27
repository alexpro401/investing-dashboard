import { useUserTokens } from "hooks/useToken"
import { Token } from "lib/entities"
import { getTokenFilter } from "lib/hooks/useTokenList/filtering"
import { useSortTokensByQuery } from "lib/hooks/useTokenList/sorting"
import * as S from "modals/TokenSelect/styled"
import { FC, useMemo } from "react"
import ManageToken from "./ManageToken"

interface Props {
  debouncedQuery: string
}

const Tokens: FC<Props> = ({ debouncedQuery }) => {
  const userTokens = useUserTokens()

  const filteredTokens: Token[] = useMemo(() => {
    return Object.values(userTokens).filter(getTokenFilter(debouncedQuery))
  }, [userTokens, debouncedQuery])

  const filteredSortedTokens = useSortTokensByQuery(
    debouncedQuery,
    filteredTokens
  )
  return (
    <>
      {filteredSortedTokens.map((token) => (
        <ManageToken key={token.address} token={token} />
      ))}
      {!filteredSortedTokens.length && (
        <S.Placeholder>No tokens found</S.Placeholder>
      )}
    </>
  )
}

export default Tokens
