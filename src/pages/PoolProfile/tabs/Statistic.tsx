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
  } = useContext(PoolProfileContext)

  return (
    <>
      <Card>
        <S.TabCardTitle color="#9AE2CB">Total P&L</S.TabCardTitle>
        <S.GridTwoColumn>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>DEXE</S.TabCardLabel>
            <div>
              <S.TabCardValue color="#E4F2FF">$230,000</S.TabCardValue>&nbsp;
              <S.TabCardLabel color="#B1C7FC">(50%)</S.TabCardLabel>
            </div>
          </Flex>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>USD</S.TabCardLabel>
            <div>
              <S.TabCardValue color="#E4F2FF">$500,000</S.TabCardValue>&nbsp;
              <S.TabCardLabel color="#B1C7FC">(500%)</S.TabCardLabel>
            </div>
          </Flex>
        </S.GridTwoColumn>
        <S.GridTwoColumn>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>ETH</S.TabCardLabel>
            <div>
              <S.TabCardValue color="#E4F2FF">$30,214</S.TabCardValue>&nbsp;
              <S.TabCardLabel color="#B1C7FC">(50%)</S.TabCardLabel>
            </div>
          </Flex>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>BTC</S.TabCardLabel>
            <div>
              <S.TabCardValue color="#E4F2FF">3,134</S.TabCardValue>&nbsp;
              <S.TabCardLabel color="#B1C7FC">(238%)</S.TabCardLabel>
            </div>
          </Flex>
        </S.GridTwoColumn>
      </Card>
      <Card>
        <S.TabCardTitle color="#9AE2CB">Average</S.TabCardTitle>
        <S.GridTwoColumn>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>Trades per Day</S.TabCardLabel>
            <S.TabCardValue color="#E4F2FF">
              {poolData.averageTrades}
            </S.TabCardValue>
          </Flex>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>Order Size</S.TabCardLabel>
            <S.TabCardValue color="#E4F2FF">
              {normalizeBigNumber(orderSize, 4, 2)}%
            </S.TabCardValue>
          </Flex>
        </S.GridTwoColumn>

        <S.GridTwoColumn>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>Daily Profit</S.TabCardLabel>
            <S.TabCardValue color="#E4F2FF">{dailyProfit}%</S.TabCardValue>
          </Flex>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>Time Positions</S.TabCardLabel>
            <S.TabCardValue color="#E4F2FF">{timePosition}</S.TabCardValue>
          </Flex>
        </S.GridTwoColumn>

        <S.GridTwoColumn>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>Sortino (ETH)</S.TabCardLabel>
            <S.TabCardValue color="#E4F2FF">{sortinoETH}</S.TabCardValue>
          </Flex>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>Sortino (BTC)</S.TabCardLabel>
            <S.TabCardValue color="#E4F2FF">{sortinoBTC}</S.TabCardValue>
          </Flex>
        </S.GridTwoColumn>

        <S.GridTwoColumn>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>Trades</S.TabCardLabel>
            <S.TabCardValue color="#E4F2FF">{totalTrades}</S.TabCardValue>
          </Flex>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>Max. loss</S.TabCardLabel>
            <S.TabCardValue color="#E4F2FF">
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
              <S.TabCardLabel color="#E4F2FF">
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
              <S.TabCardLabel color="#E4F2FF">
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
