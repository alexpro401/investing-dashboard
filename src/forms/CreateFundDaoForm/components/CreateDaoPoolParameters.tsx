import { CreateDaoCardStepNumber } from "./index"
import { Card, CardDescription, CardFormControl, CardHead, Icon } from "common"
import Switch from "components/Switch"
import { InputField } from "fields"

import * as S from "../styled"

import { FC, HTMLAttributes } from "react"
import { Flex } from "theme"
import { DaoProposalSettingsForm } from "context/FundDaoCreatingContext"
import { ICON_NAMES } from "constants/icon-names"

import CreateFundDocsImage from "assets/others/create-fund-docs.png"

interface Props extends HTMLAttributes<HTMLDivElement> {
  poolParameters: DaoProposalSettingsForm
}

const CreateDaoPoolParameters: FC<Props> = ({ poolParameters }) => {
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
  } = poolParameters

  return (
    <Flex gap={"16"} dir={"column"} ai={"stretch"} p={"16px"} full>
      <S.CenteredImage src={CreateFundDocsImage} />

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
          <InputField
            value={duration.get}
            setValue={duration.set}
            label="*Duration of voting"
          />
          <InputField
            value={quorum.get}
            setValue={quorum.set}
            label="Votes needed for quorum"
          />
        </CardFormControl>
      </Card>

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
          />
          <InputField
            value={minVotesForCreating.get}
            setValue={minVotesForCreating.set}
            label="Creating a proposal"
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
          />
          <InputField
            value={voteRewardsCoefficient.get}
            setValue={voteRewardsCoefficient.set}
            label="Amount of tokens for the voter"
          />
          <InputField
            value={executionReward.get}
            setValue={executionReward.set}
            label="Amount of tokens for tx. executor"
          />
        </CardFormControl>
      </Card>
    </Flex>
  )
}

export default CreateDaoPoolParameters
