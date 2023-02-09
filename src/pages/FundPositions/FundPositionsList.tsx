import { PulseSpinner } from "react-spinners-kit"
import { BigNumber } from "@ethersproject/bignumber"
import { useNavigate, useParams } from "react-router-dom"
import { FC, useCallback, useEffect, useMemo, useState } from "react"

import { useActiveWeb3React } from "hooks"
import { BasicPositionsQuery } from "queries"
import useQueryPagination from "hooks/useQueryPagination"
import { usePoolContract } from "hooks/usePool"
import { useTraderPoolContract } from "contracts"

import LoadMore from "components/LoadMore"
import CardPoolPosition from "common/CardPoolPosition"

import S, {
  BecomeInvestor,
  PoolPositionsListRoot,
  PoolPositionsListHead,
  PoolPositionsListHeadItem,
  PoolPositionsListWrp,
} from "./styled"
import { ZERO } from "consts"
import { IPosition } from "interfaces/thegraphs/all-pools"

import { graphClientAllPools } from "utils/graphClient"
import { NoDataMessage } from "common"
import { useTranslation } from "react-i18next"

const FundPositionsList: FC<{ closed: boolean }> = ({ closed }) => {
  const { poolAddress } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
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
      <PoolPositionsListRoot>
        <PoolPositionsListHead childMaxWidth={closed ? "160.5px" : undefined}>
          <PoolPositionsListHeadItem>
            {t("fund-positions-list.label-pool")}
          </PoolPositionsListHeadItem>
          <PoolPositionsListHeadItem>
            {t("fund-positions-list.label-my-volume")}
          </PoolPositionsListHeadItem>
          <PoolPositionsListHeadItem>
            {t("fund-positions-list.label-entry-price")}
          </PoolPositionsListHeadItem>
          <PoolPositionsListHeadItem>
            {t(
              closed
                ? "fund-positions-list.label-closed-price"
                : "fund-positions-list.label-current-price"
            )}
          </PoolPositionsListHeadItem>
          <PoolPositionsListHeadItem>
            {t("fund-positions-list.label-pnl")}
          </PoolPositionsListHeadItem>
          <PoolPositionsListHeadItem />
        </PoolPositionsListHead>
        <PoolPositionsListWrp>
          {data.map((position) => (
            <CardPoolPosition key={position.id} position={position} />
          ))}
          <LoadMore
            isLoading={loading && !!data.length}
            handleMore={fetchMore}
          />
        </PoolPositionsListWrp>
      </PoolPositionsListRoot>
    </>
  )
}

export default FundPositionsList
