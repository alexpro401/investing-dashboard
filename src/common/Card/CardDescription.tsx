import * as S from "./styled"
import { FC, HTMLAttributes } from "react"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const CardDescription: FC<Props> = ({ children, ...rest }) => {
  return <S.CardDescription {...rest}>{children}</S.CardDescription>
}

export default CardDescription
