import { FC, useContext } from "react"
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
import Switch from "components/Switch"
import { useFormValidation, useBreakpoints } from "hooks"
import useAlert, { AlertType } from "hooks/useAlert"
import { stepsControllerContext } from "context/StepsControllerContext"
import { isPercentage, required } from "utils/validators"
import theme from "theme"

import * as S from "./styled"

const IsCustomVotingStep: FC = () => {
  const { isCustomVoting, internalProposalForm } =
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
    if (isCustomVoting.get) {
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
            <S.InfoPopupContentTitle>Example 1</S.InfoPopupContentTitle>
            <S.InfoPopupContentText>
              E.g., you see that proposals are not reaching quorum so you want
              to lower it. But your proposals to change the quorum also don’t
              reach the quorum. Here you can have a proposal to change quorum
              requirements for all proposal types with a lower quorum.
            </S.InfoPopupContentText>
            <S.InfoPopupContentTitle>Example 2</S.InfoPopupContentTitle>
            <S.InfoPopupContentText>
              You want the proposals that change general voting settings to have
              a higher barrier to avoid abuse and to be voted on by only large
              token holders. Here you can set the minimum voting threshold to a
              high level in order to achieve this.
            </S.InfoPopupContentText>
          </S.InfoPopupContent>
        </>
      ),
      type: AlertType.info,
      hideDuration: 1000000,
    })
  }

  return (
    <>
      <S.StepsRoot>
        {isMobile && (
          <Card>
            <CardHead
              nodeLeft={<CreateDaoCardStepNumber number={4} />}
              title="Changing General voting settings"
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
                onClick={handleClickShowAlert}
              />
            </CardDescription>
          </Card>
        )}
        {!isMobile && (
          <S.DesktopHeaderWrp>
            <Headline1 color={theme.statusColors.info} desktopWeight={900}>
              Changing General voting settings
            </Headline1>
            <RegularText
              color={theme.textColors.secondary}
              desktopWeight={500}
              desktopSize={"14px"}
            >
              Configure the settings for proposals to change the General voting
              settings (the ones you set up in the previous step).
            </RegularText>
            <RegularText
              color={theme.textColors.secondary}
              desktopWeight={500}
              desktopSize={"14px"}
            >
              By default, these proposals use the general voting settings.
            </RegularText>
            <br />
            <AppButton
              text="Why you may need this?"
              color="default"
              size="no-paddings"
              onClick={handleClickShowAlert}
            />
          </S.DesktopHeaderWrp>
        )}

        <Card>
          <CardHead
            nodeLeft={<Icon name={ICON_NAMES.cog} />}
            title="Set custom voting settings"
            nodeRight={
              <Switch
                isOn={isCustomVoting.get}
                onChange={(n, v) => isCustomVoting.set(v)}
                name={
                  "Turn on to set custom voting settings for changing general voting settings."
                }
              />
            }
          />
          <CardDescription>
            <p>
              Adding validators activates two-stage voting for enhanced DAO
              security. You can also add this function after the DAO is created,
              by voting.
            </p>
          </CardDescription>
        </Card>
      </S.StepsRoot>

      <Collapse isOpen={isCustomVoting.get}>
        {internalProposalForm && (
          <S.StepsRoot>
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
            <S.ConditionalParameters>
              <DaoSettingsParameters
                poolParameters={internalProposalForm}
                formValidation={formValidation}
              />
            </S.ConditionalParameters>
          </S.StepsRoot>
        )}
      </Collapse>
      <S.FormStepsNavigationWrp customNextCb={handleNextStep} />
    </>
  )
}

export default IsCustomVotingStep
