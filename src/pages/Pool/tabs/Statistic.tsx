import { FC, useMemo, ReactNode } from "react"
import { getDay } from "date-fns"
import { v4 as uuidv4 } from "uuid"
import { useWeb3React } from "@web3-react/core"
import { BigNumber } from "@ethersproject/bignumber"

import { IPoolQuery } from "interfaces/thegraphs/all-pools"
import { IPoolInfo } from "interfaces/contracts/ITraderPool"

import { expandTimestamp, normalizeBigNumber } from "utils"
import { getPNL, getPriceLP } from "utils/formulas"
import { GridTwoColumn, Indents, Label, ProgressBar, Value } from "../styled"
import { Card } from "common"
import { Flex } from "theme"
import Tooltip from "components/Tooltip"
import {
  usePoolSortino,
  usePoolAlternativePnlUSD,
  useInvestorAllVestsInPool,
  usePoolAlternativePnlToken,
} from "hooks"

const MAX_INVESTORS = 1000
const MAX_OPEN_TRADES = 25
const addressWETH = "0x8babbb98678facc7342735486c851abd7a0d17ca"
const addressWBTC = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"
const sortinoTokens = [addressWETH, addressWBTC]

function getUSDRenderValue(value: BigNumber): ReactNode {
  if (value.lt(0)) {
    return `-$${normalizeBigNumber(value.abs(), 18, 2)}`
  }
  return `$${normalizeBigNumber(value, 18, 2)}`
}

interface Props {
  poolData: IPoolQuery
  poolInfo: IPoolInfo | null
}

