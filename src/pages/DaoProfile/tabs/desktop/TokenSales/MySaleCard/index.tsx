import { FC, HTMLAttributes } from "react"

import * as S from "./styled"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const MySaleCard: FC<Props> = ({ ...rest }) => {
  return <S.Container {...rest}></S.Container>
}

export default MySaleCard
