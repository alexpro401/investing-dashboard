import * as React from "react"
import { LineChart, ResponsiveContainer, Line } from "recharts"
import { isNil, map } from "lodash"
import { v4 as uuidv4 } from "uuid"
import { CHART_ITEM_THEME } from "constants/chart"
import { ChartActiveDot } from "../components"

interface Props {
  data: any[]
  chart: any
  chartItems: any[]
  activePoint?: any
  enableActivePoint: boolean
  children: React.ReactNode
}

const ChartLine: React.FC<Props> = ({
  data,
  chart,
  chartItems,
  activePoint,
  enableActivePoint,
  children,
}) => {
  const getActiveDot = React.useCallback(
    (line) => {
      if (isNil(activePoint) || !enableActivePoint) {
        return {}
      }

      return {
        dot: (point) => (
          <ChartActiveDot
            {...point}
            activePoint={activePoint}
            stroke={line.stroke}
          />
        ),
      }
    },
    [activePoint, enableActivePoint]
  )

  return (
    <ResponsiveContainer>
      <LineChart data={data} {...chart}>
        {children}
        {map(chartItems, (line) => (
          <Line
            key={uuidv4()}
            {...CHART_ITEM_THEME.default}
            {...line}
            {...getActiveDot(line)}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export default ChartLine
