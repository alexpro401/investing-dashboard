import * as React from "react"
import * as S from "./styled"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode
  value: React.ReactNode
  align?: "left" | "right"
}

const GovProposalCardBlockInfo: React.FC<Props> = (props) => {
  const { label, value, ...rest } = props

  return (
    <S.Container {...rest}>
      <S.Value>{value}</S.Value>
      <S.Label>{label}</S.Label>
    </S.Container>
  )
}

export default GovProposalCardBlockInfo
