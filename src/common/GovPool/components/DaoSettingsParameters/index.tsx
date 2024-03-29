import {
  Dispatch,
  FC,
  HTMLAttributes,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
} from "react"
import { isEqual } from "lodash"
import { formatUnits } from "@ethersproject/units"

import {
  AppButton,
  Card,
  CardDescription,
  CardFormControl,
  CardHead,
  Collapse,
  Icon,
  TokenChip,
} from "common/index"
import { ICON_NAMES } from "consts/icon-names"
import Switch from "components/Switch"
import { DurationField, InputField, OverlapInputField } from "fields"
import { GovPoolFormContext } from "context/govPool/GovPoolFormContext"
import { EInputBorderColors } from "fields/InputField"
import { readFromClipboard } from "utils/clipboard"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import {
  useActiveWeb3React,
  useERC20,
  useFormValidation,
  useBreakpoints,
} from "hooks"
import { GovPoolSettingsForm } from "types"
import { cutStringZeroes } from "utils"

import cosmoImg from "assets/others/cosmo.png"
import * as S from "./styled"

interface Props extends HTMLAttributes<HTMLDivElement> {
  poolParameters: GovPoolSettingsForm
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

  const { isMobile } = useBreakpoints()
  const { isValidator, initialForm, defaultProposalSettingForm } =
    useContext(GovPoolFormContext)

  const { getFieldErrorMessage, touchField, isFieldValid } = formValidation

  const isQuorumChanged = useMemo(
    () =>
      !isEqual(
        cutStringZeroes(
          formatUnits(initialForm._defaultProposalSettingForm.quorum, 25)
        ),
        cutStringZeroes(defaultProposalSettingForm.quorum.get)
      ),
    [defaultProposalSettingForm, initialForm]
  )

  const isDurationChanged = useMemo(
    () =>
      !isEqual(
        cutStringZeroes(
          formatUnits(initialForm._defaultProposalSettingForm.duration, 0)
        ),
        defaultProposalSettingForm.duration.get.toString()
      ),
    [defaultProposalSettingForm, initialForm]
  )

  const isDurationValidatorsChanged = useMemo(
    () =>
      !isEqual(
        cutStringZeroes(
          formatUnits(
            initialForm._defaultProposalSettingForm.durationValidators,
            0
          )
        ),
        defaultProposalSettingForm.durationValidators.get.toString()
      ),
    [defaultProposalSettingForm, initialForm]
  )

  const isQuorumValidatorsChanged = useMemo(
    () =>
      !isEqual(
        cutStringZeroes(
          formatUnits(
            initialForm._defaultProposalSettingForm.quorumValidators,
            25
          )
        ),
        cutStringZeroes(defaultProposalSettingForm.quorumValidators.get)
      ),
    [defaultProposalSettingForm, initialForm]
  )

  const isMinVotesForVotingChanged = useMemo(
    () =>
      !isEqual(
        cutStringZeroes(
          formatUnits(
            initialForm._defaultProposalSettingForm.minVotesForVoting,
            18
          )
        ),
        cutStringZeroes(
          defaultProposalSettingForm.minVotesForVoting.get.toString()
        )
      ),
    [defaultProposalSettingForm, initialForm]
  )

  const isMinVotesForCreatingChanged = useMemo(
    () =>
      !isEqual(
        cutStringZeroes(
          formatUnits(
            initialForm._defaultProposalSettingForm.minVotesForCreating,
            18
          )
        ),
        cutStringZeroes(
          defaultProposalSettingForm.minVotesForCreating.get.toString()
        )
      ),
    [defaultProposalSettingForm, initialForm]
  )

  const isCreationRewardChanged = useMemo(
    () =>
      !isEqual(
        cutStringZeroes(
          formatUnits(
            initialForm._defaultProposalSettingForm.creationReward,
            18
          )
        ),
        cutStringZeroes(
          defaultProposalSettingForm.creationReward.get.toString()
        )
      ),
    [defaultProposalSettingForm, initialForm]
  )

  const isVoteRewardsCoefficientChanged = useMemo(
    () =>
      !isEqual(
        cutStringZeroes(
          formatUnits(
            initialForm._defaultProposalSettingForm.voteRewardsCoefficient,
            18
          )
        ),
        cutStringZeroes(
          defaultProposalSettingForm.voteRewardsCoefficient.get.toString()
        )
      ),
    [defaultProposalSettingForm, initialForm]
  )

