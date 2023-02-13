import { PulseSpinner } from "react-spinners-kit"
import { generatePath, useNavigate, useParams } from "react-router-dom"
import { FC, useCallback, useMemo } from "react"

import {
  useActiveWeb3React,
  usePoolPositionsList,
  usePoolUserInfo,
} from "hooks"
import { usePoolContract } from "hooks/usePool"

import LoadMore from "components/LoadMore"
import CardPoolPosition from "common/CardPoolPosition"
import BecomeInvestorModal from "modals/BecomeInvestorModal"

import S, {
  PoolPositionsListRoot,
  PoolPositionsListHead,
  PoolPositionsListHeadItem,
  PoolPositionsListWrp,
} from "./styled"
import { ROUTE_PATHS, ZERO } from "consts"
import { NoDataMessage } from "common"
import { useTranslation } from "react-i18next"
import { isEmpty, isEqual, isNil } from "lodash"
import { isAddress } from "@ethersproject/address"

const FundPositionsList: FC<{ closed: boolean }> = ({ closed }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { poolAddress } = useParams()
  const { account } = useActiveWeb3React()
  const [, poolInfo] = usePoolContract(poolAddress)
  const userInfoInPool = usePoolUserInfo(poolAddress ?? "", account ?? "")
  const [{ data, loading }, fetchMore] = usePoolPositionsList(
    poolAddress ?? "",
    closed
  )

  const isUserPoolTrader = useMemo<boolean>(() => {
    if (isNil(poolInfo) || isNil(account)) return false
    return isEqual(
      String(poolInfo.parameters.trader).toLowerCase(),
      String(account).toLowerCase()
    )
  }, [poolInfo, account])

  const userHaveInvestmentsInPool = useMemo<boolean>(() => {
    if (isNil(account) || isNil(poolInfo) || isNil(userInfoInPool)) {
      return false
    }

    return userInfoInPool.poolLPBalance.lte(ZERO)
  }, [account, poolInfo, userInfoInPool])

  const openPositionsCount = useMemo<number>(() => {
    if (!poolInfo) return 0
    return poolInfo.openPositions.length
  }, [poolInfo])

  const onInvest = useCallback(() => {
    if (isNil(poolAddress) || !isAddress(poolAddress)) return
    navigate(generatePath(ROUTE_PATHS.poolInvest, { poolAddress: poolAddress }))
  }, [navigate, poolAddress])

  return (
    <>
      <BecomeInvestorModal
        isOpen={!isUserPoolTrader && userHaveInvestmentsInPool}
        symbol={poolInfo?.ticker ?? ""}
        action={onInvest}
        positionCount={openPositionsCount}
      />
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
        {isEmpty(data) ? (
          loading ? (
            <S.Content>
              <PulseSpinner />
            </S.Content>
          ) : (
            <NoDataMessage />
          )
        ) : (
          <PoolPositionsListWrp>
            {data.map((position) => (
              <CardPoolPosition key={position.id} position={position} />
            ))}
            <LoadMore
              isLoading={loading && !!data.length}
              handleMore={fetchMore}
            />
          </PoolPositionsListWrp>
        )}
      </PoolPositionsListRoot>
    </>
  )
}

export default FundPositionsList
