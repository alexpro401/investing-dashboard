import {
  FC,
  HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useGovPoolProposal } from "hooks/dao"
import * as S from "../../styled"
import { proposalTypeDataDecodingMap } from "types"
import { ethers } from "ethers"
import { parseSeconds } from "utils/time"
import { IGovSettings } from "interfaces/typechain/GovPool"
import { isEqual } from "lodash"
import { fromBig, shortenAddress } from "utils"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import { useWeb3React } from "@web3-react/core"
import ExternalLink from "components/ExternalLink"

interface Props extends HTMLAttributes<HTMLDivElement> {
  govPoolProposal: ReturnType<typeof useGovPoolProposal>
}

const GovPoolProposalChangeSettings: FC<Props> = ({ govPoolProposal }) => {
  const { chainId } = useWeb3React()

  const actualGovPoolSettings = useMemo(
    () => govPoolProposal.coreSettings,
    [govPoolProposal]
  )

  const [proposedGovPoolSettings, setProposedGovPoolSettings] =
    useState<IGovSettings.ProposalSettingsStructOutput>()

  const abiCoder = useMemo(() => new ethers.utils.AbiCoder(), [])

  const decodeProposalData = useCallback(() => {
    try {
      if (!govPoolProposal.proposalType) return

      const decodedData = abiCoder.decode(
        proposalTypeDataDecodingMap[govPoolProposal.proposalType],
        "0x" + govPoolProposal.wrappedProposalView.proposal.data[0].slice(10)
      )

      setProposedGovPoolSettings({
        ...decodedData[1][0],
        ...[
          "earlyCompletion",
          "delegatedVotingAllowed",
          "validatorsVote",
          "duration",
          "durationValidators",
          "quorum",
          "quorumValidators",
          "minVotesForVoting",
          "minVotesForCreating",
          "rewardToken",
          "creationReward",
          "executionReward",
          "voteRewardsCoefficient",
          "executorDescription",
        ].reduce(
          (acc, key, index) => ({ ...acc, [key]: decodedData[1][0][index] }),
          {}
        ),
      })
    } catch (error) {
      console.log(error)
    }
  }, [abiCoder, govPoolProposal])

  useEffect(() => {
    decodeProposalData()
  }, [abiCoder, decodeProposalData, govPoolProposal])

  return (
    <>
      <S.DaoProposalDetailsRow>
        <S.DaoProposalDetailsRowText textType="complex">
          <p>Active Settings</p>
        </S.DaoProposalDetailsRowText>
        <S.DaoProposalDetailsRowText textType="success">
          Proposed changes
        </S.DaoProposalDetailsRowText>
      </S.DaoProposalDetailsRow>

      {!isEqual(
        actualGovPoolSettings?.earlyCompletion,
        proposedGovPoolSettings?.earlyCompletion
      ) && (
        <>
          <S.DaoProposalCardRowDivider />

          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText textType="complex">
              <p>Early completion</p>
              <p>{actualGovPoolSettings?.earlyCompletion.toString()}</p>
            </S.DaoProposalDetailsRowText>
            <S.DaoProposalDetailsRowText textType="success">
              {proposedGovPoolSettings?.earlyCompletion.toString()}
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRow>
        </>
      )}

      {!isEqual(
        actualGovPoolSettings?.delegatedVotingAllowed,
        proposedGovPoolSettings?.delegatedVotingAllowed
      ) && (
        <>
          <S.DaoProposalCardRowDivider />

          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText textType="complex">
              <p>Delegated Voting Allowed</p>
              <p>{actualGovPoolSettings?.delegatedVotingAllowed.toString()}</p>
            </S.DaoProposalDetailsRowText>
            <S.DaoProposalDetailsRowText textType="success">
              {proposedGovPoolSettings?.delegatedVotingAllowed.toString()}
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRow>
        </>
      )}

      {!isEqual(
        actualGovPoolSettings?.validatorsVote,
        proposedGovPoolSettings?.validatorsVote
      ) && (
        <>
          <S.DaoProposalCardRowDivider />

          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText textType="complex">
              <p>Validators vote</p>
              <p>{actualGovPoolSettings?.validatorsVote.toString()}</p>
            </S.DaoProposalDetailsRowText>
            <S.DaoProposalDetailsRowText textType="success">
              {proposedGovPoolSettings?.validatorsVote.toString()}
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRow>
        </>
      )}

      {!isEqual(
        actualGovPoolSettings?.duration,
        proposedGovPoolSettings?.duration
      ) && (
        <>
          <S.DaoProposalCardRowDivider />

          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText textType="complex">
              <p>Length of voting period</p>
              <p>
                {parseSeconds(actualGovPoolSettings?.duration?.toNumber() || 0)}
              </p>
            </S.DaoProposalDetailsRowText>
            <S.DaoProposalDetailsRowText textType="success">
              {parseSeconds(proposedGovPoolSettings?.duration?.toNumber() || 0)}
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRow>
        </>
      )}

      {!isEqual(
        actualGovPoolSettings?.durationValidators,
        proposedGovPoolSettings?.durationValidators
      ) && (
        <>
          <S.DaoProposalCardRowDivider />

          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText textType="complex">
              <p>Duration validators</p>
              <p>
                {parseSeconds(
                  actualGovPoolSettings?.durationValidators?.toNumber() || 0
                )}
              </p>
            </S.DaoProposalDetailsRowText>
            <S.DaoProposalDetailsRowText textType="success">
              {parseSeconds(
                proposedGovPoolSettings?.durationValidators?.toNumber() || 0
              )}
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRow>
        </>
      )}

      {!isEqual(
        actualGovPoolSettings?.quorum,
        proposedGovPoolSettings?.quorum
      ) && (
        <>
          <S.DaoProposalCardRowDivider />

          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText textType="complex">
              <p>Quorum</p>
              <p>{fromBig(actualGovPoolSettings?.quorum, 25)}</p>
            </S.DaoProposalDetailsRowText>
            <S.DaoProposalDetailsRowText textType="success">
              {fromBig(proposedGovPoolSettings?.quorum, 25)}
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRow>
        </>
      )}

      {!isEqual(
        actualGovPoolSettings?.quorumValidators,
        proposedGovPoolSettings?.quorumValidators
      ) && (
        <>
          <S.DaoProposalCardRowDivider />

          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText textType="complex">
              <p>Quorum validators</p>
              <p>{fromBig(actualGovPoolSettings?.quorumValidators, 25)}</p>
            </S.DaoProposalDetailsRowText>
            <S.DaoProposalDetailsRowText textType="success">
              {fromBig(proposedGovPoolSettings?.quorumValidators, 25)}
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRow>
        </>
      )}

      {!isEqual(
        actualGovPoolSettings?.minVotesForVoting,
        proposedGovPoolSettings?.minVotesForVoting
      ) && (
        <>
          <S.DaoProposalCardRowDivider />

          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText textType="complex">
              <p>Min votes for voting</p>
              <p>{fromBig(actualGovPoolSettings?.minVotesForVoting)}</p>
            </S.DaoProposalDetailsRowText>
            <S.DaoProposalDetailsRowText textType="success">
              {fromBig(proposedGovPoolSettings?.minVotesForVoting)}
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRow>
        </>
      )}

      {!isEqual(
        actualGovPoolSettings?.minVotesForCreating,
        proposedGovPoolSettings?.minVotesForCreating
      ) && (
        <>
          <S.DaoProposalCardRowDivider />

          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText textType="complex">
              <p>Min Votes for creating</p>
              <p>{fromBig(actualGovPoolSettings?.minVotesForCreating)}</p>
            </S.DaoProposalDetailsRowText>
            <S.DaoProposalDetailsRowText textType="success">
              {fromBig(proposedGovPoolSettings?.minVotesForCreating)}
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRow>
        </>
      )}

      {!isEqual(
        actualGovPoolSettings?.rewardToken,
        proposedGovPoolSettings?.rewardToken
      ) && (
        <>
          <S.DaoProposalCardRowDivider />

          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText textType="complex">
              <p>Reward Token</p>
              <ExternalLink
                href={
                  chainId
                    ? getExplorerLink(
                        chainId,
                        actualGovPoolSettings?.rewardToken,
                        ExplorerDataType.TOKEN
                      )
                    : "#"
                }
              >
                {shortenAddress(actualGovPoolSettings?.rewardToken)}
              </ExternalLink>
            </S.DaoProposalDetailsRowText>
            <S.DaoProposalDetailsRowText textType="success">
              <ExternalLink
                href={
                  chainId
                    ? getExplorerLink(
                        chainId,
                        proposedGovPoolSettings?.rewardToken,
                        ExplorerDataType.TOKEN
                      )
                    : "#"
                }
              >
                {shortenAddress(proposedGovPoolSettings?.rewardToken)}
              </ExternalLink>
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRow>
        </>
      )}

      {!isEqual(
        actualGovPoolSettings?.creationReward,
        proposedGovPoolSettings?.creationReward
      ) && (
        <>
          <S.DaoProposalCardRowDivider />

          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText textType="complex">
              <p>Creation Reward</p>
              <p>{fromBig(actualGovPoolSettings?.creationReward)}</p>
            </S.DaoProposalDetailsRowText>
            <S.DaoProposalDetailsRowText textType="success">
              {fromBig(proposedGovPoolSettings?.creationReward)}
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRow>
        </>
      )}

      {!isEqual(
        actualGovPoolSettings?.executionReward,
        proposedGovPoolSettings?.executionReward
      ) && (
        <>
          <S.DaoProposalCardRowDivider />

          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText textType="complex">
              <p>Execution Reward</p>
              <p>{fromBig(actualGovPoolSettings?.executionReward)}</p>
            </S.DaoProposalDetailsRowText>
            <S.DaoProposalDetailsRowText textType="success">
              {fromBig(proposedGovPoolSettings?.executionReward)}
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRow>
        </>
      )}

      {!isEqual(
        actualGovPoolSettings?.voteRewardsCoefficient,
        proposedGovPoolSettings?.voteRewardsCoefficient
      ) && (
        <>
          <S.DaoProposalCardRowDivider />

          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText textType="complex">
              <p>Execution Reward</p>
              <p>{fromBig(actualGovPoolSettings?.executionReward)}</p>
            </S.DaoProposalDetailsRowText>
            <S.DaoProposalDetailsRowText textType="success">
              {fromBig(proposedGovPoolSettings?.executionReward)}
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRow>
        </>
      )}

      {!isEqual(
        actualGovPoolSettings?.executorDescription,
        proposedGovPoolSettings?.executorDescription
      ) && (
        <>
          <S.DaoProposalCardRowDivider />

          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText textType="complex">
              <p>Executor Description</p>
              <p>{actualGovPoolSettings?.executorDescription}</p>
            </S.DaoProposalDetailsRowText>
            <S.DaoProposalDetailsRowText textType="success">
              {proposedGovPoolSettings?.executorDescription}
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRow>
        </>
      )}
    </>
  )
}

export default GovPoolProposalChangeSettings
