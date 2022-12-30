import { ICON_NAMES } from "consts/icon-names"
import { FC, ReactNode } from "react"
import { isNil } from "lodash"
import * as S from "./styled"

interface Props {
  url: string
  round?: boolean
  isLocked?: boolean
  iconNode?: ReactNode
}

const NftIcon: FC<Props> = ({ url, isLocked, round, iconNode }) => {
  return (
    <S.Container locked={isLocked} round={round}>
      {!isNil(iconNode) ? iconNode : <S.NftIcon src={url}></S.NftIcon>}
      {isLocked && <S.LockedIcon name={ICON_NAMES.locked} />}
    </S.Container>
  )
}

export default NftIcon
