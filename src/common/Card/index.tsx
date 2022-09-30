import { FC, HTMLAttributes } from "react"
import * as S from "./styled"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const Card: FC<Props> = ({ children, ...rest }) => {
  return <S.Root {...rest}>{children}</S.Root>
}

export default Card
