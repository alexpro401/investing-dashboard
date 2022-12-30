import { FC, HTMLAttributes } from "react"

import * as S from "../styled"
import { ICON_NAMES } from "consts/icon-names"
import { VotingSettings } from "common"
import { useGovPoolProposal } from "hooks/dao"
import { cutStringZeroes, fromBig } from "utils"

interface Props extends HTMLAttributes<HTMLDivElement> {
  govPoolProposal: ReturnType<typeof useGovPoolProposal>
}

const VotingSettingsTab: FC<Props> = ({ govPoolProposal }) => {
  return (
    <>
      <S.DaoProposalDetailsCard>
        <S.DaoProposalDetailsCardTitle>
          <S.DaoProposalDetailsCardTitleIcon
            name={ICON_NAMES.exclamationCircle}
          />
          Proposal settings
        </S.DaoProposalDetailsCardTitle>
        <VotingSettings
          earlyCompletion={govPoolProposal.proposalSettings.earlyCompletion}
          delegatedVotingAllowed={
            govPoolProposal.proposalSettings.delegatedVotingAllowed
          }
          duration={govPoolProposal.proposalSettings?.duration}
          quorum={cutStringZeroes(
            fromBig(govPoolProposal?.proposalSettings?.quorum, 25)
          )}
          minVotesForVoting={
            govPoolProposal?.proposalSettings?.minVotesForVoting
          }
          minVotesForCreating={
            govPoolProposal?.proposalSettings?.minVotesForCreating
          }
          rewardToken={govPoolProposal?.proposalSettings?.rewardToken}
          creationReward={govPoolProposal?.proposalSettings?.creationReward}
          voteRewardsCoefficient={
            govPoolProposal?.proposalSettings?.voteRewardsCoefficient
          }
          executionReward={govPoolProposal?.proposalSettings?.executionReward}
        />
      </S.DaoProposalDetailsCard>
    </>
  )
}

export default VotingSettingsTab
