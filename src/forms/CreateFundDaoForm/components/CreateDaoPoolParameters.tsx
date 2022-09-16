import { FC, HTMLAttributes } from "react"
import { Flex } from "theme"
import * as S from "../styled"
import {
  CreateDaoCardDescription,
  CreateDaoCardHead,
  CreateDaoCardStepNumber,
} from "./index"
import CreateFundDocsImage from "assets/others/create-fund-docs.png"
import { FundDaoPoolParameters } from "context/FundDaoCreatingContext"
import { Icon } from "common"
import { ICON_NAMES } from "constants/icon-names"
import Switch from "components/Switch"
import Input from "components/Input"

interface Props extends HTMLAttributes<HTMLDivElement> {
  poolParameters: FundDaoPoolParameters
}

const CreateDaoPoolParameters: FC<Props> = ({ poolParameters, ...rest }) => {
  const {
    earlyCompletion,
    delegatedVotingAllowed,
    validatorsVote,
    duration,
    durationValidators,
    quorum,
    quorumValidators,
    minTokenBalance,
    minNftBalance,
    rewardToken,
    creationRewards,
    executionReward,
    voteRewardsCoefficient,
    executorDescription,
  } = poolParameters

  return (
    <Flex gap={"16"} dir={"column"} ai={"stretch"} p={"16px"} full>
      <S.CreateDaoCard>
        <CreateDaoCardHead
          icon={<CreateDaoCardStepNumber number={3} />}
          title="General voting settings"
        />
        <CreateDaoCardDescription>
          <p>
            Configure the settings for proposals, voting, vote delegation, and
            rewards for active members.
          </p>
        </CreateDaoCardDescription>
      </S.CreateDaoCard>

      <S.CenteredImage src={CreateFundDocsImage} />

      <S.CreateDaoCard>
        <CreateDaoCardHead
          icon={<Icon name={ICON_NAMES.users} />}
          title="Vote delegation"
          action={
            <Switch
              isOn={delegatedVotingAllowed.get}
              onChange={(n, v) => delegatedVotingAllowed.set(v)}
              name={"create-fund-is-vote-delegation-on"}
            />
          }
        />
        <CreateDaoCardDescription>
          <p>
            Turn on to allow members to delegate their votes to another member.
            We recommend to keep this option turned on.
          </p>
        </CreateDaoCardDescription>
      </S.CreateDaoCard>

      <S.CreateDaoCard>
        <CreateDaoCardHead
          icon={<Icon name={ICON_NAMES.dollarOutline} />}
          title="Voting minimums"
        />
        <CreateDaoCardDescription>
          <p>Set the minimum voting power required for:</p>
        </CreateDaoCardDescription>
        <Input
          value={minTokenBalance.get}
          onChange={minTokenBalance.set}
          theme="grey"
          label="Voting"
        />
        <Input
          value={minTokenBalance.get}
          onChange={minTokenBalance.set}
          theme="grey"
          label="Creating a proposal"
        />
      </S.CreateDaoCard>

      <S.CreateDaoCard>
        <CreateDaoCardHead
          icon={<Icon name={ICON_NAMES.dollarOutline} />}
          title="Community rewards"
          action={
            <Switch
              isOn={delegatedVotingAllowed.get}
              onChange={(n, v) => delegatedVotingAllowed.set(v)}
              name={"create-fund-is-vote-delegation-on"}
            />
          }
        />
        <CreateDaoCardDescription>
          <p>
            Motivate DAO members by automatically rewarding governance activity.
          </p>
          <br />
          <p>*Rewards only granted for accepted proposals. </p>
        </CreateDaoCardDescription>
        <Input
          value={rewardToken.get}
          onChange={rewardToken.set}
          theme="grey"
          label="ERC-20 token for rewards"
        />
        <Input
          value={minTokenBalance.get}
          onChange={minTokenBalance.set}
          theme="grey"
          label="Amount of tokens for creator"
        />
        <Input
          value={minTokenBalance.get}
          onChange={minTokenBalance.set}
          theme="grey"
          label="Amount of tokens for the voter"
        />
        <Input
          value={executorDescription.get}
          onChange={executorDescription.set}
          theme="grey"
          label="Amount of tokens for tx. executor"
        />
      </S.CreateDaoCard>
    </Flex>
  )
}

export default CreateDaoPoolParameters
