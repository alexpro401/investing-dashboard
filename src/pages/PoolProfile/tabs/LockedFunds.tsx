import { isNil } from "lodash"
import { FC, HTMLAttributes, useCallback, useContext } from "react"
import { generatePath, useNavigate } from "react-router-dom"
import { Tooltip } from "recharts"

import { Flex } from "theme"
import { Card } from "common"
import * as S from "./styled"
import { CHART_TYPE } from "consts/chart"
import Chart from "components/Chart"
import { TooltipLockedFundsChart } from "pages/PoolProfile/components"
import { PoolProfileContext } from "pages/PoolProfile/context"
import { ROUTE_PATHS } from "consts"
import { normalizeBigNumber } from "utils"
import { useWindowSize } from "react-use"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const TabPoolLockedFunds: FC<Props> = ({ ...rest }) => {
  const {
    poolData,
    isTrader,
    accountLPsPrice,
    baseSymbol,
    totalPoolUSD,
    traderFundsUSD,
    traderFundsBase,
    investorsFundsUSD,
    investorsFundsBase,
    poolUsedInPositionsUSD,
    poolUsedToTotalPercentage,
    tf,
    setTf,
    poolLockedFundHistoryChartData,
    isPoolLockedFundHistoryChartDataFetching,
  } = useContext(PoolProfileContext)

  const navigate = useNavigate()

  const onTerminalNavigate = useCallback(() => {
    if (isNil(poolData.id)) return
    navigate(generatePath(ROUTE_PATHS.poolInvest, { poolAddress: poolData.id }))
  }, [poolData.id, navigate])

  const { width: windowWidth } = useWindowSize()

  return (
    <>
      <Card>
        <Flex dir="column" full ai="center" jc="space-between">
          <Flex full>
            <S.TabCardLabel>Total Investors funds</S.TabCardLabel>
            <S.TabCardValue>${investorsFundsUSD}</S.TabCardValue>
          </Flex>
          <Flex full>
            <S.TabCardLabel>My funds</S.TabCardLabel>
            <S.TabCardValue>
              ${normalizeBigNumber(accountLPsPrice)}
            </S.TabCardValue>
          </Flex>
        </Flex>
        <Chart
          key={windowWidth}
          type={CHART_TYPE.area}
          height={"130px"}
          data={poolLockedFundHistoryChartData}
          chart={{
            stackOffset: "silhouette",
          }}
          chartItems={[
            {
              isAnimationActive: true,
              type: "linear",
              dataKey: "traderUSDValue",
              stroke: "#ffffff",
            },
            {
              isAnimationActive: true,
              type: "linear",
              dataKey: "investorsUSD",
              stroke: "#9AE2CB",
            },
          ]}
          timeframe={{ get: tf, set: setTf }}
          timeframePosition="bottom"
          loading={isPoolLockedFundHistoryChartDataFetching}
        >
          <Tooltip
            content={(p) => {
              return <TooltipLockedFundsChart {...p} />
            }}
          />
        </Chart>
      </Card>
      <Card>
        <Flex full ai="center" jc="space-between">
          <S.TabCardLabel>Investor funds</S.TabCardLabel>
          <Flex ai="center" jc="flex-end">
            <S.TabCardValue>${investorsFundsUSD}</S.TabCardValue>
            &nbsp;
            <S.TabCardLabel>
              {investorsFundsBase} {baseSymbol}
            </S.TabCardLabel>
          </Flex>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.TabCardLabel>Personal funds</S.TabCardLabel>
          <Flex ai="center" jc="flex-end">
            <S.TabCardValue>${traderFundsUSD}</S.TabCardValue>
            &nbsp;
            <S.TabCardLabel>
              {traderFundsBase} {baseSymbol}
            </S.TabCardLabel>
          </Flex>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.TabCardLabel>
            Fund used ({poolUsedToTotalPercentage}%)
          </S.TabCardLabel>
          <Flex ai="center" jc="flex-end">
            <S.TabCardValue>
              ${poolUsedInPositionsUSD.format}&nbsp;/&nbsp;
            </S.TabCardValue>
            &nbsp;
            <S.TabCardValue>{totalPoolUSD.format}</S.TabCardValue>
          </Flex>
        </Flex>
        <S.ProgressBar w={Number(poolUsedToTotalPercentage)} />
        {isTrader && (
          <Flex full>
            <S.AppButtonFull
              onClick={onTerminalNavigate}
              color="tertiary"
              text="Invest more in my fund"
            />
          </Flex>
        )}
      </Card>
    </>
  )
}

export default TabPoolLockedFunds
