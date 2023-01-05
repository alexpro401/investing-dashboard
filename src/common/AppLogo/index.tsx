import { FC } from "react"
import * as S from "./styled"

export interface Props {
  desktopOnly?: boolean
  mobileOnly?: boolean
  size?: number
}

const AppLogo: FC<Props> = (props) => (
  <S.LogoWrapper {...props}>
    <S.LogoIcon />
  </S.LogoWrapper>
)

export default AppLogo
