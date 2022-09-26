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
    <svg
      x={cx - 4}
      y={cy - 4}
      width={8}
      height={8}
      fill="#9AE2CB"
      stroke="#181E2C"
      strokeWidth={1.5}
      viewBox="0 0 1024 1024"
    >
      <path d="M512 1009.984c-274.912 0-497.76-222.848-497.76-497.76s222.848-497.76 497.76-497.76c274.912 0 497.76 222.848 497.76 497.76s-222.848 497.76-497.76 497.76zM340.768 295.936c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM686.176 296.704c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM772.928 555.392c-18.752-8.864-40.928-0.576-49.632 18.528-40.224 88.576-120.256 143.552-208.832 143.552-85.952 0-164.864-52.64-205.952-137.376-9.184-18.912-31.648-26.592-50.08-17.28-18.464 9.408-21.216 21.472-15.936 32.64 52.8 111.424 155.232 186.784 269.76 186.784 117.984 0 217.12-70.944 269.76-186.784 8.672-19.136 9.568-31.2-9.12-40.096z" />
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
