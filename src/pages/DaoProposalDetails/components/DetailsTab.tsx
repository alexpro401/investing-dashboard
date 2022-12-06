import { FC, HTMLAttributes } from "react"
import * as S from "../styled"
import ExternalLink from "components/ExternalLink"
import { shortenAddress } from "utils"
import { ProposalDetailsCard } from "./index"
import { useGovPoolProposal } from "hooks/dao"
import {
  GovPoolProposalProfile,
  GovPoolProposalDistribution,
  GovPoolProposalChangeSettings,
  GovPoolProposalChangeValidatorBalances,
  GovPoolProposalAddToken,
  GovPoolProposalCustom,
  GovPoolProposalInsurance,
} from "./DetailsTabVariants"

interface Props extends HTMLAttributes<HTMLDivElement> {
  govPoolProposal: ReturnType<typeof useGovPoolProposal>
}

const DetailsTab: FC<Props> = ({ govPoolProposal }) => {
  return (
    <>
      <S.DaoProposalDetailsCard>
        {govPoolProposal.proposalType === "profile" ? (
          <GovPoolProposalProfile govPoolProposal={govPoolProposal} />
        ) : govPoolProposal.proposalType === "distribution" ? (
          <GovPoolProposalDistribution govPoolProposal={govPoolProposal} />
        ) : govPoolProposal.proposalType === "change-settings" ? (
          <GovPoolProposalChangeSettings govPoolProposal={govPoolProposal} />
        ) : govPoolProposal.proposalType === "change-validator-balances" ? (
          <GovPoolProposalChangeValidatorBalances
            govPoolProposal={govPoolProposal}
          />
        ) : govPoolProposal.proposalType === "add-token" ? (
          <GovPoolProposalAddToken govPoolProposal={govPoolProposal} />
        ) : govPoolProposal.proposalType === "custom" ? (
          <GovPoolProposalCustom govPoolProposal={govPoolProposal} />
        ) : govPoolProposal.proposalType === "insurance" ? (
          <GovPoolProposalInsurance govPoolProposal={govPoolProposal} />
        ) : (
          <></>
        )}
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
