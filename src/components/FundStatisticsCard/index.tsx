import { getDay } from "date-fns"
import { FC, useMemo } from "react"
import { BigNumber } from "@ethersproject/bignumber"

import { useERC20 } from "hooks/useContract"
import { getPNL, getPriceLP } from "utils/formulas"
import { expandTimestamp, normalizeBigNumber } from "utils"
import { IPoolQuery } from "interfaces/thegraphs/all-pools"
import { IPoolInfo } from "interfaces/contracts/ITraderPool"

import { Flex } from "theme"
import ProgressBar from "components/ProgressBar"
import { Label, InfoRow, Container, Icon } from "./styled"

import chartIcon from "assets/icons/bar-chart-icon.svg"

interface IProps {
  data: IPoolQuery
  info: IPoolInfo | null
}

const FundStatisticsCard: FC<IProps> = ({ data, info }) => {
  const [, baseData] = useERC20(data.baseToken)

  // UI variables
  const openPositionsPercent = info?.openPositions.length || 0
  const openPositions = info?.openPositions.length || 0

  const orderSize = useMemo(() => {
    if (!data) return "0"

    return normalizeBigNumber(data.orderSize, 4, 2)
  }, [data])

  const dailyProfit = useMemo(() => {
    if (!data) return "0"

    const priceLP = getPriceLP(data.priceHistory)
    const pnl = getPNL(priceLP)
    const days = getDay(expandTimestamp(data.creationTime))

    return (Number(pnl) / days).toFixed(2)
  }, [data])

  const timePosition = useMemo(() => {
    if (!data) return ""
    const date = new Date(data.averagePositionTime * 1000)
    return `${date.getUTCHours()}H`
  }, [data])

  const totalTrades = useMemo(() => {
    if (!data) return "0"
    return data.totalTrades
  }, [data])

  const maxLoss = useMemo(() => {
    if (!data) return "0"
    return normalizeBigNumber(BigNumber.from(data.maxLoss), 4, 2)
  }, [data])

  return (
    <Container>
      <Flex p="40px 25px 0" full>
        <ProgressBar
          percent={Number(data.investorsCount) / 10}
          label={`${data.investorsCount}/1000`}
          value="Investors"
        />
        <ProgressBar
          percent={openPositionsPercent}
          label={`${openPositions}/25`}
          value="Open trades"
        />
      </Flex>
      <Flex p="40px 0 0 0" full jc="flex-start">
        <Icon src={chartIcon} />
        <Label>Total P&L</Label>
      </Flex>

      <Flex full>
        <Flex full p="0 75px 0 0">
          <InfoRow label={baseData?.symbol} value={`${0}%`} />
        </Flex>
        <Flex full p="0 0 0 75px">
          <InfoRow label={"USD"} value={`${0}%`} />
        </Flex>
      </Flex>
      <Flex full>
        <Flex full p="0 75px 0 0">
          <InfoRow label={"ETH"} value={`${0}%`} />
        </Flex>
        <Flex full p="0 0 0 75px">
          <InfoRow label={"BTC"} value={`${0}%`} />
        </Flex>
      </Flex>

      <Flex p="40px 0 0 0" full jc="flex-start">
        <Icon src={chartIcon} />
        <Label>Average</Label>
      </Flex>

      <Flex full>
        <Flex full p="0 25px 0 0">
          <InfoRow label={"Trades per Day"} value={data.averageTrades} />
        </Flex>
        <Flex full p="0 0 0 25px">
          <InfoRow label={"Order Size"} value={`${orderSize}%`} />
        </Flex>
      </Flex>
      <Flex full>
        <Flex full p="0 25px 0 0">
          <InfoRow label={"Daily Profit"} value={`${dailyProfit}%`} />
        </Flex>
        <Flex full p="0 0 0 25px">
          <InfoRow label={"Time Positions"} value={timePosition} />
        </Flex>
      </Flex>
      <Flex full>
        <Flex full p="0 25px 0 0">
          <InfoRow label={"Sortino (ETH)"} value={"0"} />
        </Flex>
        <Flex full p="0 0 0 25px">
          <InfoRow label={"Sortino (BTC)"} value={"0"} />
        </Flex>
      </Flex>
      <Flex full>
        <Flex full p="0 25px 0 0">
          <InfoRow label={"Trades"} value={totalTrades} />
        </Flex>
        <Flex full p="0 0 0 25px">
          <InfoRow label={"Max.Loss"} value={`${maxLoss}%`} />
        </Flex>
      </Flex>
    </Container>
  )
}

export default FundStatisticsCard
