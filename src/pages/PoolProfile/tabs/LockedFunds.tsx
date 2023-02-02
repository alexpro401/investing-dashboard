import { isNil } from "lodash"
import { FC, HTMLAttributes, useCallback, useContext } from "react"
import { generatePath, useNavigate } from "react-router-dom"
import { Tooltip } from "recharts"

import theme, { Flex } from "theme"
import { Card } from "common"
import * as S from "./styled"
import { CHART_TYPE } from "consts/chart"
import Chart from "components/Chart"
import { TooltipLockedFundsChart } from "pages/PoolProfile/components"
import { PoolProfileContext } from "pages/PoolProfile/context"
import { ROUTE_PATHS } from "consts"
import { normalizeBigNumber } from "utils"
import { useWindowSize } from "react-use"
import { useBreakpoints } from "hooks"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const TabPoolLockedFunds: FC<Props> = ({ ...rest }) => {
  const {
    fundAddress,
    isTrader,

    lockedFunds,
  } = useContext(PoolProfileContext)

  const navigate = useNavigate()

  const onTerminalNavigate = useCallback(() => {
    if (isNil(fundAddress)) return

    navigate(generatePath(ROUTE_PATHS.poolInvest, { poolAddress: fundAddress }))
  }, [fundAddress, navigate])

  const { isSmallTablet } = useBreakpoints()

  const { width: windowWidth } = useWindowSize()

  return (
    <>
      <Card>
        <Flex dir="column" full ai="center" jc="space-between">
          <Flex full>
            <S.TabCardLabel>Total Investors funds</S.TabCardLabel>
            <S.TabCardValue>${lockedFunds?.investorsFundsUSD}</S.TabCardValue>
          </Flex>
          <Flex full>
            <S.TabCardLabel>My funds</S.TabCardLabel>
            <S.TabCardValue>
              ${normalizeBigNumber(lockedFunds?.accountLPsPrice)}
            </S.TabCardValue>
          </Flex>
        </Flex>
        <Chart
          key={windowWidth}
          type={CHART_TYPE.area}
          height={"130px"}
          data={lockedFunds?.poolLockedFundHistoryChartData}
          chart={{
            stackOffset: "silhouette",
          }}
          chartItems={[
            {
              isAnimationActive: true,
              type: "linear",
              dataKey: "traderUSDValue",
              stroke: theme.brandColors.secondary,
            },
            {
              isAnimationActive: true,
              type: "linear",
              dataKey: "investorsUSD",
              stroke: "#ffffff",
            },
          ]}
          timeframe={{ get: lockedFunds?.tf, set: lockedFunds?.setTf }}
          timeframePosition="bottom"
          loading={lockedFunds?.isPoolLockedFundHistoryChartDataFetching}
        >
          <Tooltip
            content={(p) => {
              return <TooltipLockedFundsChart {...p} />
            }}
          />
        </Chart>
        <S.PnlSubChartCard>
          <S.PnlSubChartCardItem>
            <S.TabCardLabel>Investor funds</S.TabCardLabel>
            <S.TabCardValue>
              ${lockedFunds?.investorsFundsUSD}{" "}
              {lockedFunds?.investorsFundsBase} {lockedFunds?.baseSymbol}
            </S.TabCardValue>
          </S.PnlSubChartCardItem>
          <S.PnlSubChartCardItem>
            <S.TabCardLabel>Personal funds</S.TabCardLabel>
            <S.TabCardValue>
              ${lockedFunds?.traderFundsUSD} {lockedFunds?.traderFundsBase}{" "}
              {lockedFunds?.baseSymbol}
            </S.TabCardValue>
          </S.PnlSubChartCardItem>
          <S.PnlSubChartCardItem>
            <S.TabCardLabel>
              Fund used ({lockedFunds?.poolUsedToTotalPercentage}%)
            </S.TabCardLabel>
            <S.TabCardValue>
              ${lockedFunds?.poolUsedInPositionsUSD.format}&nbsp;/&nbsp;
              {lockedFunds?.totalPoolUSD.format}
            </S.TabCardValue>
          </S.PnlSubChartCardItem>
        </S.PnlSubChartCard>
      </Card>
    </>
  )
}

export default TabPoolLockedFunds
