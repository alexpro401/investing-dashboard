import * as React from "react"
import { isNil, map } from "lodash"
import { v4 as uuidv4 } from "uuid"

import { PageChart } from "../types"
import { Card } from "common"
import { Flex } from "theme"
import { ChartFilter, ChartFilterItem, TextLabel, TextValue } from "../styled"
import Chart from "components/Chart"
import { CHART_TYPE, TIMEFRAME } from "consts/chart"

const FakeChartData = [
  {
    tvl: 330,
    members: 10,
    mcTvl: 400,
    timestamp: 1670493921,
  },
  {
    tvl: 420,
    members: 45,
    mcTvl: 12,
    timestamp: 1670493933,
  },
  {
    tvl: 97,
    members: 94,
    mcTvl: 172,
    timestamp: 1670493938,
  },
  {
    tvl: 670,
    members: 40,
    mcTvl: 666,
    timestamp: 1670493941,
  },
  {
    tvl: 453,
    members: 93,
    mcTvl: 74,
    timestamp: 1670493944,
  },
]

const ActiveLines = {
  [PageChart.tvl]: [
    {
      legendType: "triangle",
      dataKey: "tvl",
      stroke: "#9AE2CB",
    },
  ],
  [PageChart.members]: [
    {
      legendType: "square",
      dataKey: "members",
      stroke: "#2680eb",
    },
  ],

  [PageChart.mcTvl]: [
    {
      legendType: "triangle",
      dataKey: "mcTvl",
      stroke: "#0AEACB",
    },
  ],
}

interface Props {
  chart: PageChart
  setChart: React.Dispatch<React.SetStateAction<PageChart>>
}
const DaoProfileChart: React.FC<Props> = ({ chart, setChart }) => {
  const timeframe = React.useState(TIMEFRAME.m)
  const activePoint = React.useState<any>()

  React.useEffect(() => {
    activePoint[1](undefined)
  }, [chart])

  const ChartActiveDotValues = React.useMemo(
    () => (
      <Flex dir="column" ai="flex-start" jc="center" gap="4">
        <TextValue fw={700}>
          {isNil(activePoint[0])
            ? "0.0"
            : activePoint[0].activePayload[0].payload[
                activePoint[0].activePayload[0].name
              ]}
        </TextValue>
        <TextLabel fw={500}>Total</TextLabel>
      </Flex>
    ),
    [activePoint]
  )

  const ChartToggle = React.useMemo(
    () => (
      <ChartFilter>
        {map(Object.values(PageChart), (name) => (
          <ChartFilterItem
            key={uuidv4()}
            onClick={() => setChart(name)}
            animate={chart === name ? "visible" : "hidden"}
          >
            {name}
          </ChartFilterItem>
        ))}
      </ChartFilter>
    ),
    [chart]
  )
  const onChoosePoint = React.useCallback(
    (p) => {
      if (
        isNil(activePoint[0]) ||
        activePoint[0].activeLabel !== p.activeLabel
      ) {
        activePoint[1](p)
      }
    },
    [activePoint]
  )

  return (
    <Card>
      <Chart
        type={CHART_TYPE.area}
        height="130px"
        timeframe={{ get: timeframe[0], set: timeframe[1] }}
        timeframePosition="bottom"
        data={FakeChartData}
        chart={{
          onClick: onChoosePoint,
          stackOffset: "silhouette",
        }}
        chartItems={ActiveLines[chart]}
        nodeHeadLeft={ChartActiveDotValues}
        nodeHeadRight={ChartToggle}
        loading={false}
      />
    </Card>
  )
}

export default DaoProfileChart