const TabPoolStatistic: FC<Props> = ({ poolData, poolInfo }) => {
  const { account } = useWeb3React()

  const { data: investorVests, loading: investorVestsLoading } =
    useInvestorAllVestsInPool(account, poolData.id)

  const sortino = usePoolSortino(poolData.id, sortinoTokens)

  const altPnlUSD = usePoolAlternativePnlUSD(investorVests, poolData.baseToken)

  const altPnlUSD_USD = useMemo(
    () => getUSDRenderValue(altPnlUSD.usd),
    [altPnlUSD]
  )
  const altPnlUSD_Percentage = useMemo(
    () => normalizeBigNumber(altPnlUSD.percentage),
    [altPnlUSD]
  )

  const altPnlInETH = usePoolAlternativePnlToken(
    investorVests,
    poolData.baseToken,
    addressWETH
  )

  const altPnlETH_USD = useMemo(
    () => getUSDRenderValue(altPnlInETH.usd),
    [altPnlInETH]
  )
  const altPnlETH_Percentage = useMemo(
    () => normalizeBigNumber(altPnlInETH.percentage),
    [altPnlInETH]
  )

  const altPnlInBTC = usePoolAlternativePnlToken(
    investorVests,
    poolData.baseToken,
    addressWBTC
  )

  const altPnlBTC_USD = useMemo(
    () => getUSDRenderValue(altPnlInBTC.usd),
    [altPnlInBTC]
  )
  const altPnlBTC_Percentage = useMemo(
    () => normalizeBigNumber(altPnlInBTC.percentage),
    [altPnlInBTC]
  )

  const investorsCount = Number(poolData?.investorsCount) || 0
  const openPositionsLen = Number(poolInfo?.openPositions.length) || 0

  const orderSize = useMemo(() => {
    if (!poolData) return "0"

    return normalizeBigNumber(poolData.orderSize, 4, 2)
  }, [poolData])

  const pnlPerc = useMemo(() => {
    if (!poolData) return "0.0"

    const priceLP = getPriceLP(poolData.priceHistory)
    return getPNL(priceLP)
  }, [poolData])

  const pnlUSD = useMemo(() => {
    if (!poolData || !poolData.priceHistory[0]) return "$0.0"

    const BN = BigNumber.from(poolData.priceHistory[0]?.percPNLUSD)
    return getUSDRenderValue(BN)
  }, [poolData])

  const dailyProfit = useMemo(() => {
    if (!poolData) return "0.0"

    const days = getDay(expandTimestamp(poolData.creationTime))
    if (days === 0) return "0.0"

    return (Number(pnlPerc) / days).toFixed(2)
  }, [poolData, pnlPerc])

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
      <Indents side={false}>
        <Card>
          <Value.Medium color="#9AE2CB">Total P&L</Value.Medium>
          <GridTwoColumn>
            <Flex full ai="center" jc="space-between">
              <Label>DEXE</Label>
              <div>
                <Value.Medium color="#E4F2FF">{pnlUSD}</Value.Medium>&nbsp;
                <Value.Medium color="#B1C7FC">({pnlPerc}%)</Value.Medium>
              </div>
            </Flex>
            <Flex full ai="center" jc="space-between">
              <Label>USD</Label>
              <div>
                <Value.Medium color="#E4F2FF">{altPnlUSD_USD}</Value.Medium>
                &nbsp;
                <Value.Medium color="#B1C7FC">
                  ({altPnlUSD_Percentage}%)
                </Value.Medium>
              </div>
            </Flex>
          </GridTwoColumn>
          <GridTwoColumn>
            <Flex full ai="center" jc="space-between">
              <Label>ETH</Label>
              <div>
                <Value.Medium color="#E4F2FF">{altPnlETH_USD}</Value.Medium>
                &nbsp;
                <Value.Medium color="#B1C7FC">
                  ({altPnlETH_Percentage}%)
                </Value.Medium>
              </div>
            </Flex>
            <Flex full ai="center" jc="space-between">
              <Label>BTC</Label>
              <div>
                <Value.Medium color="#E4F2FF">{altPnlBTC_USD}</Value.Medium>
                &nbsp;
                <Value.Medium color="#B1C7FC">
                  ({altPnlBTC_Percentage}%)
                </Value.Medium>
              </div>
            </Flex>
          </GridTwoColumn>
        </Card>
      </Indents>

      <Indents top side={false}>
        <Card>
          <Value.Medium color="#9AE2CB">Average</Value.Medium>
          <GridTwoColumn>
            <Flex full ai="center" jc="space-between">
              <Label>Trades per Day</Label>
              <Value.Medium color="#E4F2FF">
                {poolData.averageTrades}
              </Value.Medium>
            </Flex>
            <Flex full ai="center" jc="space-between">
              <Label>Order Size</Label>
              <Value.Medium color="#E4F2FF">{orderSize}%</Value.Medium>
            </Flex>
          </GridTwoColumn>

          <GridTwoColumn>
            <Flex full ai="center" jc="space-between">
              <Label>Daily Profit</Label>
              <Value.Medium color="#E4F2FF">{dailyProfit}%</Value.Medium>
            </Flex>
            <Flex full ai="center" jc="space-between">
              <Label>Time Positions</Label>
              <Value.Medium color="#E4F2FF">{timePosition}</Value.Medium>
            </Flex>
          </GridTwoColumn>

          <GridTwoColumn>
            <Flex full ai="center" jc="space-between">
              <Label>Sortino (ETH)</Label>
              <Value.Medium color="#E4F2FF">{sortinoETH}</Value.Medium>
            </Flex>
            <Flex full ai="center" jc="space-between">
              <Label>Sortino (BTC)</Label>
              <Value.Medium color="#E4F2FF">{sortinoBTC}</Value.Medium>
            </Flex>
          </GridTwoColumn>

          <GridTwoColumn>
            <Flex full ai="center" jc="space-between">
              <Label>Trades</Label>
              <Value.Medium color="#E4F2FF">{totalTrades}</Value.Medium>
            </Flex>
            <Flex full ai="center" jc="space-between">
              <Label>Max. loss</Label>
              <Value.Medium color="#E4F2FF">{maxLoss}%</Value.Medium>
            </Flex>
          </GridTwoColumn>
        </Card>
      </Indents>

      <Indents top side={false}>
        <Card>
          <div>
            <Flex full ai="center" jc="space-between" m="0 0 12px">
              <Label>Depositors - {investorsCount}</Label>
              <Flex ai="center" jc="flex-end" gap="4">
                <Value.MediumThin color="#E4F2FF">
                  {MAX_INVESTORS - investorsCount} Left
                </Value.MediumThin>
                <Tooltip id={uuidv4()}>Depositors</Tooltip>
              </Flex>
            </Flex>
            <ProgressBar w={(investorsCount / MAX_INVESTORS) * 100} />
          </div>
          <div>
            <Flex full ai="center" jc="space-between" m="4px 0 12px">
              <Label>Fund positions - {openPositionsLen}</Label>
              <Flex ai="center" jc="flex-end" gap="4">
                <Value.MediumThin color="#E4F2FF">
                  {MAX_OPEN_TRADES - openPositionsLen} Left
                </Value.MediumThin>
                <Tooltip id={uuidv4()}>Fund positions</Tooltip>
              </Flex>
            </Flex>
            <ProgressBar w={(openPositionsLen / MAX_OPEN_TRADES) * 100} />
          </div>
        </Card>
      </Indents>
    </>
  )
}

export default TabPoolStatistic
