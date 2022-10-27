import {
  AppButton,
  Card,
  CardDescription,
  CardFormControl,
  CardHead,
  Icon,
  TokenChip,
} from "common"
import { ICON_NAMES } from "constants/icon-names"
import Switch from "components/Switch"
import { DurationField, InputField, OverlapInputField } from "fields"
import {
  Dispatch,
  FC,
  HTMLAttributes,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
} from "react"
import {
  DaoProposalSettingsForm,
  FundDaoCreatingContext,
} from "context/FundDaoCreatingContext"
import { useFormValidation } from "hooks/useFormValidation"
import * as S from "forms/CreateFundDaoForm/styled"
import { useERC20 } from "hooks/useERC20"
import { readFromClipboard } from "utils/clipboard"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import { useActiveWeb3React } from "hooks"

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

  const [, erc20TokenData] = useERC20(rewardToken.get)

  const { chainId } = useActiveWeb3React()

  const erc20TokenExplorerLink = useMemo(() => {
    return chainId
      ? getExplorerLink(chainId, rewardToken.get, ExplorerDataType.ADDRESS)
      : ""
  }, [chainId, rewardToken.get])

  const pasteFromClipboard = useCallback(
    async (dispatchCb: Dispatch<SetStateAction<any>>) => {
      dispatchCb(await readFromClipboard())
    },
    []
  )

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
            hint="1 token=1 Voting Power"
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
          <OverlapInputField
            value={rewardToken.get}
            setValue={rewardToken.set}
            label="ERC-20 token for rewards"
            hint="Address of the ERC-20 token used for rewards — you will need to send enough of this token to the DAO treasury."
            labelNodeRight={
              isFieldValid("rewardToken") ? (
                <S.FieldValidIcon name={ICON_NAMES.greenCheck} />
              ) : (
                <></>
              )
            }
            errorMessage={getFieldErrorMessage("rewardToken")}
            onBlur={() => touchField("rewardToken")}
            nodeRight={
              <AppButton
                type="button"
                text={erc20TokenData?.name ? "Paste another" : "Paste"}
                color="default"
                size="no-paddings"
                onClick={() =>
                  erc20TokenData?.name
                    ? rewardToken.set("")
                    : pasteFromClipboard(rewardToken.set)
                }
              />
            }
            overlapNodeLeft={
              erc20TokenData?.name &&
              erc20TokenData?.symbol && (
                <TokenChip
                  name={erc20TokenData?.name}
                  symbol={erc20TokenData?.symbol}
                  link={erc20TokenExplorerLink}
                />
              )
            }
            overlapNodeRight={
              erc20TokenData?.name &&
              erc20TokenData?.symbol && (
                <AppButton
                  type="button"
                  text="Paste another"
                  color="default"
                  size="no-paddings"
                  onClick={() => {
                    rewardToken.set("")
                  }}
                />
              )
            }
            disabled={!!erc20TokenData?.name}
          />
          <InputField
            value={creationReward.get}
            setValue={creationReward.set}
            label="Amount of tokens for creator"
            errorMessage={getFieldErrorMessage("creationReward")}
            onBlur={() => touchField("creationReward")}
            hint="Size of the reward for an accepted proposal."
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
            hint="Set % of memeber’s voting tokens to be received as reward (e.g. 1% = 1 reward token for every 100 voted with)"
          />
        </CardFormControl>
      </Card>
    </>
  )
}

export default DaoSettingsParameters
