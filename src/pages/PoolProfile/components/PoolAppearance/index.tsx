import { FC, HTMLAttributes } from "react"

import * as S from "./styled"

interface Props extends HTMLAttributes<HTMLDivElement> {
  imgUrl?: string
  symbol?: string
  name?: string
}

const PoolAppearance: FC<Props> = ({
  imgUrl,
  symbol,
  name,
  children,
  ...rest
}) => {
  return (
    <S.PoolAppearanceContainer {...rest}>
      <S.PoolAppearanceImgWrp>
        <S.PoolAppearanceImg src={imgUrl} />
      </S.PoolAppearanceImgWrp>
      <S.PoolAppearanceDetails>
        <S.PoolAppearanceTitles>
          <S.PoolAppearanceSymbol>{symbol}</S.PoolAppearanceSymbol>
          <S.PoolAppearanceName>{name}</S.PoolAppearanceName>
        </S.PoolAppearanceTitles>
        {children}
      </S.PoolAppearanceDetails>
    </S.PoolAppearanceContainer>
  )
}

export default PoolAppearance
