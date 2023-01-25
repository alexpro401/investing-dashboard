import { PulseSpinner } from "react-spinners-kit"
import { BigNumber } from "@ethersproject/bignumber"
import { useNavigate, useParams } from "react-router-dom"
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react"

import { useActiveWeb3React } from "hooks"
import { BasicPositionsQuery } from "queries"
import useQueryPagination from "hooks/useQueryPagination"
import { usePoolContract } from "hooks/usePool"
import { useTraderPoolContract } from "contracts"

import LoadMore from "components/LoadMore"
import PoolPositionCard from "components/cards/position/Pool"

import S, {
  BecomeInvestor,
  PoolPositionsListWrp,
  PoolPositionsListHead,
  PoolPositionsListHeadItem,
} from "./styled"
import { ZERO } from "consts"
import { IPosition } from "interfaces/thegraphs/all-pools"

import { graphClientAllPools } from "utils/graphClient"
import { NoDataMessage } from "common"

const FundPositionsList: FC<{ closed: boolean }> = ({ closed }) => {
  const { poolAddress } = useParams()
  const navigate = useNavigate()
  const { account } = useActiveWeb3React()

  const traderPool = useTraderPoolContract(poolAddress)
  const [, poolInfo] = usePoolContract(poolAddress)

  const [totalAccountInvestedLP, setTotalAccountInvestedLP] =
    useState<BigNumber>(ZERO)

  const [{ data, loading }, fetchMore] = useQueryPagination<IPosition>({
    query: BasicPositionsQuery,
    variables: useMemo(
      () => ({ address: poolAddress, closed }),
      [closed, poolAddress]
    ),
    pause: !poolAddress,
    context: graphClientAllPools,
    formatter: (d) => d.positions,
  })

  const loader = useRef<any>()

  const showInvestAction = useMemo<boolean>(() => {
    if (
      !poolInfo ||
      !account ||
      loading ||
      closed ||
      poolInfo.parameters.trader === account
    ) {
      return false
    }

    return !totalAccountInvestedLP.gt(ZERO)
  }, [account, closed, loading, poolInfo, totalAccountInvestedLP])

  const openPositionsCount = useMemo<number>(() => {
    if (!poolInfo) return 0
    return poolInfo.openPositions.length
  }, [poolInfo])

  const onInvest = useCallback(() => {
    if (!poolAddress) return
    navigate(`/pool/invest/${poolAddress}`)
  }, [navigate, poolAddress])

  // manually disable scrolling *refresh this effect when ref container dissapeared from DOM
  useEffect(() => {
    if (!loader.current) return
    disableBodyScroll(loader.current)

    return () => clearAllBodyScrollLocks()
  }, [loader, loading])

  // Fetch current account investments in pool
  useEffect(() => {
    if (!traderPool || !poolInfo || !account) return
    ;(async () => {
      try {
        const usersData = await traderPool.getUsersInfo(account, 0, 0)
        if (usersData && !!usersData.length) {
          setTotalAccountInvestedLP(usersData[0].poolLPBalance)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [account, poolInfo, traderPool])

  if (!data && loading) {
    return (
      <S.Content>
        <PulseSpinner />
      </S.Content>
    )
  }

  if (data && data.length === 0) {
    return <NoDataMessage />
  }

  return (
    <>
      {showInvestAction && (
        <BecomeInvestor
          symbol={poolInfo?.ticker ?? ""}
          action={onInvest}
          positionCount={openPositionsCount}
        />
      )}
      <PoolPositionsListWrp>
        <PoolPositionsListHead>
          <PoolPositionsListHeadItem>Pool</PoolPositionsListHeadItem>
          <PoolPositionsListHeadItem>Volume</PoolPositionsListHeadItem>
          <PoolPositionsListHeadItem>Entry Price</PoolPositionsListHeadItem>
          <PoolPositionsListHeadItem>
            {closed ? "Closed price " : "Current price "}
          </PoolPositionsListHeadItem>
          <PoolPositionsListHeadItem>P&L</PoolPositionsListHeadItem>
        </PoolPositionsListHead>
        {data.map((position) => (
          <PoolPositionCard key={position.id} position={position} />
        ))}
      </PoolPositionsListWrp>

      <LoadMore
        isLoading={loading && !!data.length}
        handleMore={fetchMore}
        r={undefined}
      />
    </>
  )
}

export default FundPositionsList
