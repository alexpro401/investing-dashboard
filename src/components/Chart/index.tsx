import * as React from "react"
import { isEmpty, isFunction, isNil } from "lodash"

import * as S from "./styled"
import { ChartFallback, Timeframe } from "./components"

import { Flex } from "theme"
import {
  CHART_FALLBACK_DATA,
  CHART_FALLBACK_ITEM,
  CHART_TYPE,
  TIMEFRAME,
} from "constants/chart"

const ChartArea = React.lazy(() => import(`./charts/ChartArea`))
const ChartLine = React.lazy(() => import(`./charts/ChartLine`))
const ChartStraightAnglePie = React.lazy(
  () => import(`./charts/ChartStraightAnglePie`)
)

const charts = {
  [CHART_TYPE.area]: ChartArea,
  [CHART_TYPE.line]: ChartLine,
  [CHART_TYPE.straightAnglePie]: ChartStraightAnglePie,
}

interface Props {
  type: CHART_TYPE
  nodeHeadLeft?: React.ReactNode
  nodeHeadRight?: React.ReactNode
  height: string
  data?: any[]
  chart: any
  chartItems: any[]
  timeframe?: {
    get: TIMEFRAME
    set: React.Dispatch<React.SetStateAction<TIMEFRAME>>
  }
  timeframePosition?: "top" | "bottom"
  activePoint?: {
    get: any
    set: React.Dispatch<React.SetStateAction<any>>
  }
  loading?: boolean
  children?: React.ReactNode
}

const Chart: React.FC<Props> = ({
  type = CHART_TYPE.area,
  nodeHeadLeft,
  nodeHeadRight,

  height,
  data,
  chart,
  chartItems,
  timeframe,
  timeframePosition,
  activePoint,
  loading,
  children,
}) => {
  const CurrentChart = charts[type]

  const _loading = React.useMemo(() => !isNil(loading) && loading, [loading])
  const _enableActivePoint = React.useMemo(
    () => !isNil(activePoint),
    [activePoint]
  )

  const _animationMode = React.useState(true)

  const NodeHead = React.useMemo(() => {
    const leftExist = !isNil(nodeHeadLeft)
    const rightExist = !isNil(nodeHeadRight)

    function getHeadJustify(leftExist, rightExist) {
      if (leftExist && rightExist) return "space-between"
      if (leftExist && !rightExist) return "flex-start"
      if (!leftExist && rightExist) return "flex-end"
      return "initial"
    }

    if (leftExist || rightExist) {
      return (
        <Flex
          full
          ai="flex-start"
          jc={getHeadJustify(leftExist, rightExist)}
          m="0 0 16px"
        >
          {leftExist ? nodeHeadLeft : null}
          {rightExist ? nodeHeadRight : null}
        </Flex>
      )
    }

    return null
  }, [nodeHeadLeft, nodeHeadRight])

  const _nodesDirection = React.useMemo(() => {
    if (isNil(timeframePosition) || isNil(timeframe)) return "initial"
    const DirectionByTimeframePosition = {
      top: "column-reverse",
      bottom: "column",
    }
    return DirectionByTimeframePosition[timeframePosition]
  }, [timeframe, timeframePosition])

  const _data = React.useMemo(() => {
    if (isNil(data) || isEmpty(data)) {
      return CHART_FALLBACK_DATA
    }
    return data
  }, [data])

  const _chartItems = React.useMemo(() => {
    if (
      isNil(data) ||
      isEmpty(data) ||
      isNil(chartItems) ||
      isEmpty(chartItems)
    ) {
      return [CHART_FALLBACK_ITEM]
    }
    return chartItems
  }, [data, chartItems])

  const _chart = React.useMemo(
    () => ({
      ...chart,
      onClick: (point) => {
        if (!isNil(chart.onClick) && isFunction(chart.onClick)) {
          chart.onClick(point)
        }
      },
    }),
    [chart, _enableActivePoint]
  )

  return (
    <div>
      {NodeHead}
      <S.Container h={height} dir={_nodesDirection}>
        {_loading ? (
          <ChartFallback />
        ) : (
          <React.Suspense fallback={<ChartFallback />}>
            <CurrentChart
              data={_data}
              chart={_chart}
              chartItems={_chartItems}
              activePoint={!isNil(activePoint) && activePoint.get}
              animationMode={_animationMode[0]}
              enableActivePoint={_enableActivePoint}
            >
              {children}
            </CurrentChart>
          </React.Suspense>
        )}
        {!isNil(timeframe) && (
          <Timeframe current={timeframe.get} set={timeframe.set} />
        )}
      </S.Container>
    </div>
  )
}

export default React.memo(Chart)
