import { FC, useMemo, useEffect, useRef } from "react"
import { createClient, Provider as GraphProvider } from "urql"
import { RotateSpinner } from "react-spinners-kit"
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"

import { useActiveWeb3React } from "hooks"
import { UserTransactionsQuery } from "queries"
import useQueryPagination from "hooks/useQueryPagination"
import { TransactionType } from "state/transactions/types"

import LoadMore from "components/LoadMore"
import WithdrawalHistoryCard from "components/cards/WithdrawalHistory"

import S from "./styled"

const poolsClient = createClient({
  url: process.env.REACT_APP_INTERACTIONS_API_URL || "",
  requestPolicy: "network-only",
})

interface IProps {
  unlockDate: string
}

const WithdrawalsHistory: FC<IProps> = ({ unlockDate }) => {
  const { account } = useActiveWeb3React()

  const variables = useMemo<{
    address: string | null | undefined
    transactionTypes: TransactionType[]
  }>(
    () => ({
      address: account,
      transactionTypes: [TransactionType.TRADER_GET_PERFORMANCE_FEE],
    }),
    [account]
  )

  const [{ data, error, loading }, fetchMore] = useQueryPagination(
    UserTransactionsQuery,
    variables,
    (d) => d.transactions
  )

  const loader = useRef<any>()
  const showLoader = useMemo<boolean>(
    () => !data || (data.length === 0 && loading),
    [data, loading]
  )
  const showNoDataMessage = useMemo<boolean>(
    () => data.length === 0 && !loading,
    [data, loading]
  )

  // manually disable scrolling *refresh this effect when ref container dissapeared from DOM
  useEffect(() => {
    if (!loader.current) return
    disableBodyScroll(loader.current)

    return () => clearAllBodyScrollLocks()
  }, [loader, loading])

  return (
    <>
      <S.Title>Withdrawal history</S.Title>
      <S.Container>
        {data.length > 0 && (
          <S.ListHeader>
            <S.ListHeaderItem>P&L</S.ListHeaderItem>
            <S.ListHeaderItem>Fund Profit</S.ListHeaderItem>
            <S.ListHeaderItem>Perfomance Fee</S.ListHeaderItem>
          </S.ListHeader>
        )}

        {showLoader && (
          <S.Content>
            <RotateSpinner />
          </S.Content>
        )}
        {showNoDataMessage && (
          <S.Content>
            <S.WithoutData>
              Take you first withdraw after {unlockDate}
            </S.WithoutData>
          </S.Content>
        )}
        {data.length > 0 && (
          <S.List ref={loader}>
            {data.map((t) => (
              <WithdrawalHistoryCard
                key={t.id}
                payload={t.getPerfomanceFee}
                timestamp={t.timestamp}
                m="16px 0 0"
              />
            ))}
            <LoadMore
              isLoading={loading && !!data.length}
              handleMore={fetchMore}
              r={loader}
            />
          </S.List>
        )}
      </S.Container>
    </>
  )
}

const WithdrawalsHistoryWithProvider = (props) => {
  return (
    <GraphProvider value={poolsClient}>
      <WithdrawalsHistory {...props} />
    </GraphProvider>
  )
}

export default WithdrawalsHistoryWithProvider
