import * as React from "react"
import { ResponsiveContainer, PieChart, Pie } from "recharts"

interface Props {
  data: any[]
  chart: any
  chartItems: any[]
  children: React.ReactNode
}

const ChartStraightAnglePie: React.FC<Props> = ({ data, chart, children }) => {
  return (
    <ResponsiveContainer>
      <PieChart height={80}>
        <Pie data={data} {...chart} startAngle={180} endAngle={0} cy="100%">
          {children}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

export default ChartStraightAnglePie