  const isExecutionRewardChanged = useMemo(
    () =>
      !isEqual(
        cutStringZeroes(
          formatUnits(
            initialForm._defaultProposalSettingForm.executionReward,
            18
          )
        ),
        cutStringZeroes(defaultProposalSettingForm.executionReward.get)
      ),
    [defaultProposalSettingForm, initialForm]
  )

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
        <S.DurationCardFormControl>
          <S.DurationParamsContainer>
            <DurationField
              value={duration.get}
              setValue={duration.set}
              label="*Duration of voting"
              placeholder="1Y 6Mon 2w 1d"
              errorMessage={getFieldErrorMessage("duration")}
              onBlur={() => touchField("duration")}
              borderColor={
                isCreatingProposal && isDurationChanged
                  ? EInputBorderColors.success
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
              type={"number"}
              label="Votes needed for quorum"
              errorMessage={getFieldErrorMessage("quorum")}
              onBlur={() => touchField("quorum")}
              nodeRight={<S.PercentLabel>%</S.PercentLabel>}
              borderColor={
                isCreatingProposal && isQuorumChanged
                  ? EInputBorderColors.success
                  : undefined
              }
              labelNodeRight={
                isCreatingProposal && isFieldValid("quorum") ? (
                  <S.SuccessLabelIcon name={ICON_NAMES.greenCheck} />
                ) : undefined
              }
            />
          </S.DurationParamsContainer>
        </S.DurationCardFormControl>
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
          <S.DurationCardFormControl>
            <S.DurationParamsContainer>
              <DurationField
                value={durationValidators.get}
                setValue={durationValidators.set}
                label="Length of voting period"
                errorMessage={getFieldErrorMessage("durationValidators")}
                onBlur={() => touchField("durationValidators")}
                borderColor={
                  isCreatingProposal && isDurationValidatorsChanged
                    ? EInputBorderColors.success
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
                type={"number"}
                label="Votes needed for quorum"
                nodeRight={<S.PercentLabel>%</S.PercentLabel>}
                errorMessage={getFieldErrorMessage("quorumValidators")}
                onBlur={() => touchField("quorumValidators")}
                borderColor={
                  isCreatingProposal && isQuorumValidatorsChanged
                    ? EInputBorderColors.success
                    : undefined
                }
                labelNodeRight={
                  isCreatingProposal && isFieldValid("quorumValidators") ? (
                    <S.SuccessLabelIcon name={ICON_NAMES.greenCheck} />
                  ) : undefined
                }
              />
            </S.DurationParamsContainer>
          </S.DurationCardFormControl>
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
        <S.DurationCardFormControl>
          <InputField
            value={minVotesForVoting.get}
            setValue={minVotesForVoting.set}
            type={"number"}
            label="Voting"
            errorMessage={getFieldErrorMessage("minVotesForVoting")}
            onBlur={() => touchField("minVotesForVoting")}
            borderColor={
              isCreatingProposal && isMinVotesForVotingChanged
                ? EInputBorderColors.success
                : undefined
            }
            labelNodeRight={
              isCreatingProposal && isFieldValid("minVotesForVoting") ? (
                <S.SuccessLabelIcon name={ICON_NAMES.greenCheck} />
              ) : undefined
            }
            hint="1 token=1 Voting Power"
          />
          <InputField
            value={minVotesForCreating.get}
            setValue={minVotesForCreating.set}
            type={"number"}
            label="Creating a proposal"
            errorMessage={getFieldErrorMessage("minVotesForCreating")}
            onBlur={() => touchField("minVotesForCreating")}
            borderColor={
              isCreatingProposal && isMinVotesForCreatingChanged
                ? EInputBorderColors.success
                : undefined
            }
            labelNodeRight={
              isCreatingProposal && isFieldValid("minVotesForCreating") ? (
                <S.SuccessLabelIcon name={ICON_NAMES.greenCheck} />
              ) : undefined
            }
          />
        </S.DurationCardFormControl>
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
          <p>*Rewards only granted for accepted proposals. </p>
        </CardDescription>

        <Collapse isOpen={delegatedVotingAllowed.get}>
          {delegatedVotingAllowed.get && (
            <S.RewardsContainer>
              <S.Rewards>
                <OverlapInputField
                  value={rewardToken.get}
                  setValue={rewardToken.set}
                  label="ERC-20 token for rewards"
                  hint="Address of the ERC-20 token used for rewards — you will need to send enough of this token to the DAO treasury."
                  labelNodeRight={
                    isFieldValid("rewardToken") ? (
                      <S.SuccessLabelIcon name={ICON_NAMES.greenCheck} />
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
                  type={"number"}
                  label="Amount of tokens for creator"
                  errorMessage={getFieldErrorMessage("creationReward")}
                  onBlur={() => touchField("creationReward")}
                  borderColor={
                    isCreatingProposal && isCreationRewardChanged
                      ? EInputBorderColors.success
                      : undefined
                  }
                  labelNodeRight={
                    isCreatingProposal && isFieldValid("creationReward") ? (
                      <S.SuccessLabelIcon name={ICON_NAMES.greenCheck} />
                    ) : undefined
                  }
                  hint="Size of the reward for an accepted proposal."
                />
                <InputField
                  value={voteRewardsCoefficient.get}
                  setValue={voteRewardsCoefficient.set}
                  type={"number"}
                  label="Amount of tokens for the voter"
                  errorMessage={getFieldErrorMessage("voteRewardsCoefficient")}
                  onBlur={() => touchField("voteRewardsCoefficient")}
                  borderColor={
                    isCreatingProposal && isVoteRewardsCoefficientChanged
                      ? EInputBorderColors.success
                      : undefined
                  }
                  labelNodeRight={
                    isCreatingProposal &&
                    isFieldValid("voteRewardsCoefficient") ? (
                      <S.SuccessLabelIcon name={ICON_NAMES.greenCheck} />
                    ) : undefined
                  }
                />
                <InputField
                  value={executionReward.get}
                  setValue={executionReward.set}
                  type={"number"}
                  label="Amount of tokens for tx. executor"
                  errorMessage={getFieldErrorMessage("executionReward")}
                  onBlur={() => touchField("executionReward")}
                  borderColor={
                    isCreatingProposal && isExecutionRewardChanged
                      ? EInputBorderColors.success
                      : undefined
                  }
                  labelNodeRight={
                    isCreatingProposal && isFieldValid("executionReward") ? (
                      <S.SuccessLabelIcon name={ICON_NAMES.greenCheck} />
                    ) : undefined
                  }
                  hint="Set % of memeber’s voting tokens to be received as reward (e.g. 1% = 1 reward token for every 100 voted with)"
                />
              </S.Rewards>
              {!isMobile && <S.RewardsImg src={cosmoImg} alt="" />}
            </S.RewardsContainer>
          )}
        </Collapse>
      </Card>
    </>
  )
}

export default DaoSettingsParameters
