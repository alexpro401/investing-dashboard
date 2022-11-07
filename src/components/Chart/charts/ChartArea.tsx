import * as React from "react"
import { isNil, map } from "lodash"
import { v4 as uuidv4 } from "uuid"
import { ResponsiveContainer, AreaChart, Area } from "recharts"
import { AREA_GRADIENT_STOPS, CHART_ITEM_THEME } from "constants/chart"
import { ChartActiveDot } from "../components"

function getGradients(chartItems) {
  return map(chartItems, (area, i) => (
    <linearGradient
      key={uuidv4()}
      id={area.dataKey}
      x1="0"
      y1="0"
      x2="0"
      y2={i + 1}
    >
      {map(AREA_GRADIENT_STOPS, (stop) => (
        <stop
          key={uuidv4()}
          offset={`${stop.o}%`}
          stopColor={area.stroke}
          stopOpacity={stop.s}
        />
      ))}
    </linearGradient>
  ))
}

interface Props {
  data: any[]
  chart: any
  chartItems: any[]
  activePoint: any
  animationMode: boolean
  children: React.ReactNode
}

const ChartArea: React.FC<Props> = ({
  data,
  chart,
  chartItems,
  activePoint,
  children,
}) => {
  const getActiveDot = React.useCallback(
    (area) => {
      if (isNil(activePoint)) {
        return {}
      }

      return {
        dot: (point) => (
          <ChartActiveDot
            {...point}
            activePoint={activePoint}
            stroke={area.stroke}
          />
        ),
      }
    },
    [activePoint]
  )

  return (
    <ResponsiveContainer>
      <AreaChart data={data} {...chart}>
        <defs>{getGradients(chartItems)}</defs>
        {children}
        {map(chartItems, (area) => (
          <Area
            key={uuidv4()}
            fill={`url(#${area.dataKey})`}
            {...CHART_ITEM_THEME.default}
            {...area}
            {...getActiveDot(area)}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default ChartArea
