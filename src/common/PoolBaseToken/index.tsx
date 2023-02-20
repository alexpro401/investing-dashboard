import { FC, HTMLAttributes, ReactNode } from "react"

import * as S from "./styled"
import Tooltip from "components/Tooltip"
import { v4 as uuidv4 } from "uuid"

interface Props extends HTMLAttributes<HTMLDivElement> {
  tokenAddress?: string
  imgUrl?: string
  label?: string
  value?: string | number | ReactNode
  percentage?: number
  tooltipMsg?: string
}

const PoolBaseToken: FC<Props> = ({
  tokenAddress,
  imgUrl,
  label,
  value,
  percentage,
  tooltipMsg,
  ...rest
}) => {
  return (
    <S.PoolBaseTokenContainer {...rest}>
      <S.PoolBaseTokenDetails>
        {value ? (
          <>
            <S.PoolBaseTokenDetailsValue>
              {value}
              {percentage !== undefined ? (
                <S.PoolBaseTokenDetailsPercentage isRaise={percentage >= 0}>
                  {percentage >= 0 ? `+${percentage}%` : `${percentage}%`}
                </S.PoolBaseTokenDetailsPercentage>
              ) : (
                <></>
              )}
            </S.PoolBaseTokenDetailsValue>
          </>
        ) : (
          <></>
        )}
        {label ? (
          <S.PoolBaseTokenDetailsLabel>
            {label}
            {tooltipMsg ? <Tooltip id={uuidv4()}>{tooltipMsg}</Tooltip> : <></>}
          </S.PoolBaseTokenDetailsLabel>
        ) : (
          <></>
        )}
      </S.PoolBaseTokenDetails>
      {tokenAddress ? (
        <S.PoolBaseTokenTokenIcon address={tokenAddress} />
      ) : imgUrl ? (
        <S.PoolBaseTokenImage src={imgUrl} />
      ) : (
        <></>
      )}
    </S.PoolBaseTokenContainer>
  )
}

export default PoolBaseToken
