import { FC, useMemo, useState } from "react"

import TokensList from "components/TokensList"
import Modal from "components/Modal"

import { useWhitelistTokens } from "hooks/useToken"
import { Currency, Token } from "lib/entities"
import useDebounce from "hooks/useDebounce"
import { useTokenBalancesWithLoadingIndicator } from "hooks/useBalance"
import { useWeb3React } from "@web3-react/core"
import { getTokenFilter } from "lib/hooks/useTokenList/filtering"
import {
  tokenComparator,
  useSortTokensByQuery,
} from "lib/hooks/useTokenList/sorting"

interface Props {
  isOpen: boolean
  onSelect: (token: Token) => void
  onClose: () => void
}

const TokenSelect: FC<Props> = ({ isOpen, onClose, onSelect }) => {
  const { account } = useWeb3React()
  const [searchQuery, setSearchQuery] = useState<string>("")
  const debouncedQuery = useDebounce(searchQuery, 200)
  const allTokens = useWhitelistTokens()

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

  const selectWithClose = (currency: Currency) => {
    const token = currency.isToken ? currency : undefined

    if (!token) return

    onSelect(token)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} toggle={onClose} title="Select token">
      <TokensList
        query={searchQuery}
        onSelect={selectWithClose}
        handleChange={setSearchQuery}
        currencies={filteredSortedTokens}
      />
    </Modal>
  )
}

export default TokenSelect
