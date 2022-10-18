import React, { useCallback, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useWeb3React } from "@web3-react/core"

import IconButton from "components/IconButton"
import TokensList from "components/TokensList"
import Header, { EHeaderTitles } from "components/Header"

import { usePoolBalancesWithLoadingIndicator } from "hooks/useBalance"
import { useToken, useUnsupportedTokens, useAllTokens } from "hooks/useToken"

import back from "assets/icons/angle-left.svg"

import useDebounce from "hooks/useDebounce"
import { isAddress } from "utils"
import { getTokenFilter } from "lib/hooks/useTokenList/filtering"
import {
  tokenComparator,
  useSortTokensByQuery,
} from "lib/hooks/useTokenList/sorting"
import { Currency, Token } from "lib/entities"

import * as S from "./styled"

const TokenSelect: React.FC = () => {
  const navigate = useNavigate()
  const { account } = useWeb3React()
  const { type, poolAddress, field, address } = useParams()
  const [searchQuery, setSearchQuery] = useState<string>("")
  const debouncedQuery = useDebounce(searchQuery, 200)

  const isAddressSearch = isAddress(debouncedQuery)

  const searchToken = useToken(debouncedQuery)

  const allTokens = useAllTokens()

  const allTokensArray = useMemo(
    () => Object.values(allTokens ?? {}),
    [allTokens]
  )

  const [balances, balancesIsLoading] = usePoolBalancesWithLoadingIndicator(
    poolAddress,
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

  const onSelect = useCallback(
    (currency: Currency) => {
      const rootPath = `/pool/swap/${type}/${poolAddress}`
      const token = currency.isToken ? currency : undefined

      if (!token) return

      if (field === "from") {
        navigate(`${rootPath}/${token.address}/${address}`)
      }
      if (field === "to") {
        navigate(`${rootPath}/${address}/${token.address}`)
      }
    },
    [navigate, poolAddress, type, field, address]
  )

  return (
    <>
      <Header title={EHeaderTitles.myTraderProfile} />

      <S.Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <S.Card>
          <S.CardHeader>
            <S.TitleContainer>
              <IconButton media={back} onClick={() => navigate(-1)} />
              <S.Title>Select token</S.Title>
            </S.TitleContainer>
          </S.CardHeader>
          <TokensList
            poolAddress={poolAddress}
            handleChange={setSearchQuery}
            currencies={filteredSortedTokens}
            onSelect={onSelect}
            query={searchQuery}
          />
        </S.Card>
      </S.Container>
    </>
  )
}

export default TokenSelect
