import * as React from "react"
import { map } from "lodash"
import { v4 as uuidv4 } from "uuid"
import { ResponsiveContainer, AreaChart, Area } from "recharts"
import { AREA_GRADIENT_STOPS, CHART_ITEM_THEME } from "constants/chart"

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
  chart: any
  chartItems: any[]
  children: React.ReactNode
}

const ChartArea: React.FC<Props> = ({ chart, chartItems, children }) => {
  const { data, ...chartProps } = chart

  return (
    <ResponsiveContainer>
      <AreaChart data={data} {...chartProps}>
        <defs>{getGradients(chartItems)}</defs>
        {children}
        {map(chartItems, (area) => (
          <Area
            key={uuidv4()}
            fill={`url(#${area.dataKey})`}
            {...CHART_ITEM_THEME.default}
            {...area}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default ChartArea
