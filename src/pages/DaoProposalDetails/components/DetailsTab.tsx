import { FC, HTMLAttributes } from "react"
import * as S from "../styled"
import ExternalLink from "components/ExternalLink"
import { shortenAddress } from "utils"
import { ProposalDetailsCard } from "./index"
import { useGovPoolProposal } from "hooks/dao"

interface Props extends HTMLAttributes<HTMLDivElement> {
  govPoolProposal: ReturnType<typeof useGovPoolProposal>
}

const DetailsTab: FC<Props> = ({ govPoolProposal }) => {
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
            Contract addresses
          </S.DaoProposalDetailsRowText>
          <S.DaoProposalDetailsRowText textType="value">
            [
            {govPoolProposal.executors.map((el, idx) => (
              <ExternalLink href={"#"} key={idx}>
                {shortenAddress(el)}
              </ExternalLink>
            ))}
            ]
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
      <ProposalDetailsCard govPoolProposal={govPoolProposal} />
    </>
  )
}

export default DetailsTab
