import { FC, useContext } from "react"
import { CreateDaoCardStepNumber } from "../components"
import { FundDaoCreatingContext } from "context/FundDaoCreatingContext"
import {
  Card,
  CardDescription,
  CardHead,
  DaoSettingsParameters,
  StepsNavigation,
} from "common"
import * as S from "../styled"
import { useFormValidation } from "hooks/useFormValidation"
import { required } from "utils/validators"
import { stepsControllerContext } from "context/StepsControllerContext"

const InternalProposalStep: FC = () => {
  const { internalProposalForm } = useContext(FundDaoCreatingContext)
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
  } = internalProposalForm

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
      quorum: { required },
      earlyCompletion: { required },
      minVotesForVoting: { required },
      minVotesForCreating: { required },

      creationReward: { required },
      voteRewardsCoefficient: { required },
      executionReward: { required },
      durationValidators: { required },
      quorumValidators: { required },
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
        {internalProposalForm ? (
          <>
            <Card>
              <CardHead
                nodeLeft={
                  <CreateDaoCardStepNumber number={currentStepNumber} />
                }
                title="Internal voting settings"
              />
              <CardDescription>
                <p>
                  Configure the settings for proposals, voting, vote delegation,
                  and rewards for active members.
                </p>
              </CardDescription>
            </Card>
            <DaoSettingsParameters
              poolParameters={internalProposalForm}
              formValidation={formValidation}
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

export default InternalProposalStep
