import { FC, HTMLAttributes } from "react"

import * as S from "./styled"
import { useBreakpoints } from "hooks"

interface Props extends HTMLAttributes<HTMLDivElement> {
  tokenAddress?: string
  imgUrl?: string
  label?: string
  value?: string | number
  percentage?: string | number
}

const PoolBaseToken: FC<Props> = ({
  tokenAddress,
  imgUrl,
  label,
  value,
  percentage,
  children,
  ...rest
}) => {
  const { isSmallTablet } = useBreakpoints()

  return (
    <S.PoolBaseTokenContainer {...rest}>
      <S.PoolBaseTokenDetails>
        {value ? (
          <>
            <S.PoolBaseTokenDetailsValue>
              {value}
              {Number(percentage) ? (
                <S.PoolBaseTokenDetailsPercentage>
                  {Number(percentage)}%
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
          <S.PoolBaseTokenDetailsLabel>{label}</S.PoolBaseTokenDetailsLabel>
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
