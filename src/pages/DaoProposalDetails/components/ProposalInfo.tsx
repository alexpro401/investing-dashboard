import { FC, HTMLAttributes } from "react"
import { useGovPoolProposal } from "hooks/dao"

import {
  GovPoolProposalBase,
  GovPoolProposalInsurance,
} from "./ProposalInfoVariants"

interface Props extends HTMLAttributes<HTMLDivElement> {
  govPoolProposal: ReturnType<typeof useGovPoolProposal>
}

const ProposalInfo: FC<Props> = ({ govPoolProposal, ...rest }) => {
  return govPoolProposal.isInsurance ? (
    <GovPoolProposalInsurance govPoolProposal={govPoolProposal} {...rest} />
  ) : (
    <GovPoolProposalBase govPoolProposal={govPoolProposal} {...rest} />
  )
}

export default ProposalInfo
