import { ICON_NAMES } from "constants/icon-names"
import { FC } from "react"
import * as S from "./styled"

interface Props {
  url: string
  isLocked?: boolean
}

const NftIcon: FC<Props> = ({ url, isLocked }) => {
  return (
    <S.Container locked={isLocked}>
      <S.NftIcon src={url}></S.NftIcon>
      {isLocked && <S.LockedIcon name={ICON_NAMES.locked} />}
    </S.Container>
  )
}

export default NftIcon
