import * as React from "react"
import { isNil, map } from "lodash"
import { v4 as uuidv4 } from "uuid"

import { PageChart } from "../types"
import { Card } from "common"
import { Flex } from "theme"
import { ChartFilter, ChartFilterItem, TextLabel, TextValue } from "../styled"
import Chart from "components/Chart"
import { CHART_TYPE, TIMEFRAME } from "constants/chart"

const ActiveLines = {
  [PageChart.tvl]: [
    {
      legendType: "triangle",
      dataKey: "b",
      stroke: "#9AE2CB",
    },
  ],
  [PageChart.members]: [
    {
      legendType: "square",
      dataKey: "p",
      stroke: "#2680eb",
    },
  ],

  [PageChart.mcTvl]: [
    {
      legendType: "triangle",
      dataKey: "a",
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
        data={[]}
        chart={{
          onClick: onChoosePoint,
          stackOffset: "silhouette",
        }}
        chartItems={ActiveLines[chart]}
        nodeHeadLeft={ChartActiveDotValues}
        nodeHeadRight={ChartToggle}
      />
    </Card>
  )
}

export default DaoProfileChart
