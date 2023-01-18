import { FC, HTMLAttributes, useContext } from "react"
import { v4 as uuidv4 } from "uuid"
import * as S from "./styled"
import { Card } from "common"
import { Flex } from "theme"
import Tooltip from "components/Tooltip"
import { PoolProfileContext } from "pages/PoolProfile/context"
import { normalizeBigNumber } from "utils"
import { BigNumber } from "@ethersproject/bignumber"

const MAX_INVESTORS = 1000
const MAX_OPEN_TRADES = 25

function getUSDRenderValue(value?: BigNumber): string {
  if (!value) return "$0.00"

  if (value.lt(0)) {
    return `-$${normalizeBigNumber(value.abs(), 18, 5)}`
  }

  return `$${normalizeBigNumber(value, 18, 5)}`
}

interface Props extends HTMLAttributes<HTMLDivElement> {}

const TabPoolStatistic: FC<Props> = ({ ...rest }) => {
  const {
    openPosition,
    trades,
    orderSize,
    dailyProfitPercent,
    timePositions,
    sortino,
    maxLoss,

    pnl,
    depositors,
  } = useContext(PoolProfileContext)

  return (
    <>
      <Card>
        <S.TabCardTitle>Total P&L</S.TabCardTitle>
        <S.GridTwoColumn>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>DEXE</S.TabCardLabel>
            <div>
              <S.TabCardValue>
                {normalizeBigNumber(pnl?.total?.dexe?.amount, 18, 2)}
              </S.TabCardValue>
              &nbsp;
              <S.TabCardLabel>({pnl?.total?.dexe?.percent}%)</S.TabCardLabel>
            </div>
          </Flex>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>USD</S.TabCardLabel>
            <div>
              <S.TabCardValue>
                {getUSDRenderValue(pnl?.total?.usd?.amount)}
              </S.TabCardValue>
              &nbsp;
              <S.TabCardLabel>({pnl?.total?.usd?.percent}%)</S.TabCardLabel>
            </div>
          </Flex>
        </S.GridTwoColumn>
        <S.GridTwoColumn>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>ETH</S.TabCardLabel>
            <div>
              <S.TabCardValue>
                {getUSDRenderValue(pnl?.total?.eth?.amount)}
              </S.TabCardValue>
              &nbsp;
              <S.TabCardLabel>({pnl?.total?.eth?.percent}%)</S.TabCardLabel>
            </div>
          </Flex>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>BTC</S.TabCardLabel>
            <div>
              <S.TabCardValue>
                {getUSDRenderValue(pnl?.total?.btc?.amount)}
              </S.TabCardValue>
              &nbsp;
              <S.TabCardLabel>({pnl?.total?.btc?.percent}%)</S.TabCardLabel>
            </div>
          </Flex>
        </S.GridTwoColumn>
      </Card>
      <Card>
        <S.TabCardTitle>Average</S.TabCardTitle>
        <S.GridTwoColumn>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>Trades per Day</S.TabCardLabel>
            <S.TabCardValue>{trades?.perDay}</S.TabCardValue>
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
            <S.TabCardValue>{dailyProfitPercent}%</S.TabCardValue>
          </Flex>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>Time Positions</S.TabCardLabel>
            <S.TabCardValue>{timePositions}</S.TabCardValue>
          </Flex>
        </S.GridTwoColumn>

        <S.GridTwoColumn>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>Sortino (ETH)</S.TabCardLabel>
            <S.TabCardValue>{sortino?.eth}</S.TabCardValue>
          </Flex>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>Sortino (BTC)</S.TabCardLabel>
            <S.TabCardValue>{sortino?.btc}</S.TabCardValue>
          </Flex>
        </S.GridTwoColumn>

        <S.GridTwoColumn>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>Trades</S.TabCardLabel>
            <S.TabCardValue>{trades?.total}</S.TabCardValue>
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
            <S.TabCardValue>Depositors - {depositors}</S.TabCardValue>
            <Flex ai="center" jc="flex-end" gap="4">
              <S.TabCardLabel>
                {MAX_INVESTORS - (depositors || 0)} Left
              </S.TabCardLabel>
              <Tooltip id={uuidv4()}>Depositors</Tooltip>
            </Flex>
          </Flex>
          <S.ProgressBar
            w={depositors ? (depositors / MAX_INVESTORS) * 100 : 0}
          />
        </div>
        <div>
          <Flex full ai="center" jc="space-between" m="4px 0 12px">
            <S.TabCardValue>
              Fund positions - {openPosition?.length || 0}
            </S.TabCardValue>
            <Flex ai="center" jc="flex-end" gap="4">
              <S.TabCardLabel>
                {MAX_OPEN_TRADES - (openPosition?.length || 0)} Left
              </S.TabCardLabel>
              <Tooltip id={uuidv4()}>Fund positions</Tooltip>
            </Flex>
          </Flex>
          <S.ProgressBar
            w={((openPosition?.length || 0) / MAX_OPEN_TRADES) * 100}
          />
        </div>
      </Card>
    </>
  )
}

export default TabPoolStatistic
