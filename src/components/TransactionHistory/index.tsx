import { PulseSpinner } from "react-spinners-kit"
import { createClient } from "urql"
import {
  Dispatch,
  FC,
  HTMLAttributes,
  SetStateAction,
  useMemo,
  useRef,
} from "react"

import useTransactionHistoryUI from "./useTransactionHistoryUI"

import { useActiveWeb3React } from "hooks"
import { UserTransactionsQuery } from "queries"
import useQueryPagination from "hooks/useQueryPagination"
import { TransactionType } from "state/transactions/types"

import LoadMore from "components/LoadMore"
import TransactionHistoryCard from "components/cards/TransactionHistory"

import S from "./styled"
import { Transaction } from "interfaces/thegraphs/interactions"
import { ICON_NAMES } from "constants/index"

const interactionsClient = createClient({
  url: process.env.REACT_APP_INTERACTIONS_API_URL || "",
  requestPolicy: "network-only",
})

interface IProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const TransactionHistory: FC<IProps> = ({ open, setOpen, ...rest }) => {
  const { chainId, account } = useActiveWeb3React()

  const scrollRef = useRef<any>(null)
  const titleRef = useRef<any>(null)

  const [{ filter, scrollH, variants }, { setFilter }] =
    useTransactionHistoryUI(scrollRef, titleRef, open)

  const [{ data, loading }, fetchMore] = useQueryPagination<Transaction>({
    query: UserTransactionsQuery,
    variables: useMemo(
      () => ({ address: account, transactionTypes: [filter] }),
      [account, filter]
    ),
    pause: useMemo(() => !account || !filter, [account, filter]),
    context: interactionsClient,
    formatter: (d) => d.transactions,
  })

  return (
    <S.Container {...rest}>
      <S.Content
        animate={open ? "visible" : "hidden"}
        initial="hidden"
        transition={{ duration: 0.2 }}
        variants={variants}
      >
        <S.Header>
          <S.HeaderButton
            isActive={filter === TransactionType.INVEST}
            onClick={() => {
              setFilter(TransactionType.INVEST)
            }}
          >
            Investing <S.HeaderButtonIcon name={ICON_NAMES.arrowDownDiagonal} />
          </S.HeaderButton>
          <S.HeaderButton
            isActive={filter === TransactionType.DIVEST}
            onClick={() => {
              setFilter(TransactionType.DIVEST)
            }}
          >
            Withdraw <S.HeaderButtonIcon name={ICON_NAMES.arrowUpDiagonal} />
          </S.HeaderButton>
          <S.HeaderButton
            isActive={filter === TransactionType.SWAP}
            onClick={() => {
              setFilter(TransactionType.SWAP)
            }}
          >
            Swap <S.HeaderButtonIcon name={ICON_NAMES.reload} />
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
              />
            ))}

          {(!data || (data.length === 0 && loading)) && (
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

export default TransactionHistory
