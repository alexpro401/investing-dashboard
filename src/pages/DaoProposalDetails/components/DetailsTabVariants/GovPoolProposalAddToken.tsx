import { FC, HTMLAttributes } from "react"
import { useGovPoolProposal } from "hooks/dao"

interface Props extends HTMLAttributes<HTMLDivElement> {
  govPoolProposal: ReturnType<typeof useGovPoolProposal>
}

const GovPoolProposalAddToken: FC<Props> = ({ ...rest }) => {
  return <></>
}

export default GovPoolProposalAddToken
