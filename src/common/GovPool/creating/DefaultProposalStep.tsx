import { FC, useContext } from "react"

import { CreateDaoCardStepNumber } from "../components"
import { GovPoolFormContext } from "context/govPool/GovPoolFormContext"
import { stepsControllerContext } from "context/StepsControllerContext"
import { Card, CardDescription, CardHead } from "common"
import CreateFundDocsImage from "assets/others/create-fund-docs.png"
import { DaoSettingsParameters, Headline1, RegularText } from "common"
import { useFormValidation, useBreakpoints } from "hooks"
import { isAddressValidator, isPercentage, required } from "utils/validators"
import theme from "theme"

import * as S from "./styled"

interface IDefaultProposalStepProps {
  isCreatingProposal?: boolean
}

const DefaultProposalStep: FC<IDefaultProposalStepProps> = ({
  isCreatingProposal = false,
}) => {
  const { defaultProposalSettingForm } = useContext(GovPoolFormContext)
  const { currentStepNumber, nextCb } = useContext(stepsControllerContext)
  const { isMobile } = useBreakpoints()

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

      ...(rewardToken.get
        ? {
            rewardToken: { isAddressValidator },
          }
        : {}),
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
            {isMobile && (
              <Card>
                <CardHead
                  nodeLeft={
                    <CreateDaoCardStepNumber number={currentStepNumber} />
                  }
                  title="General voting settings"
                />
                <CardDescription>
                  <p>
                    Configure the settings for proposals, voting, vote
                    delegation, and rewards for active members.
                  </p>
                </CardDescription>
              </Card>
            )}
            {!isMobile && (
              <S.DesktopHeaderWrp>
                <Headline1 color={theme.statusColors.info} desktopWeight={900}>
                  General voting settings
                </Headline1>
                <RegularText
                  color={theme.textColors.secondary}
                  desktopWeight={500}
                  desktopSize={"14px"}
                >
                  Configure the settings for proposals, voting, vote delegation,
                  and rewards for active members.
                </RegularText>
              </S.DesktopHeaderWrp>
            )}
            {isMobile && <S.CenteredImage src={CreateFundDocsImage} />}
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
      <S.FormStepsNavigationWrp customNextCb={handleNextStep} />
    </>
  )
}

export default DefaultProposalStep
