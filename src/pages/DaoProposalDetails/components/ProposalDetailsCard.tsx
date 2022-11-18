import * as S from "../styled"

import { FC, HTMLAttributes } from "react"
import ExternalLink from "components/ExternalLink"
import { formatNumber, shortenAddress } from "utils"
import { useGovPoolProposal } from "hooks/dao"

interface Props extends HTMLAttributes<HTMLDivElement> {
  govPoolProposal: ReturnType<typeof useGovPoolProposal>
}

const DaoProposalDetailsCard: FC<Props> = ({ govPoolProposal }) => {
  return (
    <S.DaoProposalDetailsCard>
      <S.DaoProposalDetailsCardTitle>
        Proposal Details
      </S.DaoProposalDetailsCardTitle>

      <S.DaoProposalDetailsRow>
        <S.DaoProposalDetailsRowText textType="label">
          created
        </S.DaoProposalDetailsRowText>
        <S.DaoProposalDetailsRowText textType="value">
          <ExternalLink href={"#"}>
            {shortenAddress(govPoolProposal.creator)}
          </ExternalLink>
        </S.DaoProposalDetailsRowText>
      </S.DaoProposalDetailsRow>

      <S.DaoProposalDetailsRow>
        <S.DaoProposalDetailsRowText textType="label">
          voting status
        </S.DaoProposalDetailsRowText>
        <S.DaoProposalDetailsRowText textType="value">
          <S.DaoProposalDetailsRowText textType="value">
            {govPoolProposal.votesFor}/
          </S.DaoProposalDetailsRowText>
          <S.DaoProposalDetailsRowText textType="label">
            {formatNumber(String(govPoolProposal.votesTotalNeed), 2)}
          </S.DaoProposalDetailsRowText>
        </S.DaoProposalDetailsRowText>
      </S.DaoProposalDetailsRow>

      <S.DaoProposalDetailsRow>
        <S.DaoProposalDetailsRowText textType="label">
          Proposal type
        </S.DaoProposalDetailsRowText>
        <S.DaoProposalDetailsRowText textType="value">
          {govPoolProposal.proposalType}
        </S.DaoProposalDetailsRowText>
      </S.DaoProposalDetailsRow>

      <S.DaoProposalDetailsRow>
        <S.DaoProposalDetailsRowText textType="label">
          Addresses voted
        </S.DaoProposalDetailsRowText>
        <S.DaoProposalDetailsRowText textType="value">
          {govPoolProposal.votedAddresses}
        </S.DaoProposalDetailsRowText>
      </S.DaoProposalDetailsRow>

      <S.DaoProposalDetailsRow>
        <S.DaoProposalDetailsRowText textType="error">
          My votes
        </S.DaoProposalDetailsRowText>
        <S.DaoProposalDetailsRowText textType="error">
          200
        </S.DaoProposalDetailsRowText>
      </S.DaoProposalDetailsRow>

      <S.DaoProposalDetailsRow>
        <S.DaoProposalDetailsRowText textType="label">
          Voted via delegate
        </S.DaoProposalDetailsRowText>
        <S.DaoProposalDetailsRowText textType="value">
          0
        </S.DaoProposalDetailsRowText>
      </S.DaoProposalDetailsRow>
    </S.DaoProposalDetailsCard>
  )
}

export default DaoProposalDetailsCard
