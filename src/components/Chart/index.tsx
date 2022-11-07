import * as React from "react"
import { isEmpty, isNil } from "lodash"

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

const charts = {
  [CHART_TYPE.area]: ChartArea,
  [CHART_TYPE.line]: ChartLine,
}

interface Props {
  type: CHART_TYPE
  nodeHeadLeft?: React.ReactNode
  nodeHeadRight?: React.ReactNode
  height: string
  chart: any
  chartItems: any[]
  timeframe?: {
    get: TIMEFRAME
    set: React.Dispatch<React.SetStateAction<TIMEFRAME>>
  }
  timeframePosition?: "top" | "bottom"
  children?: React.ReactNode
}

const Chart: React.FC<Props> = ({
  type = CHART_TYPE.area,
  nodeHeadLeft,
  nodeHeadRight,

  height,
  chart,
  chartItems,
  timeframe,
  timeframePosition,
  children,
}) => {
  const CurrentChart = charts[type]

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

  const _chart = React.useMemo(() => {
    if (isNil(chart.data)) {
      return {
        ...chart,
        data: CHART_FALLBACK_DATA,
      }
    }
    return chart
  }, [chart])

  const _chartItems = React.useMemo(() => {
    if (isNil(chart.data) || isNil(chartItems) || isEmpty(chartItems)) {
      return [CHART_FALLBACK_ITEM]
    }
    return chartItems
  }, [chart, chartItems])

  return (
    <div>
      {NodeHead}
      <S.Container h={height} dir={_nodesDirection}>
        <React.Suspense fallback={<ChartFallback />}>
          <CurrentChart chart={_chart} chartItems={_chartItems}>
            {children}
          </CurrentChart>
        </React.Suspense>
        {!isNil(timeframe) && (
          <Timeframe current={timeframe.get} set={timeframe.set} />
        )}
      </S.Container>
    </div>
  )
}

export default Chart
