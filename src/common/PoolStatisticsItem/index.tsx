import { FC, HTMLAttributes } from "react"
import * as S from "./styled"
import { useBreakpoints } from "hooks"
import Tooltip from "components/Tooltip"
import { v4 as uuidv4 } from "uuid"

interface Props extends HTMLAttributes<HTMLDivElement> {
  tokenAddress?: string
  imgUrl?: string
  label?: string
  value?: string
  percentage?: number
  tooltipMsg?: string
}

export const PoolStatisticsItem: FC<Props> = ({
  tokenAddress,
  imgUrl,
  label,
  value,
  percentage,
  tooltipMsg,
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

            {tooltipMsg ? <Tooltip id={uuidv4()}>{tooltipMsg}</Tooltip> : <></>}
          </S.PoolStatisticsItemDetailsLabel>
        ) : (
          <></>
        )}
        {value ? (
          <S.PoolStatisticsItemDetailsValue>
            {value}
            {isSmallTablet && percentage !== undefined ? (
              <S.PoolStatisticsItemDetailsPercentage isRaise={percentage >= 0}>
                {percentage >= 0 ? `+${percentage}%` : `${percentage}%`}
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
