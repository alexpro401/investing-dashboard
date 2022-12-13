import { FC, HTMLAttributes } from "react"
import { useGovPoolProposal } from "hooks/dao"
import * as S from "../../styled"
import * as React from "react"

interface Props extends HTMLAttributes<HTMLDivElement> {
  govPoolProposal: ReturnType<typeof useGovPoolProposal>
}

const GovPoolProposalBase: FC<Props> = ({ govPoolProposal }) => {
  return (
    <>
      <S.DaoProposalDetailsCard>
        {govPoolProposal.description}
      </S.DaoProposalDetailsCard>
    </>
  )
}

export default GovPoolProposalBase
