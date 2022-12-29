import * as React from "react"
import * as S from "./styled"
import theme from "theme"
import { Card } from "common"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  initialPriceUSD?: number
  currentPriceUSD?: number
  priceDiffUSD?: number
}

const PoolPriceDiff: React.FC<Props> = ({
  initialPriceUSD = 0,
  currentPriceUSD = 0,
  priceDiffUSD = 0,
  ...rest
}) => {
  const diffColor = React.useMemo(() => {
    if (priceDiffUSD > 0) {
      return theme.statusColors.success
    }
    if (priceDiffUSD < 0) {
      return theme.statusColors.error
    }

    return theme.textColors.primary
  }, [priceDiffUSD])

  return (
    <S.Root {...rest}>
      <Card>
        <S.PoolPriceDiffValue>{`$ ${initialPriceUSD}`}</S.PoolPriceDiffValue>
        <S.PoolPriceDiffLabel>Initial LP Price</S.PoolPriceDiffLabel>
      </Card>
      <Card>
        <S.PoolPriceDiffValue>{`$ ${currentPriceUSD}`}</S.PoolPriceDiffValue>
        <S.PoolPriceDiffLabel>Current Price</S.PoolPriceDiffLabel>
      </Card>
      <Card>
        <S.PoolPriceDiffValue color={diffColor}>
          <>{`$ ${Math.abs(priceDiffUSD).toFixed(2)}`}</>
        </S.PoolPriceDiffValue>

        <S.PoolPriceDiffLabel>Difference</S.PoolPriceDiffLabel>
      </Card>
    </S.Root>
  )
}

export default PoolPriceDiff
