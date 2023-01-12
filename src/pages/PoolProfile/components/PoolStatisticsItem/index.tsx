import { FC, HTMLAttributes } from "react"
import * as S from "./styled"
import { useBreakpoints } from "../../../../hooks"

interface Props extends HTMLAttributes<HTMLDivElement> {
  tokenAddress?: string
  imgUrl?: string
  label?: string
  value?: string
  percentage?: string
}

export const PoolStatisticsItem: FC<Props> = ({
  tokenAddress,
  imgUrl,
  label,
  value,
  percentage,
  ...rest
}) => {
  const { isSmallTablet } = useBreakpoints()

  return (
    <S.PoolStatisticsItem {...rest}>
      {tokenAddress ? (
        <S.PoolStatisticsItemTokenIcon address={tokenAddress} />
      ) : imgUrl ? (
        <S.PoolStatisticsItemImage src={imgUrl} />
      ) : (
        <></>
      )}
      <S.PoolStatisticsItemDetails>
        {label ? (
          <S.PoolStatisticsItemDetailsLabel>
            {label}
          </S.PoolStatisticsItemDetailsLabel>
        ) : (
          <></>
        )}
        {value ? (
          <S.PoolStatisticsItemDetailsValue>
            {value}
            {isSmallTablet && percentage ? (
              <S.PoolStatisticsItemDetailsPercentage>
                {percentage}
              </S.PoolStatisticsItemDetailsPercentage>
            ) : (
              <></>
            )}
          </S.PoolStatisticsItemDetailsValue>
        ) : (
          <></>
        )}
      </S.PoolStatisticsItemDetails>
    </S.PoolStatisticsItem>
  )
}

export default PoolStatisticsItem
