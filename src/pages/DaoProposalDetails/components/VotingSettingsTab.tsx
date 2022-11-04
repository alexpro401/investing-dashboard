import { FC } from "react"

import * as S from "../styled"
import { ICON_NAMES } from "constants/icon-names"
import Switch from "components/Switch"
import { TokenChip } from "common"

const VotingSettingsTab: FC = () => {
  return (
    <>
      <S.DaoProposalDetailsCard>
        <S.DaoProposalDetailsCardTitle>
          <S.DaoProposalDetailsCardTitleIcon
            name={ICON_NAMES.exclamationCircle}
          />
          Proposal settings
        </S.DaoProposalDetailsCardTitle>
        <S.DaoProposalDetailsRow>
          <S.DaoProposalDetailsRowText textType="label">
            Early vote completion
          </S.DaoProposalDetailsRowText>
          <Switch
            isOn={true}
            onChange={(n, v) => {}}
            name={"early-vote-completion"}
          />
        </S.DaoProposalDetailsRow>
        <S.DaoProposalCardRowDivider />
        <S.DaoProposalDetailsRow>
          <S.DaoProposalDetailsRowText textType="label">
            Voting with delegated tokens
          </S.DaoProposalDetailsRowText>
          <Switch
            isOn={true}
            onChange={(n, v) => {}}
            name={"early-vote-completion"}
          />
        </S.DaoProposalDetailsRow>
        <S.DaoProposalCardRowDivider />
        <S.DaoProposalDetailsRow>
          <S.DaoProposalDetailsRowText textType="label">
            Length of voting period
          </S.DaoProposalDetailsRowText>
          <S.DaoProposalDetailsRowText textType="value">
            1D/1H/1M
          </S.DaoProposalDetailsRowText>
        </S.DaoProposalDetailsRow>
        <S.DaoProposalCardRowDivider />
        <S.DaoProposalDetailsRow>
          <S.DaoProposalDetailsRowText textType="label">
            Min. voting power required for voting
          </S.DaoProposalDetailsRowText>
          <S.DaoProposalDetailsRowText textType="value">
            1
          </S.DaoProposalDetailsRowText>
        </S.DaoProposalDetailsRow>
        <S.DaoProposalCardRowDivider />
        <S.DaoProposalDetailsRow>
          <S.DaoProposalDetailsRowText textType="label">
            Min. voting power required for creating a proposal
          </S.DaoProposalDetailsRowText>
          <S.DaoProposalDetailsRowText textType="value">
            111
          </S.DaoProposalDetailsRowText>
        </S.DaoProposalDetailsRow>
        <S.DaoProposalCardRowDivider />
        <S.DaoProposalDetailsRow>
          <S.DaoProposalDetailsRowText textType="label">
            ERC-20 token for rewards
          </S.DaoProposalDetailsRowText>
          <S.DaoProposalDetailsRowText textType="value">
            <TokenChip name={"DEXE"} symbol={"DEXE"} link={"#"} />
          </S.DaoProposalDetailsRowText>
        </S.DaoProposalDetailsRow>
        <S.DaoProposalCardRowDivider />
        <S.DaoProposalDetailsRow>
          <S.DaoProposalDetailsRowText textType="label">
            Tokens reward for creator
          </S.DaoProposalDetailsRowText>
          <S.DaoProposalDetailsRowText textType="value">
            111 DEXE
          </S.DaoProposalDetailsRowText>
        </S.DaoProposalDetailsRow>
        <S.DaoProposalCardRowDivider />
        <S.DaoProposalDetailsRow>
          <S.DaoProposalDetailsRowText textType="label">
            Tokens reward for the voter
          </S.DaoProposalDetailsRowText>
          <S.DaoProposalDetailsRowText textType="value">
            0.1%
          </S.DaoProposalDetailsRowText>
        </S.DaoProposalDetailsRow>
        <S.DaoProposalCardRowDivider />
        <S.DaoProposalDetailsRow>
          <S.DaoProposalDetailsRowText textType="label">
            Tokens reward for member executing proposal tx.
          </S.DaoProposalDetailsRowText>
          <S.DaoProposalDetailsRowText textType="value">
            10,000 DEXE
          </S.DaoProposalDetailsRowText>
        </S.DaoProposalDetailsRow>
      </S.DaoProposalDetailsCard>
    </>
  )
}

export default VotingSettingsTab
