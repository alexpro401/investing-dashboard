import * as S from "../styled"

import { FC, HTMLAttributes } from "react"
import ExternalLink from "components/ExternalLink"
import { shortenAddress } from "utils"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const DaoProposalDetailsCard: FC<Props> = ({}) => {
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
          <ExternalLink href={""}>
            {shortenAddress("0x987654321234567898765432123456789876543")}
          </ExternalLink>
        </S.DaoProposalDetailsRowText>
      </S.DaoProposalDetailsRow>

      <S.DaoProposalDetailsRow>
        <S.DaoProposalDetailsRowText textType="label">
          voting status
        </S.DaoProposalDetailsRowText>
        <S.DaoProposalDetailsRowText textType="value">
          <S.DaoProposalDetailsRowText textType="value">
            10.000/
          </S.DaoProposalDetailsRowText>
          <S.DaoProposalDetailsRowText textType="label">
            80.000
          </S.DaoProposalDetailsRowText>
        </S.DaoProposalDetailsRowText>
      </S.DaoProposalDetailsRow>

      <S.DaoProposalDetailsRow>
        <S.DaoProposalDetailsRowText textType="label">
          Proposal type
        </S.DaoProposalDetailsRowText>
        <S.DaoProposalDetailsRowText textType="value">
          Changing voting options
        </S.DaoProposalDetailsRowText>
      </S.DaoProposalDetailsRow>

      <S.DaoProposalDetailsRow>
        <S.DaoProposalDetailsRowText textType="label">
          Addresses voted
        </S.DaoProposalDetailsRowText>
        <S.DaoProposalDetailsRowText textType="value">
          1
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
