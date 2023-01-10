import { FC } from "react"

import { Card } from "common"
import { Center, Flex, Text } from "theme"
import BarChart from "components/BarChart"
import PoolPnlChart from "components/PoolPnlChart"

import { usePoolPnlInfo } from "hooks/usePool"

import { Label } from "../styled"
import { GuardSpinner } from "react-spinners-kit"

const TabPoolPnl: FC<{ address: string }> = ({ address }) => {
  const [
    { poolData, baseToken },
    { totalPnlPercentage, totalPnlBase, totalUSDPnlPerc, totalUSDPnlUSD },
  ] = usePoolPnlInfo(address)

  return !poolData ? (
    <Center>
      <GuardSpinner size={20} loading />
    </Center>
  ) : (
    <>
      <Card>
        <PoolPnlChart
          address={address}
          baseToken={poolData?.baseToken}
          tfPosition="bottom"
        />
        <div>
          <Flex full ai="center" jc="space-between">
            <Label>Total P&L LP - {baseToken?.symbol}</Label>
            <Text color="#E4F2FF" fz={13} fw={600} lh="15px">
              {totalPnlPercentage}% ({totalPnlBase?.format} {baseToken?.symbol})
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
      <Card>
        {/*<Flex full ai="center" jc="space-between">*/}
        {/*  <Value.Big color="#E4F2FF">December, 2022</Value.Big>*/}
        {/*  <Value.Big color="#9AE2CB">+ 234%</Value.Big>*/}
        {/*</Flex>*/}
        <BarChart address={address} />
      </Card>
    </>
  )
}

export default TabPoolPnl
