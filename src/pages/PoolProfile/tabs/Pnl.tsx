import { FC, HTMLAttributes, useContext } from "react"

import { Card } from "common"
import { Flex } from "theme"
import BarChart from "components/BarChart"
import PoolPnlChart from "components/PoolPnlChart"

import * as S from "./styled"
import { PoolProfileContext } from "pages/PoolProfile/context"
import { useWindowSize } from "react-use"
import { normalizeBigNumber } from "utils"

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
              {`${pnl?.total?.base.percent}% (${normalizeBigNumber(
                pnl?.total?.base?.amount,
                18,
                6
              )} ${basicToken?.symbol})`}
            </S.TabCardValue>
          </Flex>
          <Flex full ai="center" jc="space-between" m="12px 0 0">
            <S.TabCardLabel>Total P&L LP - USD</S.TabCardLabel>
            <S.TabCardValue>
              {`${pnl?.total?.usd.percent}% (${normalizeBigNumber(
                pnl?.total?.usd?.amount,
                18,
                2
              )} ${basicToken?.symbol})`}
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
