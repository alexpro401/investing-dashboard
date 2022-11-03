import { Dispatch, FC, SetStateAction } from "react"
import { map } from "lodash"

import { PageChart } from "../types"
import { Card } from "common"
import { Flex } from "theme"
import { ChartFilter, ChartFilterItem } from "../styled"
import DaoPoolChart from "components/DaoPoolChart"

interface Props {
  chart: PageChart
  setChart: Dispatch<SetStateAction<PageChart>>
}
const DaoProfileChart: FC<Props> = ({ chart, setChart }) => {
  return (
    <Card>
      <Flex full jc="flex-end">
        <ChartFilter>
          {map(Object.values(PageChart), (name) => (
            <ChartFilterItem
              onClick={() => setChart(name)}
              animate={chart === name ? "visible" : "hidden"}
            >
              {name}
            </ChartFilterItem>
          ))}
        </ChartFilter>
      </Flex>
      <div>
        <DaoPoolChart
          address="0x0e42a7b15cec1b4364e33f750499a85628e070ba"
          baseToken="0x8a9424745056Eb399FD19a0EC26A14316684e274"
          tfPosition="bottom"
        />
      </div>
    </Card>
  )
}

export default DaoProfileChart
