import { FC } from "react"
import { Card } from "common"
import { Flex, Text } from "theme"
import BarChart from "components/BarChart"
import ProfitLossChart from "components/ProfitLossChart"
import usePoolPnlInfo from "components/PoolPnlInfo/usePoolPnlInfo"

import { Indents, Label, Value } from "../styled"

const TabPoolPnl: FC<{ address: string }> = ({ address }) => {
  const [
    { poolData, baseToken },
    { totalPnlPercentage, totalPnlBase, totalUSDPnlPerc, totalUSDPnlUSD },
  ] = usePoolPnlInfo(address)

  return (
    <>
      <Indents side={false}>
        <Card>
          <Flex full ai="center" jc="space-between">
            <div>
              <Value.Big block color="#E4F2FF" p="0 0 4px">
                + $200,00
              </Value.Big>
              <Label block>Total in USD</Label>
            </div>
            <div>
              <Value.Big block color="#9AE2CB" p="0 0 4px">
                + 234%
              </Value.Big>
              <Label block align="right">
                {baseToken?.symbol}
              </Label>
            </div>
          </Flex>
          <ProfitLossChart
            address={address}
            baseToken={poolData?.baseToken}
            tfPosition="bottom"
          />
          <div>
            <Flex full ai="center" jc="space-between">
              <Label>Total P&L LP - {baseToken?.symbol}</Label>
              <Text color="#E4F2FF" fz={13} fw={600} lh="15px">
                {totalPnlPercentage}% ({totalPnlBase?.format}{" "}
                {baseToken?.symbol})
              </Text>
            </Flex>
            <Flex full ai="center" jc="space-between" m="12px 0 0">
              <Label>Total P&L LP - USD</Label>
              <Text color="#E4F2FF" fz={13} fw={600} lh="15px">
                {totalUSDPnlPerc}% ({totalUSDPnlUSD} USD)
              </Text>
            </Flex>
          </div>
        </Card>
      </Indents>
      <Indents top side={false}>
        <Card>
          <Flex full ai="center" jc="space-between">
            <Value.Big color="#E4F2FF">December, 2022</Value.Big>
            <Value.Big color="#9AE2CB">+ 234%</Value.Big>
          </Flex>
          <BarChart address={address} />
        </Card>
      </Indents>
    </>
  )
}

export default TabPoolPnl
