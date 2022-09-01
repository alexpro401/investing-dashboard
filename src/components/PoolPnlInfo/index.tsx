import S from "./styled"
import BarChart from "components/BarChart"
import ProfitLossChart from "components/ProfitLossChart"

import usePoolPnlInfo from "./usePoolPnlInfo"

interface Props {
  address: string | undefined
}

const PoolPnlInfo: React.FC<Props> = ({ address }) => {
  const [
    { poolData, baseToken },
    { totalPnlPercentage, totalPnlBase, totalUSDPnlPerc, totalUSDPnlUSD },
  ] = usePoolPnlInfo(address)

  return (
    <>
      <ProfitLossChart address={address} baseToken={poolData?.baseToken} />
      <BarChart address={address} />
      <S.Row>
        <S.Label>Total P&L LP - {baseToken?.symbol}</S.Label>
        <S.Value>
          {totalPnlPercentage}% ({totalPnlBase} {baseToken?.symbol})
        </S.Value>
      </S.Row>
      <S.Row>
        <S.Label>Total P&L LP - USD</S.Label>
        <S.Value>
          {totalUSDPnlPerc}% ({totalUSDPnlUSD} USD)
        </S.Value>
      </S.Row>
    </>
  )
}

export default PoolPnlInfo
