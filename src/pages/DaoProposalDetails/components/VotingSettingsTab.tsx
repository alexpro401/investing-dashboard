import { FC, HTMLAttributes } from "react"

import * as S from "../styled"
import { ICON_NAMES } from "constants/icon-names"
import { VotingSettings } from "common"
import { useGovPoolProposal } from "hooks/dao"
import { cutStringZeroes, fromBig } from "utils"
import { formatEther } from "@ethersproject/units"

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
          duration={govPoolProposal.proposalSettings?.duration?.toNumber()}
          quorum={cutStringZeroes(
            fromBig(govPoolProposal?.proposalSettings?.quorum, 25)
          )}
          minVotesForVoting={cutStringZeroes(
            formatEther(
              govPoolProposal?.proposalSettings?.minVotesForVoting?.toString()
            )
          )}
          minVotesForCreating={cutStringZeroes(
            formatEther(
              govPoolProposal?.proposalSettings?.minVotesForCreating?.toString()
            )
          )}
          rewardToken={govPoolProposal?.proposalSettings?.rewardToken}
          creationReward={govPoolProposal?.proposalSettings?.creationReward?.toString()}
          voteRewardsCoefficient={govPoolProposal?.proposalSettings?.voteRewardsCoefficient?.toString()}
          executionReward={govPoolProposal?.proposalSettings?.executionReward?.toString()}
        />
      </S.DaoProposalDetailsCard>
    </>
  )
}

export default VotingSettingsTab
