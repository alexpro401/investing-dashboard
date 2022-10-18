import { Card, CardDescription, CardFormControl, CardHead, Icon } from "common"
import { ICON_NAMES } from "constants/icon-names"
import Switch from "components/Switch"
import { DurationField, InputField } from "fields"
import { FC, HTMLAttributes, useContext } from "react"
import {
  DaoProposalSettingsForm,
  FundDaoCreatingContext,
} from "context/FundDaoCreatingContext"
import { useFormValidation } from "hooks/useFormValidation"

interface Props extends HTMLAttributes<HTMLDivElement> {
  poolParameters: DaoProposalSettingsForm
  formValidation: ReturnType<typeof useFormValidation>
}

const DaoSettingsParameters: FC<Props> = ({
  poolParameters,
  formValidation,
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
          />
          <InputField
            value={quorum.get}
            setValue={quorum.set}
            label="Votes needed for quorum"
            errorMessage={getFieldErrorMessage("quorum")}
            onBlur={() => touchField("quorum")}
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
            />
            <InputField
              value={quorumValidators.get}
              setValue={quorumValidators.set}
              label="Votes needed for quorum"
              errorMessage={getFieldErrorMessage("quorumValidators")}
              onBlur={() => touchField("quorumValidators")}
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
          />
          <InputField
            value={minVotesForCreating.get}
            setValue={minVotesForCreating.set}
            label="Creating a proposal"
            errorMessage={getFieldErrorMessage("minVotesForCreating")}
            onBlur={() => touchField("minVotesForCreating")}
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
          />
          <InputField
            value={creationReward.get}
            setValue={creationReward.set}
            label="Amount of tokens for creator"
            errorMessage={getFieldErrorMessage("creationReward")}
            onBlur={() => touchField("creationReward")}
          />
          <InputField
            value={voteRewardsCoefficient.get}
            setValue={voteRewardsCoefficient.set}
            label="Amount of tokens for the voter"
            errorMessage={getFieldErrorMessage("voteRewardsCoefficient")}
            onBlur={() => touchField("voteRewardsCoefficient")}
          />
          <InputField
            value={executionReward.get}
            setValue={executionReward.set}
            label="Amount of tokens for tx. executor"
            errorMessage={getFieldErrorMessage("executionReward")}
            onBlur={() => touchField("executionReward")}
          />
        </CardFormControl>
      </Card>
    </>
  )
}

export default DaoSettingsParameters