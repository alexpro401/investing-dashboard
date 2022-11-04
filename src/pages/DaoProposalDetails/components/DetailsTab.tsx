import { FC } from "react"
import * as S from "../styled"
import ExternalLink from "components/ExternalLink"
import { shortenAddress } from "utils"
import { ProposalDetailsCard } from "./index"

const DetailsTab: FC = () => {
  return (
    <>
      <S.DaoProposalDetailsCard>
        <S.DaoProposalDetailsRow>
          <S.DaoProposalDetailsRowText textType="complex">
            <p>Active settings</p>
          </S.DaoProposalDetailsRowText>
          <S.DaoProposalDetailsRowText textType="success">
            Proposed changes
          </S.DaoProposalDetailsRowText>
        </S.DaoProposalDetailsRow>

        <S.DaoProposalCardRowDivider />

        <S.DaoProposalDetailsRow>
          <S.DaoProposalDetailsRowText textType="complex">
            <span>Length of voting period</span>
            <p>1D/1H/1M</p>
          </S.DaoProposalDetailsRowText>
          <S.DaoProposalDetailsRowText textType="success">
            10D/1H/1M
          </S.DaoProposalDetailsRowText>
        </S.DaoProposalDetailsRow>

        <S.DaoProposalCardRowDivider />

        <S.DaoProposalDetailsRow>
          <S.DaoProposalDetailsRowText textType="complex">
            <span>Min. voting power required for voting </span>
            <p>100</p>
          </S.DaoProposalDetailsRowText>
          <S.DaoProposalDetailsRowText textType="success">
            50
          </S.DaoProposalDetailsRowText>
        </S.DaoProposalDetailsRow>
      </S.DaoProposalDetailsCard>
      <S.DaoProposalDetailsCard>
        <S.DaoProposalDetailsRow>
          <S.DaoProposalDetailsRowText textType="label">
            Contract address
          </S.DaoProposalDetailsRowText>
          <S.DaoProposalDetailsRowText textType="value">
            <ExternalLink href={""}>
              {shortenAddress("0x987654321234567898765432123456789876543")}
            </ExternalLink>
          </S.DaoProposalDetailsRowText>
        </S.DaoProposalDetailsRow>

        <S.DaoProposalCardRowDivider />

        <S.DaoProposalDetailsRow>
          <S.DaoProposalDetailsRowText textType="label">
            value
          </S.DaoProposalDetailsRowText>
          <S.DaoProposalDetailsRowText textType="value">
            0.2 BNB
          </S.DaoProposalDetailsRowText>
        </S.DaoProposalDetailsRow>
      </S.DaoProposalDetailsCard>
      <ProposalDetailsCard />
    </>
  )
}

export default DetailsTab
