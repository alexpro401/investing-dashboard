import { FC, HTMLAttributes, ReactNode } from "react"

import * as S from "./styled"

interface Props extends HTMLAttributes<HTMLDivElement> {
  nodeLeft?: ReactNode
  nodeRight?: ReactNode
  title: string
}

const CardHead: FC<Props> = ({ nodeLeft, nodeRight, title, ...rest }) => {
  return (
    <S.CardHead {...rest}>
      {nodeLeft ? <S.NodeLeft>{nodeLeft}</S.NodeLeft> : <></>}
      <S.CardHeadTitle>{title}</S.CardHeadTitle>
      {nodeRight ? <S.NodeRight>{nodeRight}</S.NodeRight> : <></>}
    </S.CardHead>
  )
}

export default CardHead
