import { FC, useContext } from "react"
import { CreateDaoCardStepNumber } from "../components"
import { FundDaoCreatingContext } from "context/FundDaoCreatingContext"
import { stepsControllerContext } from "context/StepsControllerContext"
import { Card, CardDescription, CardHead, StepsNavigation } from "common"
import * as S from "../styled"
import CreateFundDocsImage from "assets/others/create-fund-docs.png"
import { DaoSettingsParameters } from "common"
import { useFormValidation } from "hooks/useFormValidation"
import { isPercentage, required } from "utils/validators"

interface IDefaultProposalStepProps {
  isCreatingProposal?: boolean
}

const DefaultProposalStep: FC<IDefaultProposalStepProps> = ({
  isCreatingProposal = false,
}) => {
  const { defaultProposalSettingForm } = useContext(FundDaoCreatingContext)
  const { currentStepNumber, nextCb } = useContext(stepsControllerContext)

  const {
    delegatedVotingAllowed,
    duration,
    quorum,

    earlyCompletion,

    minVotesForVoting,
    minVotesForCreating,

    rewardToken,
    creationReward,
    voteRewardsCoefficient,
    executionReward,

    durationValidators,
    quorumValidators,
  } = defaultProposalSettingForm

  const formValidation = useFormValidation(
    {
      delegatedVotingAllowed: delegatedVotingAllowed.get,
      duration: duration.get,
      quorum: quorum.get,

      earlyCompletion: earlyCompletion.get,

      minVotesForVoting: minVotesForVoting.get,
      minVotesForCreating: minVotesForCreating.get,

      rewardToken: rewardToken.get,
      creationReward: creationReward.get,
      voteRewardsCoefficient: voteRewardsCoefficient.get,
      executionReward: executionReward.get,

      durationValidators: durationValidators.get,
      quorumValidators: quorumValidators.get,
    },
    {
      delegatedVotingAllowed: { required },
      duration: { required },
      quorum: { required, isPercentage },
      earlyCompletion: { required },
      minVotesForVoting: { required },
      minVotesForCreating: { required },

      creationReward: { required },
      voteRewardsCoefficient: { required },
      executionReward: { required },
      durationValidators: { required },
      quorumValidators: { required, isPercentage },
    }
  )

  const handleNextStep = () => {
    formValidation.touchForm()
    if (!formValidation.isFieldsValid) return

    nextCb()
  }

  return (
    <>
      <S.StepsRoot>
        {defaultProposalSettingForm ? (
          <>
            <Card>
              <CardHead
                nodeLeft={
                  <CreateDaoCardStepNumber number={currentStepNumber} />
                }
                title="General voting settings"
              />
              <CardDescription>
                <p>
                  Configure the settings for proposals, voting, vote delegation,
                  and rewards for active members.
                </p>
              </CardDescription>
            </Card>
            <S.CenteredImage src={CreateFundDocsImage} />
            <DaoSettingsParameters
              poolParameters={defaultProposalSettingForm}
              formValidation={formValidation}
              isCreatingProposal={isCreatingProposal}
            />
          </>
        ) : (
          <></>
        )}
      </S.StepsRoot>
      <StepsNavigation customNextCb={handleNextStep} />
    </>
  )
}

export default DefaultProposalStep
