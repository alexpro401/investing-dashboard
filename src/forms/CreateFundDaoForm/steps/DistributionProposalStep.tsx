import { FC, useContext } from "react"
import { CreateDaoCardStepNumber } from "../components"
import { FundDaoCreatingContext } from "context/FundDaoCreatingContext"
import {
  AppButton,
  Card,
  CardDescription,
  CardHead,
  DaoSettingsParameters,
  StepsNavigation,
} from "common"

import * as S from "../styled"

import CreateFundDocsImage from "assets/others/create-fund-docs.png"
import { stepsControllerContext } from "../../../context/StepsControllerContext"
import { useFormValidation } from "../../../hooks/useFormValidation"
import { required } from "../../../utils/validators"

const DistributionProposalStep: FC = () => {
  const { distributionProposalSettingsForm } = useContext(
    FundDaoCreatingContext
  )
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
  } = distributionProposalSettingsForm

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
        {distributionProposalSettingsForm ? (
          <>
            <Card>
              <CardHead
                nodeLeft={
                  <CreateDaoCardStepNumber number={currentStepNumber} />
                }
                title="Changing General voting settings*"
              />
              <CardDescription>
                <p>
                  Configure the settings for proposals to change the General
                  voting settings (the ones you set up in the previous step).
                </p>
                <br />
                <p>
                  By default, these proposals use the general voting settings.
                </p>
                <br />
                <AppButton
                  text="Why you may need this?"
                  color="default"
                  size="no-paddings"
                />
              </CardDescription>
            </Card>
            <S.CenteredImage src={CreateFundDocsImage} />
            <DaoSettingsParameters
              poolParameters={distributionProposalSettingsForm}
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

export default DistributionProposalStep
