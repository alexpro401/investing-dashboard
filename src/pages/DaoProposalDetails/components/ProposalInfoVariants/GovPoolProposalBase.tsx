import { FC, HTMLAttributes } from "react"
import { useGovPoolProposal } from "hooks/dao"
import * as S from "../../styled"
import * as React from "react"
import { useBreakpoints } from "hooks"

interface Props extends HTMLAttributes<HTMLDivElement> {
  govPoolProposal: ReturnType<typeof useGovPoolProposal>
}

const GovPoolProposalBase: FC<Props> = ({ govPoolProposal, ...rest }) => {
  const { isMobile } = useBreakpoints()

  return isMobile ? (
    <S.DaoProposalDetailsCard {...rest}>
      {govPoolProposal.description}
    </S.DaoProposalDetailsCard>
  ) : (
    <span {...rest}>{govPoolProposal.description}</span>
  )
}

export default GovPoolProposalBase
