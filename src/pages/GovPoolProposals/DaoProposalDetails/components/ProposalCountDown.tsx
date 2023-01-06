import * as S from "../styled"
import * as React from "react"
import { FC, HTMLAttributes } from "react"
import { useCountdown } from "hooks"

interface Props extends HTMLAttributes<HTMLDivElement> {
  date: number | Date
}

const ProposalCountDown: FC<Props> = ({ date, ...rest }) => {
  const { parsedCountDown } = useCountdown(date)

  return (
    <S.DaoProposalCountdown {...rest}>
      {parsedCountDown.toUpperCase()}
    </S.DaoProposalCountdown>
  )
}

export default ProposalCountDown
