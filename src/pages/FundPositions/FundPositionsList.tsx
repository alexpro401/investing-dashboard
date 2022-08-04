import { FC, useEffect, useMemo, useRef } from "react"
import { useParams } from "react-router-dom"
import { PulseSpinner } from "react-spinners-kit"
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"

import { BasicPositionsQuery } from "queries"
import useQueryPagination from "hooks/useQueryPagination"

import PoolPositionCard from "components/cards/position/Pool"
import LoadMore from "components/LoadMore"

import S from "./styled"

const FundPositionsList: FC<{ closed: boolean }> = ({ closed }) => {
  const { poolAddress } = useParams()

  const variables = useMemo(
    () => ({
      address: poolAddress,
      closed,
    }),
    [closed, poolAddress]
  )

  const prepareNewData = (d) => [d.positions]

  const [{ data, error, loading }, fetchMore] = useQueryPagination(
    BasicPositionsQuery,
    variables,
    prepareNewData
  )

  const loader = useRef<any>()

  // manually disable scrolling *refresh this effect when ref container dissapeared from DOM
  useEffect(() => {
    if (!loader.current) return
    disableBodyScroll(loader.current)

    return () => clearAllBodyScrollLocks()
  }, [loader, loading])

  if (!data && loading) {
    return (
      <S.Content>
        <PulseSpinner />
      </S.Content>
    )
  }

  if (data && data.length === 0) {
    return (
      <S.Content>
        <S.WithoutData>No {closed ? "closed" : "open"} positions</S.WithoutData>
      </S.Content>
    )
  }

  return (
    <>
      <S.List ref={loader}>
        {data &&
          data.map((position) => (
            <PoolPositionCard key={position.id} position={position} />
          ))}
        <LoadMore
          isLoading={loading && !!data.length}
          handleMore={fetchMore}
          r={loader}
        />
      </S.List>
    </>
  )
}

export default FundPositionsList
