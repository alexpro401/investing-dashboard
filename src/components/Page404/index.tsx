import React from "react"

import * as S from "./styled"

type IPage404Props = {
  title: string
  text: string
  renderText?: (text: string) => JSX.Element
  renderImage?: JSX.Element
}

const Page404: React.FC<IPage404Props> = ({
  text,
  title,
  renderText,
  renderImage,
}) => {
  return (
    <S.Page404Container>
      <S.Page404Content>
        <S.Page404Title>{title}</S.Page404Title>
        <S.Page404ImageContainer>
          {renderImage && renderImage}
        </S.Page404ImageContainer>
        <S.Page404TextContainer>
          {renderText && renderText(text)}
          {!renderText && <S.Page404Text>{text}</S.Page404Text>}
        </S.Page404TextContainer>
      </S.Page404Content>
    </S.Page404Container>
  )
}

export default Page404
