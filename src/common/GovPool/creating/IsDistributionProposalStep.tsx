import React, { useContext } from "react"
import { GovPoolFormContext } from "context/govPool/GovPoolFormContext"
import {
  AppButton,
  Card,
  CardDescription,
  CardHead,
  Collapse,
  DaoSettingsParameters,
  Icon,
  Headline1,
  RegularText,
} from "common"
import { CreateDaoCardStepNumber } from "../components"

import { ICON_NAMES } from "consts/icon-names"
import theme from "theme"
import Switch from "components/Switch"
import { AlertType } from "context/AlertContext"
import { useAlert, useBreakpoints } from "hooks"
import { stepsControllerContext } from "context/StepsControllerContext"
import { useFormValidation } from "hooks/useFormValidation"
import { isPercentage, required } from "utils/validators"
import CreateFundDocsImage from "assets/others/create-fund-docs.png"

import * as S from "./styled"

interface IIsDistributionProposalStepProps {
  isCreatingProposal?: boolean
}

const IsDistributionProposalStep: React.FC<
  IIsDistributionProposalStepProps
> = ({ isCreatingProposal = false }) => {
  const { isDistributionProposal, distributionProposalSettingsForm } =
    useContext(GovPoolFormContext)

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
    if (isDistributionProposal.get) {
      formValidation.touchForm()
      if (!formValidation.isFieldsValid) return
    }

    nextCb()
  }

  const [showAlert] = useAlert()

  const handleClickShowAlert = () => {
    showAlert({
      title: "Why you may need this?",
      content: (
        <>
          <S.InfoPopupContent>
            <S.InfoPopupContentText>
              With this type of proposal, your DAO will have fair rewards
              proportional to each hodler’s token count.
              <br />
              <br /> Let’s say you want to distribute your DAO’s quarterly
              earnings to holders. You need to create a proposal with the token
              name and quantity to be distributed. Everybody who votes on this
              proposal will be able to claim tokens proportionally to how many
              tokens they voted with.
            </S.InfoPopupContentText>
          </S.InfoPopupContent>
        </>
      ),
      type: AlertType.info,
      hideDuration: 10000,
    })
  }

  return (
    <>
      <S.StepsRoot>
        {isMobile && (
          <Card>
            <CardHead
              nodeLeft={<CreateDaoCardStepNumber number={currentStepNumber} />}
              title="Token distribution proposal settings"
            />
            <CardDescription>
              <p>
                Configure the settings for proposals to distribute tokens from
                the DAO treasury to members.
              </p>
              <br />
              <p>
                After the voting, members can claim the distribution. Reward
                size depends on member’s voting power (number of tokens voted
                with).
              </p>
              <br />
              <p>
                By default, these proposals use the general voting settings.
              </p>
              <br />
              <p>
                *To ensure fair token distribution, Early vote completion and
                Vote delegation settings are turned off.
              </p>
              <br />
              <AppButton
                text="Details"
                color="default"
                size="no-paddings"
                onClick={handleClickShowAlert}
              />
            </CardDescription>
          </Card>
        )}
        {!isMobile && (
          <S.DesktopHeaderWrp>
            <Headline1 color={theme.statusColors.info} desktopWeight={900}>
              Token distribution proposal settings
            </Headline1>
            <RegularText
              color={theme.textColors.secondary}
              desktopWeight={500}
              desktopSize={"14px"}
            >
              Configure the settings for proposals to distribute tokens from the
              DAO treasury to members.
            </RegularText>
            <RegularText
              color={theme.textColors.secondary}
              desktopWeight={500}
              desktopSize={"14px"}
            >
              After the voting, members can claim the distribution. Reward size
              depends on member’s voting power (number of tokens voted with). By
              default, these proposals use the general voting settings.
            </RegularText>
            <br />
            <RegularText
              color={theme.textColors.secondary}
              desktopWeight={500}
              desktopSize={"14px"}
            >
              *To ensure fair token distribution, Early vote completion and Vote
              delegation settings are turned off.
            </RegularText>
            <br />
            <AppButton
              text="Details"
              color="default"
              size="no-paddings"
              onClick={handleClickShowAlert}
            />
          </S.DesktopHeaderWrp>
        )}

        {!isCreatingProposal && (
          <Card>
            <CardHead
              nodeLeft={<Icon name={ICON_NAMES.cog} />}
              title="Set custom voting settings"
              nodeRight={
                <Switch
                  isOn={isDistributionProposal.get}
                  onChange={(n, v) => isDistributionProposal.set(v)}
                  name={
                    "Turn on to set custom voting settings for changing general voting settings."
                  }
                />
              }
            />
            <CardDescription>
              <p>
                Adding validators activates two-stage voting for enhanced DAO
                security. You can also add this function after the DAO is
                created, by voting.
              </p>
            </CardDescription>
          </Card>
        )}

        <Collapse isOpen={isDistributionProposal.get}>
          {distributionProposalSettingsForm && (
            <>
              <S.CenteredImage src={CreateFundDocsImage} />
              <S.ConditionalParameters>
                <DaoSettingsParameters
                  poolParameters={distributionProposalSettingsForm}
                  formValidation={formValidation}
                  isCreatingProposal={isCreatingProposal}
                />
              </S.ConditionalParameters>
            </>
          )}
        </Collapse>
      </S.StepsRoot>
      <S.FormStepsNavigationWrp
        customNextCb={handleNextStep}
        nextLabel={!isCreatingProposal ? "Create DAO" : "Continue"}
      />
    </>
  )
}

export default IsDistributionProposalStep
