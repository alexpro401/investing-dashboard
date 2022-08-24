import { PulseSpinner } from "react-spinners-kit"
import { createClient, Provider as GraphProvider } from "urql"
import { Dispatch, SetStateAction, useCallback, useMemo, useRef } from "react"

import useTransactionHistoryUI from "./useTransactionHistoryUI"

import { useActiveWeb3React } from "hooks"
import { UserTransactionsQuery } from "queries"
import { useERC20List } from "hooks/useContract"
import useQueryPagination from "hooks/useQueryPagination"
import { TransactionType } from "state/transactions/types"

import LoadMore from "components/LoadMore"
import TransactionHistoryCard from "components/cards/TransactionHistory"

import S from "./styled"

import Invest from "assets/icons/Invest"
import Withdraw from "assets/icons/Withdraw"
import Swap from "assets/icons/Swap"
import Expand from "assets/icons/Expand"
import Shrink from "assets/icons/Shrink"

const poolsClient = createClient({
  url: process.env.REACT_APP_INTERACTIONS_API_URL || "",
  requestPolicy: "network-only",
})

interface IProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const TransactionHistory: React.FC<IProps> = ({ open, setOpen }) => {
  const { chainId, account } = useActiveWeb3React()

  const scrollRef = useRef<any>(null)
  const titleRef = useRef<any>(null)

  const toggleOpen = useCallback(() => {
    setOpen((prev) => !prev)
  }, [setOpen])

  const [{ filter, scrollH, variants }, { setFilter }] =
    useTransactionHistoryUI(scrollRef, titleRef, open)

  const variables = useMemo<{
    address: string | null | undefined
    transactionTypes: TransactionType[]
  }>(
    () => ({
      address: account,
      transactionTypes: [filter],
    }),
    [account, filter]
  )

  const [{ data, error, loading }, fetchMore] = useQueryPagination(
    UserTransactionsQuery,
    variables,
    (d) => d.transactions
  )

  const getTokensList = useCallback(
    (payload) => {
      switch (filter) {
        case TransactionType.SWAP:
          const tokens = payload.reduce((acc, t) => {
            return [
              ...new Set([
                ...acc,
                t.exchange[0]?.fromToken,
                t.exchange[0]?.toToken,
              ]),
            ]
          }, [])
          tokens["_isPools"] = false
          return tokens
        case TransactionType.INVEST:
        case TransactionType.DIVEST:
          const pools = [...new Set(payload.map((p) => p.vest[0]?.pool))]
          pools["_isPools"] = true
          return pools
        default:
          return []
      }
    },
    [filter]
  )

  const tokensList = useMemo(() => {
    const list = getTokensList(data)
    return { list, _isPools: list._isPools }
  }, [data, getTokensList])

  const tokensData = useERC20List(tokensList)

  return (
    <S.Container>
      <S.Heading
        animate={{
          opacity: open ? 0 : 1,
          transition: { duration: open ? 0.1 : 0.4 },
        }}
        ref={titleRef}
      >
        Transactions History
      </S.Heading>
      <S.Content
        animate={open ? "visible" : "hidden"}
        initial="hidden"
        transition={{ duration: 0.2 }}
        variants={variants}
      >
        <S.Header>
          <S.HeaderButton
            onClick={() => setFilter(TransactionType.INVEST)}
            focused={filter === TransactionType.INVEST}
          >
            Investing <Invest active={filter === TransactionType.INVEST} />
          </S.HeaderButton>
          <S.HeaderButton
            onClick={() => setFilter(TransactionType.SWAP)}
            focused={filter === TransactionType.SWAP}
          >
            Swap <Swap active={filter === TransactionType.SWAP} />
          </S.HeaderButton>
          <S.HeaderButton
            onClick={() => setFilter(TransactionType.DIVEST)}
            focused={filter === TransactionType.DIVEST}
          >
            Withdraw <Withdraw active={filter === TransactionType.DIVEST} />
          </S.HeaderButton>
          <S.HeaderButton onClick={toggleOpen}>
            {open ? <Shrink /> : <Expand />}
          </S.HeaderButton>
        </S.Header>
        <S.List
          ref={scrollRef}
          style={{
            height: scrollH,
          }}
        >
          {!!data.length &&
            data.map((tx) => (
              <TransactionHistoryCard
                key={tx.id}
                payload={tx}
                chainId={chainId}
                tokensData={tokensData}
              />
            ))}

          {(!data || (data.length === 0 && loading) || !tokensData) && (
            <S.ListPlaceholder>
              <PulseSpinner />
            </S.ListPlaceholder>
          )}

          {(!data || (!data.length && !loading)) && (
            <S.ListPlaceholder>No transactions</S.ListPlaceholder>
          )}
          <LoadMore
            isLoading={loading && !!data.length}
            handleMore={fetchMore}
            r={scrollRef}
          />
        </S.List>
      </S.Content>
    </S.Container>
  )
}

const TransactionHistoryWithProvider = (props) => {
  return (
    <GraphProvider value={poolsClient}>
      <TransactionHistory {...props} />
    </GraphProvider>
  )
}

export default TransactionHistoryWithProvider
