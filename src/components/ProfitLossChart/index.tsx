import { useState } from "react"
import { PulseSpinner } from "react-spinners-kit"
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts"
import { useERC20 } from "hooks/useContract"

import { daysAgoTimestamp } from "utils"
import { formateChartData } from "utils/formulas"
import { usePriceHistory } from "state/pools/hooks"
import { AGREGATION_CODES, TIMEFRAMES } from "constants/history"

import { Center } from "theme"
import PNLTooltip from "./PNLTooltip"
import { Container, Body, ChartPeriods, Period, NoData } from "./styled"

const Chart = ({ data, baseToken }) => {
  // show loading animation
  if (!data)
    return (
      <Center>
        <PulseSpinner size={40} loading />
      </Center>
    )

  // show empty chart
  if (!data.length)
    return (
      <Center>
        <NoData>No data found.</NoData>
      </Center>
    )

  return (
    <ResponsiveContainer>
      <AreaChart stackOffset="silhouette" data={data}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="65%" stopColor="#9AE2CB33" stopOpacity={0.3} />
            <stop offset="70%" stopColor="#9AE2CB33" stopOpacity={0.25} />
            <stop offset="80%" stopColor="#9AE2CB33" stopOpacity={0.2} />
            <stop offset="85%" stopColor="#9AE2CB26" stopOpacity={0.15} />
            <stop offset="90%" stopColor="#9AE2CB20" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#9AE2CB15" stopOpacity={0.04} />
            <stop offset="100%" stopColor="#9AE2CB05" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip
          content={(p) => {
            return <PNLTooltip {...p} baseToken={baseToken} />
          }}
        />
        <Area
          legendType="triangle"
          isAnimationActive
          baseLine={2}
          type="linear"
          dataKey="price"
          stroke="#9AE2CB"
          strokeWidth={2}
          fill="url(#colorUv)"
          fillOpacity={1}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// Mapping timeframes to agregation codes
const TIMEFRAME_MIN_CODE = {
  ["D"]: AGREGATION_CODES["15min"],
  ["W"]: AGREGATION_CODES["30min"] + AGREGATION_CODES["1h"],
  ["M"]: AGREGATION_CODES["6h"],
  ["3M"]: AGREGATION_CODES["24h"],
  ["6M"]: AGREGATION_CODES["12h"] + AGREGATION_CODES["24h"],
  ["1Y"]: AGREGATION_CODES["24h"] * 3,
  ["ALL"]: AGREGATION_CODES["1m"],
}

/**
 * Mapping timeframes to collection length limits
 */
const TIMEFRAME_LIMIT_CODE = {
  ["D"]: 96, // 24h * (1h / TIMEFRAME_MIN_CODE["D"])
  ["W"]: 112, // (24h * 7d) / TIMEFRAME_MIN_CODE["W"]
  ["M"]: 124, // (24h * 31d) / TIMEFRAME_MIN_CODE["M"]
  ["3M"]: 93,
  ["6M"]: 124,
  ["1Y"]: 124,
  ["ALL"]: 1000,
}
/**
 * Mapping timeframes to fromDate value
 */
const TIMEFRAME_FROM_DATE = {
  ["D"]: daysAgoTimestamp(1),
  ["W"]: daysAgoTimestamp(7),
  ["M"]: daysAgoTimestamp(31),
  ["3M"]: daysAgoTimestamp(93),
  ["6M"]: daysAgoTimestamp(186),
  ["1Y"]: daysAgoTimestamp(365),
  ["ALL"]: null,
}

interface Props {
  address: string | undefined
  baseToken: string | undefined
}

const ProfitLossChart: React.FC<Props> = ({ address, baseToken }) => {
  const [timeframe, setTimeframe] = useState(TIMEFRAMES["D"])
  const [, baseTokenData] = useERC20(baseToken)

  const history = usePriceHistory(
    address,
    TIMEFRAME_MIN_CODE[timeframe],
    TIMEFRAME_LIMIT_CODE[timeframe],
    TIMEFRAME_FROM_DATE[timeframe]
  )
  const historyFormated = formateChartData(history)

  return (
    <Container>
      <ChartPeriods>
        {Object.values(TIMEFRAMES).map((value) => (
          <Period
            key={value}
            onClick={() => setTimeframe(value)}
            active={timeframe === value}
          >
            {value}
          </Period>
        ))}
      </ChartPeriods>

      <Body>
        <Chart data={historyFormated} baseToken={baseTokenData} />
      </Body>
    </Container>
  )
}

export default ProfitLossChart
