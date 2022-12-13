import { FC, HTMLAttributes } from "react"

import * as S from "./styled"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const AppNavigation: FC<Props> = ({ ...rest }) => {
  return (
    <S.Root {...rest}>
      <S.NavTapBar />
    </S.Root>
  )
}

export default AppNavigation
