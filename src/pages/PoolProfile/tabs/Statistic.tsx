import { FC, HTMLAttributes, useContext } from "react"
import { v4 as uuidv4 } from "uuid"
import * as S from "./styled"
import { Card } from "common"
import { Flex } from "theme"
import Tooltip from "components/Tooltip"
import { PoolProfileContext } from "pages/PoolProfile/context"
import { normalizeBigNumber } from "utils"

const MAX_INVESTORS = 1000
const MAX_OPEN_TRADES = 25

interface Props extends HTMLAttributes<HTMLDivElement> {}

const TabPoolStatistic: FC<Props> = ({ ...rest }) => {
  const {
    poolData,
    investorsCount,
    openPositionsLen,
    orderSize,
    dailyProfit,
    timePosition,
    sortinoETH,
    sortinoBTC,
    totalTrades,
    maxLoss,
    altPnlUSD_USD,
    altPnlUSD_Percentage,
    altPnlETH_USD,
    altPnlETH_Percentage,
    altPnlBTC_USD,
    altPnlBTC_Percentage,
    pnlPerc,
    pnlUSD,
  } = useContext(PoolProfileContext)

  return (
    <>
      <Card>
        <S.TabCardTitle>Total P&L</S.TabCardTitle>
        <S.GridTwoColumn>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>DEXE</S.TabCardLabel>
            <div>
              <S.TabCardValue>{pnlUSD}</S.TabCardValue>&nbsp;
              <S.TabCardLabel>({pnlPerc}%)</S.TabCardLabel>
            </div>
          </Flex>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>USD</S.TabCardLabel>
            <div>
              <S.TabCardValue>{altPnlUSD_USD}</S.TabCardValue>
              &nbsp;
              <S.TabCardLabel>({altPnlUSD_Percentage}%)</S.TabCardLabel>
            </div>
          </Flex>
        </S.GridTwoColumn>
        <S.GridTwoColumn>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>ETH</S.TabCardLabel>
            <div>
              <S.TabCardValue>{altPnlETH_USD}</S.TabCardValue>
              &nbsp;
              <S.TabCardLabel>({altPnlETH_Percentage}%)</S.TabCardLabel>
            </div>
          </Flex>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>BTC</S.TabCardLabel>
            <div>
              <S.TabCardValue>{altPnlBTC_USD}</S.TabCardValue>
              &nbsp;
              <S.TabCardLabel>({altPnlBTC_Percentage}%)</S.TabCardLabel>
            </div>
          </Flex>
        </S.GridTwoColumn>
      </Card>
      <Card>
        <S.TabCardTitle>Average</S.TabCardTitle>
        <S.GridTwoColumn>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>Trades per Day</S.TabCardLabel>
            <S.TabCardValue>{poolData.averageTrades}</S.TabCardValue>
          </Flex>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>Order Size</S.TabCardLabel>
            <S.TabCardValue>
              {normalizeBigNumber(orderSize, 4, 2)}%
            </S.TabCardValue>
          </Flex>
        </S.GridTwoColumn>

        <S.GridTwoColumn>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>Daily Profit</S.TabCardLabel>
            <S.TabCardValue>{dailyProfit}%</S.TabCardValue>
          </Flex>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>Time Positions</S.TabCardLabel>
            <S.TabCardValue>{timePosition}</S.TabCardValue>
          </Flex>
        </S.GridTwoColumn>

        <S.GridTwoColumn>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>Sortino (ETH)</S.TabCardLabel>
            <S.TabCardValue>{sortinoETH}</S.TabCardValue>
          </Flex>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>Sortino (BTC)</S.TabCardLabel>
            <S.TabCardValue>{sortinoBTC}</S.TabCardValue>
          </Flex>
        </S.GridTwoColumn>

        <S.GridTwoColumn>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>Trades</S.TabCardLabel>
            <S.TabCardValue>{totalTrades}</S.TabCardValue>
          </Flex>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>Max. loss</S.TabCardLabel>
            <S.TabCardValue>
              {normalizeBigNumber(maxLoss, 4, 2)}%
            </S.TabCardValue>
          </Flex>
        </S.GridTwoColumn>
      </Card>
      <Card>
        <div>
          <Flex full ai="center" jc="space-between" m="0 0 12px">
            <S.TabCardValue>Depositors - {investorsCount}</S.TabCardValue>
            <Flex ai="center" jc="flex-end" gap="4">
              <S.TabCardLabel>
                {MAX_INVESTORS - investorsCount} Left
              </S.TabCardLabel>
              <Tooltip id={uuidv4()}>Depositors</Tooltip>
            </Flex>
          </Flex>
          <S.ProgressBar w={(investorsCount / MAX_INVESTORS) * 100} />
        </div>
        <div>
          <Flex full ai="center" jc="space-between" m="4px 0 12px">
            <S.TabCardValue>Fund positions - {openPositionsLen}</S.TabCardValue>
            <Flex ai="center" jc="flex-end" gap="4">
              <S.TabCardLabel>
                {MAX_OPEN_TRADES - openPositionsLen} Left
              </S.TabCardLabel>
              <Tooltip id={uuidv4()}>Fund positions</Tooltip>
            </Flex>
          </Flex>
          <S.ProgressBar w={(openPositionsLen / MAX_OPEN_TRADES) * 100} />
        </div>
      </Card>
    </>
  )
}

export default TabPoolStatistic
