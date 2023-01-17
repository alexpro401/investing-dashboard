import { FC, HTMLAttributes, useContext } from "react"

import { Card } from "common"
import { Center, Flex } from "theme"
import BarChart from "components/BarChart"
import PoolPnlChart from "components/PoolPnlChart"

import * as S from "./styled"
import { GuardSpinner } from "react-spinners-kit"
import { PoolProfileContext } from "pages/PoolProfile/context"
import { useWindowSize } from "react-use"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const TabPoolPnl: FC<Props> = ({ ...rest }) => {
  const {
    poolData,
    baseToken,
    totalPnlPercentage,
    totalPnlBase,
    totalUSDPnlPerc,
    totalUSDPnlUSD,
  } = useContext(PoolProfileContext)

  const { width: windowWidth } = useWindowSize()

  return !poolData ? (
    <Center>
      <GuardSpinner size={20} loading />
    </Center>
  ) : (
    <>
      <Card>
        <PoolPnlChart
          key={windowWidth}
          address={poolData.id}
          baseToken={poolData?.baseToken}
          tfPosition="bottom"
        />
        <div>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>Total P&L LP - {baseToken?.symbol}</S.TabCardLabel>
            <S.TabCardValue>
              {totalPnlPercentage}% ({totalPnlBase?.format} {baseToken?.symbol})
            </S.TabCardValue>
          </Flex>
          <Flex full ai="center" jc="space-between" m="12px 0 0">
            <S.TabCardLabel>Total P&L LP - USD</S.TabCardLabel>
            <S.TabCardValue>
              {totalUSDPnlPerc}% ({totalUSDPnlUSD} USD)
            </S.TabCardValue>
          </Flex>
        </div>
      </Card>
      <Card>
        <BarChart address={poolData.id} />
      </Card>
    </>
  )
}

export default TabPoolPnl
