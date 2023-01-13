import { FC, HTMLAttributes, useContext } from "react"
import { v4 as uuidv4 } from "uuid"
import * as S from "./styled"
import { Card } from "common"
import { Flex } from "theme"
import Tooltip from "components/Tooltip"
import { PoolProfileContext } from "pages/PoolProfile/context"

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
        <S.Value.Medium color="#9AE2CB">Total P&L</S.Value.Medium>
        <S.GridTwoColumn>
          <Flex full ai="center" jc="space-between">
            <S.Label>DEXE</S.Label>
            <div>
              <S.Value.Medium color="#E4F2FF">$230,000</S.Value.Medium>&nbsp;
              <S.Value.Medium color="#B1C7FC">(50%)</S.Value.Medium>
            </div>
          </Flex>
          <Flex full ai="center" jc="space-between">
            <S.Label>USD</S.Label>
            <div>
              <S.Value.Medium color="#E4F2FF">$500,000</S.Value.Medium>&nbsp;
              <S.Value.Medium color="#B1C7FC">(500%)</S.Value.Medium>
            </div>
          </Flex>
        </S.GridTwoColumn>
        <S.GridTwoColumn>
          <Flex full ai="center" jc="space-between">
            <S.Label>ETH</S.Label>
            <div>
              <S.Value.Medium color="#E4F2FF">$30,214</S.Value.Medium>&nbsp;
              <S.Value.Medium color="#B1C7FC">(50%)</S.Value.Medium>
            </div>
          </Flex>
          <Flex full ai="center" jc="space-between">
            <S.Label>BTC</S.Label>
            <div>
              <S.Value.Medium color="#E4F2FF">3,134</S.Value.Medium>&nbsp;
              <S.Value.Medium color="#B1C7FC">(238%)</S.Value.Medium>
            </div>
          </Flex>
        </S.GridTwoColumn>
      </Card>

      <Card>
        <S.Value.Medium color="#9AE2CB">Average</S.Value.Medium>
        <S.GridTwoColumn>
          <Flex full ai="center" jc="space-between">
            <S.Label>Trades per Day</S.Label>
            <S.Value.Medium color="#E4F2FF">
              {poolData.averageTrades}
            </S.Value.Medium>
          </Flex>
          <Flex full ai="center" jc="space-between">
            <S.Label>Order Size</S.Label>
            <S.Value.Medium color="#E4F2FF">{orderSize}%</S.Value.Medium>
          </Flex>
        </S.GridTwoColumn>

        <S.GridTwoColumn>
          <Flex full ai="center" jc="space-between">
            <S.Label>Daily Profit</S.Label>
            <S.Value.Medium color="#E4F2FF">{dailyProfit}%</S.Value.Medium>
          </Flex>
          <Flex full ai="center" jc="space-between">
            <S.Label>Time Positions</S.Label>
            <S.Value.Medium color="#E4F2FF">{timePosition}</S.Value.Medium>
          </Flex>
        </S.GridTwoColumn>

        <S.GridTwoColumn>
          <Flex full ai="center" jc="space-between">
            <S.Label>Sortino (ETH)</S.Label>
            <S.Value.Medium color="#E4F2FF">{sortinoETH}</S.Value.Medium>
          </Flex>
          <Flex full ai="center" jc="space-between">
            <S.Label>Sortino (BTC)</S.Label>
            <S.Value.Medium color="#E4F2FF">{sortinoBTC}</S.Value.Medium>
          </Flex>
        </S.GridTwoColumn>

        <S.GridTwoColumn>
          <Flex full ai="center" jc="space-between">
            <S.Label>Trades</S.Label>
            <S.Value.Medium color="#E4F2FF">{totalTrades}</S.Value.Medium>
          </Flex>
          <Flex full ai="center" jc="space-between">
            <S.Label>Max. loss</S.Label>
            <S.Value.Medium color="#E4F2FF">{maxLoss}%</S.Value.Medium>
          </Flex>
        </S.GridTwoColumn>
      </Card>

      <Card>
        <div>
          <Flex full ai="center" jc="space-between" m="0 0 12px">
            <S.Label>Depositors - {investorsCount}</S.Label>
            <Flex ai="center" jc="flex-end" gap="4">
              <S.Value.MediumThin color="#E4F2FF">
                {MAX_INVESTORS - investorsCount} Left
              </S.Value.MediumThin>
              <Tooltip id={uuidv4()}>Depositors</Tooltip>
            </Flex>
          </Flex>
          <S.ProgressBar w={(investorsCount / MAX_INVESTORS) * 100} />
        </div>
        <div>
          <Flex full ai="center" jc="space-between" m="4px 0 12px">
            <S.Label>Fund positions - {openPositionsLen}</S.Label>
            <Flex ai="center" jc="flex-end" gap="4">
              <S.Value.MediumThin color="#E4F2FF">
                {MAX_OPEN_TRADES - openPositionsLen} Left
              </S.Value.MediumThin>
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
