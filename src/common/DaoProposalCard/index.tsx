import * as S from "./styled"

import { FC, HTMLAttributes, useMemo } from "react"
import { normalizeBigNumber, fromBig, shortenAddress } from "utils"
import { IGovPool } from "interfaces/typechain/GovPool"
import { useGovPoolProposal } from "hooks/dao"
import { useParams } from "react-router-dom"
import { GovProposalCardHead } from "common/dao"
import ProgressLine from "components/ProgressLine"
import { Flex } from "theme"
import TokenIcon from "components/TokenIcon"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import { useWeb3React } from "@web3-react/core"
import { ProposalState } from "types"

interface Props extends HTMLAttributes<HTMLDivElement> {
  proposalId: number
  proposalView: IGovPool.ProposalViewStructOutput
}

const DaoProposalCard: FC<Props> = ({ proposalId, proposalView, ...rest }) => {
  const { daoAddress } = useParams()

  const {
    creator,
    votedAddresses,
    name,
    proposalType,
    voteEnd,
    votesFor,
    requiredQuorum,
    executed,
    isInsurance,
    isDistribution,
    distributionProposalTokenAddress,
    distributionProposalToken,
  } = useGovPoolProposal(proposalId, daoAddress || "", proposalView)

  const { chainId } = useWeb3React()

  const isProposalStateVoting = useMemo(
    () => String(proposalView.proposalState) === ProposalState.Voting,
    [proposalView.proposalState]
  )
  const isProposalStateWaitingForVotingTransfer = useMemo(
    () =>
      String(proposalView.proposalState) ===
      ProposalState.WaitingForVotingTransfer,
    [proposalView.proposalState]
  )
  const isProposalStateValidatorVoting = useMemo(
    () => String(proposalView.proposalState) === ProposalState.ValidatorVoting,
    [proposalView.proposalState]
  )
  const isProposalStateDefeated = useMemo(
    () => String(proposalView.proposalState) === ProposalState.Defeated,
    [proposalView.proposalState]
  )
  const isProposalStateSucceeded = useMemo(
    () => String(proposalView.proposalState) === ProposalState.Succeeded,
    [proposalView.proposalState]
  )
  const isProposalStateExecuted = useMemo(
    () => String(proposalView.proposalState) === ProposalState.Executed,
    [proposalView.proposalState]
  )
  const isProposalStateUndefined = useMemo(
    () => String(proposalView.proposalState) === ProposalState.Undefined,
    [proposalView.proposalState]
  )

  const isShowExecuteBtn = useMemo(() => {
    return false
  }, [])
  const isShowTransferToSecondStepBtn = useMemo(() => {
    return false
  }, [])

  return (
    <S.Root {...rest}>
      <GovProposalCardHead
        isInsurance={isInsurance}
        name={name}
        pool={daoAddress}
        to={`/dao/${daoAddress}/proposal/${proposalId}`}
      />
      <S.DaoProposalCardBody>
        <S.DaoProposalCardBlockInfo>
          <S.DaoProposalCardBlockInfoAddress
            href={getExplorerLink(
              chainId || 1,
              creator,
              ExplorerDataType.ADDRESS
            )}
          >
            {shortenAddress(creator)}
          </S.DaoProposalCardBlockInfoAddress>
          <S.DaoProposalCardBlockInfoLabel>
            Created by
          </S.DaoProposalCardBlockInfoLabel>
        </S.DaoProposalCardBlockInfo>

        <S.DaoProposalCardBlockInfo alignRight>
          <S.DaoProposalCardBlockInfoValue>
            <>
              {fromBig(votesFor)}/
              <S.DaoVotingStatusCounterTotal>
                {normalizeBigNumber(requiredQuorum)}
              </S.DaoVotingStatusCounterTotal>
            </>
          </S.DaoProposalCardBlockInfoValue>
          <S.DaoProposalCardBlockInfoLabel>
            Voting status
          </S.DaoProposalCardBlockInfoLabel>
        </S.DaoProposalCardBlockInfo>
        <S.DaoVotingProgressBar>
          <Flex full ai={"center"} jc={"space-between"} gap={"3"}>
            <ProgressLine
              w={
                (+normalizeBigNumber(requiredQuorum) / 100) *
                Number(normalizeBigNumber(votesFor, 18, 2))
              }
            />
            <ProgressLine w={0} />
          </Flex>
        </S.DaoVotingProgressBar>
        <S.DaoProposalCardBlockInfo>
          {isDistribution ? (
            <Flex full ai={"center"} jc={"flex-start"} gap={"4"}>
              <TokenIcon
                address={distributionProposalTokenAddress}
                m="0"
                size={20}
              />
              <S.DaoProposalCardBlockInfoAddress
                href={getExplorerLink(
                  chainId || 1,
                  distributionProposalTokenAddress,
                  ExplorerDataType.ADDRESS
                )}
              >
                {distributionProposalToken.name}
              </S.DaoProposalCardBlockInfoAddress>
            </Flex>
          ) : (
            <S.DaoProposalCardBlockInfoValue>
              {proposalType}
            </S.DaoProposalCardBlockInfoValue>
          )}
          <S.DaoProposalCardBlockInfoLabel>
            {isDistribution ? `Voting type: Token Distribution` : "Voting type"}
          </S.DaoProposalCardBlockInfoLabel>
        </S.DaoProposalCardBlockInfo>

        <S.DaoProposalCardBlockInfo alignRight>
          <S.DaoProposalCardBlockInfoValue success={executed}>
            {executed ? (
              <>
                {isDistribution ? (
                  <>
                    10000
                    <S.DaoVotingStatusCounterTotal>
                      &nbsp;(~$ 1000)
                    </S.DaoVotingStatusCounterTotal>
                  </>
                ) : (
                  "1 DEXE"
                )}
              </>
            ) : (
              votedAddresses
            )}
          </S.DaoProposalCardBlockInfoValue>
          <S.DaoProposalCardBlockInfoLabel>
            {executed ? "My Reward" : "Voted addresses"}
          </S.DaoProposalCardBlockInfoLabel>
        </S.DaoProposalCardBlockInfo>

        <S.DaoCenteredButton text={voteEnd} />
      </S.DaoProposalCardBody>
    </S.Root>
  )
}

export default DaoProposalCard
