import React, { HTMLAttributes, useMemo } from "react"
import { formatEther } from "@ethersproject/units"

import Switch from "components/Switch"
import { TokenChip } from "common"
import { DaoVotingSettings } from "types"
import {
  parseSeconds,
  parseDuration,
  parseDurationShortString,
} from "utils/time"
import { cutStringZeroes, isAddress } from "utils"
import { ZERO_ADDR } from "constants/index"
import { useERC20 } from "hooks/useERC20"
import getExplorerLink from "utils/getExplorerLink"
import { ExplorerDataType } from "utils/getExplorerLink"
import { useActiveWeb3React } from "hooks"

import * as S from "./styled"

type DaoSettingsNotRequired = Partial<
  Omit<DaoVotingSettings, "executorDescription" | "quorum">
>

interface IVotingSettingsProps
  extends HTMLAttributes<HTMLDivElement>,
    DaoSettingsNotRequired {
  quorum: string
}

const VotingSettings: React.FC<IVotingSettingsProps> = ({
  earlyCompletion,
  delegatedVotingAllowed,
  duration,
  quorum,
  minVotesForVoting,
  minVotesForCreating,
  rewardToken,
  creationReward,
  voteRewardsCoefficient,
  executionReward,
  ...rest
}) => {
  const { chainId } = useActiveWeb3React()
  const [, tokenData] = useERC20(rewardToken)

  const durationString = useMemo(
    () =>
      duration
        ? parseDurationShortString(parseDuration(parseSeconds(duration)))
        : null,
    [duration]
  )

  const isRewardTokenHasValidAddress = useMemo<boolean>(() => {
    return !(!isAddress(rewardToken) || rewardToken === ZERO_ADDR)
  }, [rewardToken])

  return (
    <S.Root {...rest}>
      {earlyCompletion !== undefined && (
        <S.Record>
          <S.Label>Early vote completion</S.Label>
          <Switch
            isOn={earlyCompletion}
            disabled
            name="early-completion-voting-settings-switch"
            onChange={() => {}}
          />
        </S.Record>
      )}
      {delegatedVotingAllowed !== undefined && (
        <S.Record>
          <S.Label>Early vote completion</S.Label>
          <Switch
            isOn={delegatedVotingAllowed}
            disabled
            name="delegating-allowed-voting-settings-switch"
            onChange={() => {}}
          />
        </S.Record>
      )}
      {durationString && (
        <S.Record>
          <S.Label>Length of voting period</S.Label>
          <S.Value>{durationString}</S.Value>
        </S.Record>
      )}
      {quorum && (
        <S.Record>
          <S.Label>Votes needed for quorum</S.Label>
          <S.Value>{quorum}</S.Value>
        </S.Record>
      )}
      {minVotesForVoting && (
        <S.Record>
          <S.Label>Min. voting power required for voting</S.Label>
          <S.Value>{minVotesForVoting}</S.Value>
        </S.Record>
      )}
      {minVotesForCreating && (
        <S.Record>
          <S.Label>Min. voting power required for creating a proposal</S.Label>
          <S.Value>{minVotesForCreating}</S.Value>
        </S.Record>
      )}
      {rewardToken !== undefined && (
        <S.Record>
          <S.Label>ERC-20 token for rewards</S.Label>
          {!isRewardTokenHasValidAddress && <S.Value>-</S.Value>}
          {isRewardTokenHasValidAddress && tokenData && chainId && (
            <TokenChip
              name={tokenData.name}
              symbol={tokenData.symbol}
              link={getExplorerLink(
                chainId,
                tokenData.address,
                ExplorerDataType.ADDRESS
              )}
            />
          )}
        </S.Record>
      )}
      {creationReward && (
        <S.Record>
          <S.Label>Tokens reward for creator</S.Label>
          {!tokenData && <S.Value>{creationReward} TKN</S.Value>}
          {tokenData && (
            <S.Value>
              {creationReward} {tokenData.symbol}
            </S.Value>
          )}
        </S.Record>
      )}
      {voteRewardsCoefficient && (
        <S.Record>
          <S.Label>Tokens reward for the voter</S.Label>
          <S.Value>{voteRewardsCoefficient} %</S.Value>
        </S.Record>
      )}
      {executionReward && (
        <S.Record>
          <S.Label>Tokens reward for member executing proposal tx.</S.Label>
          {!tokenData && <S.Value>{creationReward} TKN</S.Value>}
          {tokenData && (
            <S.Value>
              {creationReward} {tokenData.symbol}
            </S.Value>
          )}
        </S.Record>
      )}
    </S.Root>
  )
}

export default VotingSettings
