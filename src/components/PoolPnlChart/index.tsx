import * as React from "react"
import { Tooltip } from "recharts"

import Chart from "components/Chart"
import { useERC20Data } from "state/erc20/hooks"
import { usePoolPriceHistory } from "hooks/usePool"
import { CHART_TYPE, TIMEFRAME } from "constants/chart"

import S from "./styled"
import theme from "theme"
import PNLTooltip from "./PNLTooltip"

interface Props {
  address: string | undefined
  baseToken: string | undefined
  tfPosition?: "top" | "bottom"
}

const PoolPnlChart: React.FC<Props> = ({ address, baseToken, tfPosition }) => {
  const [tf, setTf] = React.useState(TIMEFRAME.d)
  const [baseTokenData] = useERC20Data(baseToken)

  const data = usePoolPriceHistory(address, tf)

  return (
    <S.Container>
      <S.Body>
        <Chart
          type={CHART_TYPE.area}
          data={data}
          height={"130px"}
          chart={{
            stackOffset: "silhouette",
          }}
          chartItems={[
            {
              type: "linear",
              dataKey: "price",
              legendType: "triangle",
              isAnimationActive: true,
              stroke: theme.statusColors.success,
            },
          ]}
          timeframe={{ get: tf, set: setTf }}
          timeframePosition={tfPosition}
        >
          {" "}
          <Tooltip
            content={(p) => {
              return <PNLTooltip {...p} baseToken={baseTokenData} />
            }}
          />
        </Chart>
      </S.Body>
    </S.Container>
  )
}

export default PoolPnlChart
