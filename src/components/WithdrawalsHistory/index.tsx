import { RotateSpinner } from "react-spinners-kit"
import { FC, useMemo, useEffect, useRef } from "react"
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"

import { FundFeeHistoryQuery } from "queries"
import useQueryPagination from "hooks/useQueryPagination"

import LoadMore from "components/LoadMore"
import WithdrawalHistoryCard from "components/cards/WithdrawalHistory"

import S from "./styled"

interface IProps {
  unlockDate: string
  poolAddress: string
}

const WithdrawalsHistory: FC<IProps> = ({ unlockDate, poolAddress }) => {
  const variables = useMemo<{ address: string }>(
    () => ({ address: poolAddress }),
    [poolAddress]
  )

  const [{ data, loading }, fetchMore] = useQueryPagination(
    FundFeeHistoryQuery,
    variables,
    (d) => d.feeHistories
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
              <WithdrawalHistoryCard key={t.id} payload={t} m="16px 0 0" />
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

export default WithdrawalsHistory
