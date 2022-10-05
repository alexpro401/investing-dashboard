import { PulseSpinner } from "react-spinners-kit"
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts"
import { useEffect, useMemo, useState } from "react"
import { format } from "date-fns"

import S from "./styled"
import PNLTooltip from "./PNLTooltip"
import { expandTimestamp } from "utils"
import { Center, Flex, Text } from "theme"
import { DATE_FORMAT } from "constants/time"

import Skeleton from "components/Skeleton"

const CustomizedDot = (props) => {
  const { cx, cy, index, activeDot } = props

  const Dot = (
    <svg x={cx - 5.5} y={cy - 5} width="11" height="10" viewBox="0 0 11 10">
      <path
        fill="#181E2C"
        stroke="#7FFFD4"
        strokeWidth="1.5"
        d="M1.12966 5C1.12966 7.35408 3.0177 9.25 5.33143 9.25C7.64517 9.25 9.5332 7.35408 9.5332 5C9.5332 2.64592 7.64517 0.75 5.33143 0.75C3.0177 0.75 1.12966 2.64592 1.12966 5Z"
      />
    </svg>
  )

  if (activeDot) {
    if (activeDot.activeLabel === index) {
      return Dot
    }
  }

  return null
}

export const Chart = ({ data, baseToken, onPointClick, activeDot }) => {
  const [chartData, setChartData] = useState(data)
  useEffect(() => {
    setChartData(data)
  }, [data])
  useEffect(() => {
    return () => {
      setChartData(undefined)
    }
  }, [])

  // show loading animation
  if (!chartData) {
    return (
      <Center>
        <PulseSpinner size={40} loading />
      </Center>
    )
  }

  // show empty chart
  if (!chartData.length) {
    return (
      <Center>
        <S.NoData>No data found.</S.NoData>
      </Center>
    )
  }

  return (
    <ResponsiveContainer>
      <AreaChart
        stackOffset="silhouette"
        data={chartData}
        onClick={onPointClick}
      >
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
          isAnimationActive={false}
          baseLine={2}
          type="linear"
          dataKey="price"
          stroke="#9AE2CB"
          strokeWidth={2}
          fill="url(#colorUv)"
          fillOpacity={1}
          dot={<CustomizedDot activeDot={activeDot} />}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

interface Props {
  data: any
  baseToken: any
  onPointClick: (p: any) => void
  activeDot: any
  loading: any
}

const InsuranceAccidentChart: React.FC<Props> = ({
  data,
  baseToken,
  onPointClick,
  activeDot,
  loading,
}) => {
  const amount = useMemo(() => {
    if (!activeDot || loading) {
      return <Skeleton w="100px" h="19px" />
    }

    return `$${activeDot.payload.price}`
  }, [activeDot, loading])

  const date = useMemo(() => {
    if (!activeDot || loading) {
      return <Skeleton w="120px" h="15px" />
    }

    return format(expandTimestamp(activeDot.payload.timestamp), DATE_FORMAT)
  }, [activeDot, loading])

  return (
    <S.Container>
      <Flex dir="column" full ai="flex-start" gap="4" m="0 0 16px">
        <Text fz={16} fw={700} lh="19px" color="#E4F2FF">
          {amount}
        </Text>
        <Text fz={13} fw={500} lh="15px" color="#B1C7FC">
          {date}
        </Text>
      </Flex>

      <S.Body>
        <Chart
          data={data}
          baseToken={baseToken}
          onPointClick={onPointClick}
          activeDot={activeDot}
        />
      </S.Body>
    </S.Container>
  )
}

export default InsuranceAccidentChart
