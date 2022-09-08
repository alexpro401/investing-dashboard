import { useState } from "react"
import { PulseSpinner } from "react-spinners-kit"
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts"

import {
  TIMEFRAMES,
  TIMEFRAME_AGREGATION_CODES,
  TIMEFRAME_LIMIT_CODE,
  TIMEFRAME_FROM_DATE,
} from "constants/history"
import { usePriceHistory } from "state/pools/hooks"
import { formatLockedFundsChartData } from "utils/formulas"

import S from "./styled"
import { Center } from "theme"
import PNLTooltip from "./PNLTooltip"
import TimeframeList from "components/TimeframeList"

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
        <S.NoData>No data found.</S.NoData>
      </Center>
    )

  return (
    <ResponsiveContainer>
      <AreaChart stackOffset="silhouette" data={data}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="65%" stopColor="#9AE2CB33" stopOpacity={0.85} />
            <stop offset="100%" stopColor="#9AE2CB05" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorSecond" x1="0" y1="0" x2="0" y2="1">
            <stop offset="65%" stopColor="#ffffff" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip
          content={(p) => {
            return <PNLTooltip {...p} />
          }}
        />
        <Area
          legendType="triangle"
          isAnimationActive
          baseLine={2}
          type="linear"
          dataKey="investorsUSD"
          stroke="#9AE2CB"
          strokeWidth={2}
          fill="url(#colorUv)"
          fillOpacity={1}
        />
        <Area
          legendType="triangle"
          isAnimationActive
          baseLine={2}
          type="linear"
          dataKey="traderUSDValue"
          stroke="#ffffff"
          strokeWidth={2}
          fill="url(#colorSecond)"
          fillOpacity={1}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

interface Props {
  address: string | undefined
}

const LockedFundsChart: React.FC<Props> = ({ address }) => {
  const [timeframe, setTimeframe] = useState(TIMEFRAMES["D"])

  const history = usePriceHistory(
    address,
    TIMEFRAME_AGREGATION_CODES[timeframe],
    TIMEFRAME_LIMIT_CODE[timeframe],
    TIMEFRAME_FROM_DATE[timeframe]
  )
  const historyFormated = formatLockedFundsChartData(history)

  return (
    <S.Container>
      <TimeframeList current={timeframe} set={setTimeframe} />
      <S.Body>
        <Chart data={historyFormated} />
      </S.Body>
    </S.Container>
  )
}

export default LockedFundsChart
