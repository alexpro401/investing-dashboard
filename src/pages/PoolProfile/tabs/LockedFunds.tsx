import { isNil } from "lodash"
import { FC, HTMLAttributes, useCallback, useContext, useState } from "react"
import { generatePath, useNavigate } from "react-router-dom"
import { Tooltip } from "recharts"

import { Flex } from "theme"
import { Card } from "common"
import * as S from "./styled"
import usePoolLockedFunds from "hooks/usePoolLockedFunds"
import { CHART_TYPE, TIMEFRAME } from "consts/chart"
import { usePoolLockedFundsHistory } from "hooks/usePool"
import Chart from "components/Chart"
import { TooltipLockedFundsChart } from "pages/PoolProfile/components"
import { PoolProfileContext } from "pages/PoolProfile/context"
import { ROUTE_PATHS } from "consts"

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

  return (
    <>
      <Card>
        <Flex full ai="center" jc="space-between">
          <div>
            <S.Value.Big block color="#E4F2FF" p="0 0 4px">
              ${investorsFundsUSD}
            </S.Value.Big>
            <S.Label>Total Investors funds</S.Label>
          </div>
          <div>
            <S.Value.Big block color="#E4F2FF" p="0 0 4px" align="right">
              ${accountLPsPrice}
            </S.Value.Big>
            <S.Label align="right">My funds</S.Label>
          </div>
        </Flex>
        <Chart
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
          <S.Label align="right">Investor funds</S.Label>
          <Flex ai="center" jc="flex-end">
            <S.Value.Medium color="#E4F2FF">
              ${investorsFundsUSD}
            </S.Value.Medium>
            &nbsp;
            <S.Value.Medium color="#B1C7FC">
              {investorsFundsBase} {baseSymbol}
            </S.Value.Medium>
          </Flex>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.Label align="right">Personal funds</S.Label>
          <Flex ai="center" jc="flex-end">
            <S.Value.Medium color="#E4F2FF">${traderFundsUSD}</S.Value.Medium>
            &nbsp;
            <S.Value.Medium color="#B1C7FC">
              {traderFundsBase} {baseSymbol}
            </S.Value.Medium>
          </Flex>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.Label align="right">
            Fund used ({poolUsedToTotalPercentage}%)
          </S.Label>
          <Flex ai="center" jc="flex-end">
            <S.Value.Medium color="#E4F2FF">
              ${poolUsedInPositionsUSD.format}&nbsp;/&nbsp;
            </S.Value.Medium>
            &nbsp;
            <S.Value.Medium color="#B1C7FC">
              {totalPoolUSD.format}
            </S.Value.Medium>
          </Flex>
        </Flex>
        <S.ProgressBar w={Number(poolUsedToTotalPercentage)} />
        {isTrader && (
          <Flex full>
            <S.AppButtonFull
              onClick={onTerminalNavigate}
              text="Invest more in my fund"
            />
          </Flex>
        )}
      </Card>
    </>
  )
}

export default TabPoolLockedFunds
