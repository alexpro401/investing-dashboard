import * as S from "./styled"
import { FC, HTMLAttributes } from "react"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const CardFormControl: FC<Props> = ({ children, ...rest }) => {
  return <S.CardFormControl {...rest}>{children}</S.CardFormControl>
}

export default CardFormControl
