import { FC, HTMLAttributes } from "react"

import * as S from "./styled"
import { ICON_NAMES } from "consts"

interface Props extends HTMLAttributes<HTMLDivElement> {
  imgUrl?: string
  linkUrl: string
  text?: string
  linkIcon?: ICON_NAMES
}

const TokenLink: FC<Props> = ({ imgUrl, linkUrl, linkIcon, text, ...rest }) => {
  return (
    <S.Container {...rest}>
      <S.TokenImage src={imgUrl} />
      {text ? <S.TokenText>{text}</S.TokenText> : <></>}
      {linkIcon ? <S.LinkIcon name={linkIcon} /> : <></>}
      <S.Link href={linkUrl} target="_blank" />
    </S.Container>
  )
}

export default TokenLink
