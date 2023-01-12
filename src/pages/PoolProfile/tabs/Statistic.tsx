import { FC, useMemo } from "react"
import { getDay } from "date-fns"
import { v4 as uuidv4 } from "uuid"
import { BigNumber } from "@ethersproject/bignumber"

import { IPoolQuery } from "interfaces/thegraphs/all-pools"
import { IPoolInfo } from "interfaces/contracts/ITraderPool"

import { expandTimestamp, normalizeBigNumber } from "utils"
import { getPNL, getPriceLP } from "utils/formulas"
import * as S from "./styled"
import { Card } from "common"
import { Flex } from "theme"
import Tooltip from "components/Tooltip"
import { usePoolSortino } from "hooks/pool"

const MAX_INVESTORS = 1000
const MAX_OPEN_TRADES = 25
const sortinoTokens = [
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
]

interface Props {
  poolData: IPoolQuery
  poolInfo: IPoolInfo | null
}

const TabPoolStatistic: FC<Props> = ({ poolData, poolInfo }) => {
  const sortino = usePoolSortino(poolData.id, sortinoTokens)

  const investorsCount = Number(poolData?.investorsCount) || 0
  const openPositionsLen = Number(poolInfo?.openPositions.length) || 0

  const orderSize = useMemo(() => {
    if (!poolData) return "0"

    return normalizeBigNumber(poolData.orderSize, 4, 2)
  }, [poolData])

  const dailyProfit = useMemo(() => {
    if (!poolData) return "0"

    const days = getDay(expandTimestamp(poolData.creationTime))
    if (days === 0) return "0"

    const priceLP = getPriceLP(poolData.priceHistory)
    const pnl = getPNL(priceLP)

    return (Number(pnl) / days).toFixed(2)
  }, [poolData])

  const timePosition = useMemo(() => {
    if (!poolData) return ""
    const date = new Date(poolData.averagePositionTime * 1000)
    return `${date.getUTCHours()}H`
  }, [poolData])

  const sortinoETH = useMemo(() => {
    if (!sortino) return <>♾️</>

    return Number([sortino[sortinoTokens[0]]]).toFixed(2)
  }, [sortino])

  const sortinoBTC = useMemo(() => {
    if (!sortino) return <>♾️</>

    return Number([sortino[sortinoTokens[1]]]).toFixed(2)
  }, [sortino])

  const totalTrades = useMemo(() => {
    if (!poolData) return "0"
    return poolData.totalTrades
  }, [poolData])

  const maxLoss = useMemo(() => {
    if (!poolData) return "0"
    return normalizeBigNumber(BigNumber.from(poolData.maxLoss), 4, 2)
  }, [poolData])

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
