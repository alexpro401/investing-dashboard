import { FC, HTMLAttributes, useContext } from "react"

import { Card } from "common"
import { Flex } from "theme"
import BarChart from "components/BarChart"
import PoolPnlChart from "components/PoolPnlChart"

import * as S from "./styled"
import { PoolProfileContext } from "pages/PoolProfile/context"
import { useWindowSize } from "react-use"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const TabPoolPnl: FC<Props> = ({ ...rest }) => {
  const { fundAddress, basicToken, pnl } = useContext(PoolProfileContext)

  const { width: windowWidth } = useWindowSize()

  return (
    <>
      <Card>
        <PoolPnlChart
          key={windowWidth}
          address={fundAddress}
          baseToken={basicToken?.address}
          tfPosition="bottom"
        />
        <div>
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>Total P&L LP - {basicToken?.symbol}</S.TabCardLabel>
            <S.TabCardValue>
              {`${pnl?.total?.base.percent}% (${pnl?.total?.base?.amount} ${basicToken?.symbol})`}
            </S.TabCardValue>
          </Flex>
          <Flex full ai="center" jc="space-between" m="12px 0 0">
            <S.TabCardLabel>Total P&L LP - USD</S.TabCardLabel>
            <S.TabCardValue>
              {`${pnl?.total?.usd.percent}% (${pnl?.total?.usd?.amount} ${basicToken?.symbol})`}
            </S.TabCardValue>
          </Flex>
        </div>
      </Card>
      <Card>
        <BarChart address={fundAddress} />
      </Card>
    </>
  )
}

export default TabPoolPnl
