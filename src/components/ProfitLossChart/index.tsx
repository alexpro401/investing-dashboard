import { useState } from "react"
import { PulseSpinner } from "react-spinners-kit"
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts"

import { useERC20Data } from "state/erc20/hooks"
import { formateChartData } from "utils/formulas"
import { usePriceHistory } from "state/pools/hooks"
import {
  TIMEFRAMES,
  TIMEFRAME_AGREGATION_CODES,
  TIMEFRAME_LIMIT_CODE,
  TIMEFRAME_FROM_DATE,
} from "constants/history"

import S from "./styled"
import { Center } from "theme"
import PNLTooltip from "./PNLTooltip"
import TimeframeList from "components/TimeframeList"

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
        <S.NoData>No data found.</S.NoData>
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

interface Props {
  address: string | undefined
  baseToken: string | undefined
  tfPosition?: "top" | "bottom"
}

const ProfitLossChart: React.FC<Props> = ({
  address,
  baseToken,
  tfPosition,
}) => {
  const [timeframe, setTimeframe] = useState(TIMEFRAMES["D"])
  const [baseTokenData] = useERC20Data(baseToken)

  const [history] = usePriceHistory(
    address,
    TIMEFRAME_AGREGATION_CODES[timeframe],
    TIMEFRAME_LIMIT_CODE[timeframe],
    TIMEFRAME_FROM_DATE[timeframe]
  )
  const historyFormated = formateChartData(history)

  return (
    <S.Container>
      {tfPosition === "top" && (
        <TimeframeList current={timeframe} set={setTimeframe} />
      )}
      <S.Body>
        <Chart data={historyFormated} baseToken={baseTokenData} />
      </S.Body>

      {tfPosition === "bottom" && (
        <TimeframeList current={timeframe} set={setTimeframe} />
      )}
    </S.Container>
  )
}

export default ProfitLossChart
