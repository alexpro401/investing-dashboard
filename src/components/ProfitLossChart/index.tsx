import { useState } from "react"
import { PulseSpinner } from "react-spinners-kit"
import { AreaChart, Area, Tooltip, ResponsiveContainer, XAxis } from "recharts"

import { formateChartData } from "utils/formulas"
import { usePriceHistory } from "state/pools/hooks"
import { AGREGATION_CODES, TIMEFRAMES } from "constants/history"

import { Center } from "theme"
import { Container, Body, ChartPeriods, Period, NoData } from "./styled"

interface Props {
  address: string | undefined
}

const Chart = ({ data }) => {
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
        <Tooltip />
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

const ProfitLossChart: React.FC<Props> = ({ address }) => {
  const [timeframe, setTimeframe] = useState(TIMEFRAMES["D"])

  const history = usePriceHistory(
    address,
    TIMEFRAME_MIN_CODE[timeframe],
    TIMEFRAME_LIMIT_CODE[timeframe]
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
        <Chart data={historyFormated} />
      </Body>
    </Container>
  )
}

export default ProfitLossChart
