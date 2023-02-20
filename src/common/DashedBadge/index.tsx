import { FC, HTMLAttributes } from "react"

import * as S from "./styled"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const DashedBadge: FC<Props> = ({ children, ...rest }) => {
  return (
    <S.DashedBadgeWrp {...rest}>
      <S.DashedBadge>
        <S.DashedBadgeContent>
          <S.DashedBadgeText>{children}</S.DashedBadgeText>
        </S.DashedBadgeContent>
      </S.DashedBadge>
    </S.DashedBadgeWrp>
  )
}

export default DashedBadge
