import { FC, HTMLAttributes } from "react"

import * as S from "./styled"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const AppHeader: FC<Props> = ({ ...rest }) => {
  return (
    <S.Root {...rest}>
      <div id="app-header" />
    </S.Root>
  )
}

export default AppHeader
