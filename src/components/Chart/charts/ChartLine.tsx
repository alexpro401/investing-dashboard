import * as React from "react"
import { LineChart, ResponsiveContainer, Line } from "recharts"
import { map } from "lodash"
import { v4 as uuidv4 } from "uuid"
import { CHART_ITEM_THEME } from "constants/chart"

interface Props {
  chart: any
  chartItems: any[]
  children: React.ReactNode
}

const ChartLine: React.FC<Props> = ({ chart, chartItems, children }) => {
  const { data, ...chartProps } = chart

  return (
    <ResponsiveContainer>
      <LineChart data={data} {...chartProps}>
        {children}
        {map(chartItems, (line) => (
          <Line key={uuidv4()} {...CHART_ITEM_THEME.default} {...line} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export default ChartLine
