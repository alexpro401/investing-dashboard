import { FC } from "react"
import * as S from "./styled"

interface Props {
  url: string
}

const NftIcon: FC<Props> = ({ url }) => {
  return (
    <S.Container>
      <S.Icon src={url}></S.Icon>
    </S.Container>
  )
}

export default NftIcon
