import { FC, HTMLAttributes } from "react"
import * as S from "../styled"
import ExternalLink from "components/ExternalLink"
import { shortenAddress } from "utils"
import { ProposalDetailsCard } from "./index"
import { useGovPoolProposal } from "hooks/dao"
import {
  GovPoolProposalAddToken,
  GovPoolProposalChangeSettings,
  GovPoolProposalChangeValidatorBalances,
  GovPoolProposalCustom,
  GovPoolProposalDistribution,
  GovPoolProposalInsurance,
  GovPoolProposalProfile,
} from "./DetailsTabVariants"
import { ICON_NAMES } from "consts/icon-names"
import { copyToClipboard } from "utils/clipboard"

interface Props extends HTMLAttributes<HTMLDivElement> {
  govPoolProposal: ReturnType<typeof useGovPoolProposal>
}

const DetailsTab: FC<Props> = ({ govPoolProposal }) => {
  return (
    <>
      {govPoolProposal.proposalType === "profile" ? (
        <S.DaoProposalDetailsCard>
          <GovPoolProposalProfile govPoolProposal={govPoolProposal} />
        </S.DaoProposalDetailsCard>
      ) : govPoolProposal.proposalType === "distribution" ? (
        <S.DaoProposalDetailsCard>
          <GovPoolProposalDistribution govPoolProposal={govPoolProposal} />
        </S.DaoProposalDetailsCard>
      ) : govPoolProposal.proposalType === "change-settings" ? (
        <S.DaoProposalDetailsCard>
          <GovPoolProposalChangeSettings govPoolProposal={govPoolProposal} />
        </S.DaoProposalDetailsCard>
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

      {govPoolProposal.executors.map((executor, idx) => (
        <S.DaoProposalDetailsCard key={idx}>
          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText textType="label">
              Contract addresses
            </S.DaoProposalDetailsRowText>
            <S.DaoProposalDetailsRowText textType="value">
              <ExternalLink href={"#"} key={idx}>
                {shortenAddress(executor)}
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

          <S.DaoProposalCardRowDivider />

          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText
              textType="label"
              style={{ maxWidth: "100%" }}
            >
              <S.DaoProposalDetailsRowTextData
                className={"hello"}
                onClick={() =>
                  copyToClipboard(
                    govPoolProposal.wrappedProposalView.proposal.data[idx]
                  )
                }
                title={govPoolProposal.wrappedProposalView.proposal.data[idx]}
              >
                {govPoolProposal.wrappedProposalView.proposal.data[
                  idx
                ].substring(0, 125)}
                ...
                <S.DaoProposalDetailsRowTextDataIcon name={ICON_NAMES.copy} />
              </S.DaoProposalDetailsRowTextData>
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRow>
        </S.DaoProposalDetailsCard>
      ))}
      <ProposalDetailsCard govPoolProposal={govPoolProposal} />
    </>
  )
}

export default DetailsTab
