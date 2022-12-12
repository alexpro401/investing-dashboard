import * as React from "react"
import * as S from "./styled"
import theme, { Text } from "theme"
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
  return (
    <S.Root {...rest}>
      <Card>
        <Text fz={16} fw={600} color="#E4F2FF" align="center">
          <>{`$ ${initialPriceUSD}`}</>
        </Text>
        <Text
          fz={13}
          fw={500}
          color={theme.textColors.secondary}
          align="center"
        >
          Initial LP Price
        </Text>
      </Card>
      <Card>
        <Text fz={16} fw={600} color="#E4F2FF" align="center">
          <>{`$ ${currentPriceUSD}`}</>
        </Text>
        <Text
          fz={13}
          fw={500}
          color={theme.textColors.secondary}
          align="center"
        >
          Current Price
        </Text>
      </Card>
      <Card>
        <Text
          fz={16}
          fw={600}
          color={
            priceDiffUSD > 0
              ? theme.statusColors.success
              : priceDiffUSD < 0
              ? theme.statusColors.error
              : "#E4F2FF"
          }
          align="center"
        >
          <>{`$ ${priceDiffUSD}`}</>
        </Text>
        <Text
          fz={13}
          fw={500}
          color={theme.textColors.secondary}
          align="center"
        >
          Difference
        </Text>
      </Card>
    </S.Root>
  )
}

export default PoolPriceDiff
