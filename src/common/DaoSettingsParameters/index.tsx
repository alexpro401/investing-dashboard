import { Card, CardDescription, CardFormControl, CardHead, Icon } from "common"
import { ICON_NAMES } from "constants/icon-names"
import Switch from "components/Switch"
import { DurationField, InputField } from "fields"
import { FC, HTMLAttributes, useContext } from "react"
import {
  DaoProposalSettingsForm,
  FundDaoCreatingContext,
  useIsDaoFieldChanged,
} from "context/FundDaoCreatingContext"
import { useFormValidation } from "hooks/useFormValidation"
import { EInputColors } from "fields/InputField"

import * as S from "./styled"

interface Props extends HTMLAttributes<HTMLDivElement> {
  poolParameters: DaoProposalSettingsForm
  formValidation: ReturnType<typeof useFormValidation>
  isCreatingProposal?: boolean
}

const DaoSettingsParameters: FC<Props> = ({
  poolParameters,
  formValidation,
  isCreatingProposal = false,
}) => {
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
  } = poolParameters

  const { isValidator } = useContext(FundDaoCreatingContext)

  const { getFieldErrorMessage, touchField, isFieldValid } = formValidation

  const quorumIsChanged = useIsDaoFieldChanged({
    field: "defaultProposalSettingForm.quorum",
  })

  const durationIsChanged = useIsDaoFieldChanged({
    field: "defaultProposalSettingForm.duration",
  })

  const durationValidatorsIsChanged = useIsDaoFieldChanged({
    field: "defaultProposalSettingForm.durationValidators",
  })

  const quorumValidatorsIsChanged = useIsDaoFieldChanged({
    field: "defaultProposalSettingForm.quorumValidators",
  })

  const minVotesForVotingIsChanged = useIsDaoFieldChanged({
    field: "defaultProposalSettingForm.minVotesForVoting",
  })

  const minVotesForCreatingIsChanged = useIsDaoFieldChanged({
    field: "defaultProposalSettingForm.minVotesForCreating",
  })

  const rewardTokenIsChanged = useIsDaoFieldChanged({
    field: "defaultProposalSettingForm.rewardToken",
  })

  const creationRewardIsChanged = useIsDaoFieldChanged({
    field: "defaultProposalSettingForm.creationReward",
  })

  const voteRewardsCoefficientIsChanged = useIsDaoFieldChanged({
    field: "defaultProposalSettingForm.voteRewardsCoefficient",
  })

  const executionRewardIsChanged = useIsDaoFieldChanged({
    field: "defaultProposalSettingForm.executionReward",
  })

  return (
    <>
      <Card>
        <CardHead
          nodeLeft={<Icon name={ICON_NAMES.users} />}
          title="Vote delegation"
          nodeRight={
            <Switch
              isOn={delegatedVotingAllowed.get}
              onChange={(n, v) => delegatedVotingAllowed.set(v)}
              name={"create-fund-is-vote-delegation-on"}
            />
          }
        />
        <CardDescription>
          <p>
            Turn on to allow members to delegate their votes to another member.
            We recommend to keep this option turned on.
          </p>
        </CardDescription>
      </Card>

      <Card>
        <CardHead
          nodeLeft={<Icon name={ICON_NAMES.globe} />}
          title="Voting parameters"
        />
        <CardDescription>
          <p>General settings for voting.</p>
        </CardDescription>
        <CardFormControl>
          <DurationField
            value={duration.get}
            setValue={duration.set}
            label="*Duration of voting"
            placeholder="1Y 6Mon 2w 1d"
            errorMessage={getFieldErrorMessage("duration")}
            onBlur={() => touchField("duration")}
            color={
              isCreatingProposal && durationIsChanged
                ? EInputColors.success
                : undefined
            }
            labelNodeRight={
              isCreatingProposal && isFieldValid("duration") ? (
                <S.SuccessLabelIcon name={ICON_NAMES.greenCheck} />
              ) : undefined
            }
          />
          <InputField
            value={quorum.get}
            setValue={quorum.set}
            label="Votes needed for quorum"
            errorMessage={getFieldErrorMessage("quorum")}
            onBlur={() => touchField("quorum")}
            color={
              isCreatingProposal && quorumIsChanged
                ? EInputColors.success
                : undefined
            }
            labelNodeRight={
              isCreatingProposal && isFieldValid("quorum") ? (
                <S.SuccessLabelIcon name={ICON_NAMES.greenCheck} />
              ) : undefined
            }
          />
        </CardFormControl>
      </Card>

      {isValidator.get && (
        <Card>
          <CardHead
            nodeLeft={<Icon name={ICON_NAMES.cog} />}
            title="Voting settings for validators"
          />
          <CardDescription>
            <p>
              Once a proposal passes the general vote, validator will hold a
              validator-only second vote on every passed proposal to filter out
              potentially malicious proposals.
            </p>
            <br />
            <p>Set parameters for a second voting stage for validators.</p>
          </CardDescription>
          <CardFormControl>
            <InputField
              value={durationValidators.get}
              setValue={durationValidators.set}
              label="Length of voting period"
              errorMessage={getFieldErrorMessage("durationValidators")}
              onBlur={() => touchField("durationValidators")}
              color={
                isCreatingProposal && durationValidatorsIsChanged
                  ? EInputColors.success
                  : undefined
              }
              labelNodeRight={
                isCreatingProposal && isFieldValid("durationValidators") ? (
                  <S.SuccessLabelIcon name={ICON_NAMES.greenCheck} />
                ) : undefined
              }
            />
            <InputField
              value={quorumValidators.get}
              setValue={quorumValidators.set}
              label="Votes needed for quorum"
              errorMessage={getFieldErrorMessage("quorumValidators")}
              onBlur={() => touchField("quorumValidators")}
              color={
                isCreatingProposal && quorumValidatorsIsChanged
                  ? EInputColors.success
                  : undefined
              }
              labelNodeRight={
                isCreatingProposal && isFieldValid("quorumValidators") ? (
                  <S.SuccessLabelIcon name={ICON_NAMES.greenCheck} />
                ) : undefined
              }
            />
          </CardFormControl>
        </Card>
      )}

      <Card>
        <CardHead
          nodeLeft={<Icon name={ICON_NAMES.users} />}
          title="Early vote completion"
          nodeRight={
            <Switch
              isOn={earlyCompletion.get}
              onChange={(n, v) => earlyCompletion.set(v)}
              name={"create-fund-is-early-completion-on"}
            />
          }
        />
        <CardDescription>
          <p>
            Voting ends as soon as quorum is reached rather than waiting the
            entire vote duration. We recommend to keep this option turned on.
          </p>
        </CardDescription>
      </Card>

      <Card>
        <CardHead
          nodeLeft={<Icon name={ICON_NAMES.dollarOutline} />}
          title="Voting minimums"
        />
        <CardDescription>
          <p>Set the minimum voting power required for:</p>
        </CardDescription>
        <CardFormControl>
          <InputField
            value={minVotesForVoting.get}
            setValue={minVotesForVoting.set}
            label="Voting"
            errorMessage={getFieldErrorMessage("minVotesForVoting")}
            onBlur={() => touchField("minVotesForVoting")}
            color={
              isCreatingProposal && minVotesForVotingIsChanged
                ? EInputColors.success
                : undefined
            }
            labelNodeRight={
              isCreatingProposal && isFieldValid("minVotesForVoting") ? (
                <S.SuccessLabelIcon name={ICON_NAMES.greenCheck} />
              ) : undefined
            }
          />
          <InputField
            value={minVotesForCreating.get}
            setValue={minVotesForCreating.set}
            label="Creating a proposal"
            errorMessage={getFieldErrorMessage("minVotesForCreating")}
            onBlur={() => touchField("minVotesForCreating")}
            color={
              isCreatingProposal && minVotesForCreatingIsChanged
                ? EInputColors.success
                : undefined
            }
            labelNodeRight={
              isCreatingProposal && isFieldValid("minVotesForCreating") ? (
                <S.SuccessLabelIcon name={ICON_NAMES.greenCheck} />
              ) : undefined
            }
          />
        </CardFormControl>
      </Card>

      <Card>
        <CardHead
          nodeLeft={<Icon name={ICON_NAMES.dollarOutline} />}
          title="Community rewards"
          nodeRight={
            <Switch
              isOn={delegatedVotingAllowed.get}
              onChange={(n, v) => delegatedVotingAllowed.set(v)}
              name={"create-fund-is-vote-delegation-on"}
            />
          }
        />
        <CardDescription>
          <p>
            Motivate DAO members by automatically rewarding governance activity.
          </p>
          <br />
          <p>*Rewards only granted for accepted proposals. </p>
        </CardDescription>
        <CardFormControl>
          <InputField
            value={rewardToken.get}
            setValue={rewardToken.set}
            label="ERC-20 token for rewards"
            color={
              isCreatingProposal && rewardTokenIsChanged
                ? EInputColors.success
                : undefined
            }
            labelNodeRight={
              isCreatingProposal && isFieldValid("rewardToken") ? (
                <S.SuccessLabelIcon name={ICON_NAMES.greenCheck} />
              ) : undefined
            }
          />
          <InputField
            value={creationReward.get}
            setValue={creationReward.set}
            label="Amount of tokens for creator"
            errorMessage={getFieldErrorMessage("creationReward")}
            onBlur={() => touchField("creationReward")}
            color={
              isCreatingProposal && creationRewardIsChanged
                ? EInputColors.success
                : undefined
            }
            labelNodeRight={
              isCreatingProposal && isFieldValid("creationReward") ? (
                <S.SuccessLabelIcon name={ICON_NAMES.greenCheck} />
              ) : undefined
            }
          />
          <InputField
            value={voteRewardsCoefficient.get}
            setValue={voteRewardsCoefficient.set}
            label="Amount of tokens for the voter"
            errorMessage={getFieldErrorMessage("voteRewardsCoefficient")}
            onBlur={() => touchField("voteRewardsCoefficient")}
            color={
              isCreatingProposal && voteRewardsCoefficientIsChanged
                ? EInputColors.success
                : undefined
            }
            labelNodeRight={
              isCreatingProposal && isFieldValid("voteRewardsCoefficient") ? (
                <S.SuccessLabelIcon name={ICON_NAMES.greenCheck} />
              ) : undefined
            }
          />
          <InputField
            value={executionReward.get}
            setValue={executionReward.set}
            label="Amount of tokens for tx. executor"
            errorMessage={getFieldErrorMessage("executionReward")}
            onBlur={() => touchField("executionReward")}
            color={
              isCreatingProposal && executionRewardIsChanged
                ? EInputColors.success
                : undefined
            }
            labelNodeRight={
              isCreatingProposal && isFieldValid("executionReward") ? (
                <S.SuccessLabelIcon name={ICON_NAMES.greenCheck} />
              ) : undefined
            }
          />
        </CardFormControl>
      </Card>
    </>
  )
}

export default DaoSettingsParameters
