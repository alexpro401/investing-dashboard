import * as S from "./styled"

import { FC, HTMLAttributes, useCallback, useMemo } from "react"
import { normalizeBigNumber, fromBig, shortenAddress } from "utils"
import { useGovPoolProposal } from "hooks/dao"
import { GovProposalCardHead } from "common/dao"
import ProgressLine from "components/ProgressLine"
import { Flex } from "theme"
import TokenIcon from "components/TokenIcon"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import { useWeb3React } from "@web3-react/core"
import { WrappedProposalView } from "types"
import { isEqual } from "lodash"
import { ZERO_ADDR } from "constants/index"
import { useNavigate } from "react-router-dom"

interface Props extends HTMLAttributes<HTMLDivElement> {
  wrappedProposalView: WrappedProposalView
  govPoolAddress?: string
  onButtonClick?: () => void
  completed: boolean
}

const DaoProposalCard: FC<Props> = ({
  govPoolAddress,
  wrappedProposalView,
  onButtonClick,
  completed,
  ...rest
}) => {
  const {
    creator,
    votedAddresses,
    name,
    proposalType,
    voteEnd,
    isSecondStepProgressStarted,
    currentVotesVoted,
    votesTotalNeed,
    executed,
    isInsurance,
    isDistribution,
    distributionProposalTokenAddress,
    distributionProposalToken,
    rewardTokenAddress,
    rewardToken,
    isProposalStateVoting,
    isProposalStateWaitingForVotingTransfer,
    isProposalStateValidatorVoting,
    isProposalStateDefeated,
    isProposalStateSucceeded,
    isProposalStateExecuted,
    moveProposalToValidators,
    claimRewards,
    execute,
    executeAndClaim,
    progress,
    insuranceProposalView,
  } = useGovPoolProposal(wrappedProposalView, govPoolAddress)

  const { chainId } = useWeb3React()

  const navigate = useNavigate()

  const proposalDetailsLinkPath = useMemo(
    () => `/dao/${govPoolAddress}/proposal/${wrappedProposalView.proposalId}`,
    [govPoolAddress, wrappedProposalView]
  )

  const cardBtnText = useMemo(() => {
    if (isProposalStateVoting) {
      return voteEnd
    } else if (isProposalStateWaitingForVotingTransfer) {
      return "Start second step (validators)"
    } else if (isProposalStateValidatorVoting) {
      return `Second step ${voteEnd}`
    } else if (isProposalStateSucceeded) {
      return "Execute"
    } else if (isProposalStateExecuted) {
      if (
        rewardTokenAddress &&
        !isEqual(rewardTokenAddress, ZERO_ADDR) &&
        !!wrappedProposalView.currentAccountRewards
      ) {
        return "Claim"
      } else {
        return ""
      }
    } else {
      return ""
    }
  }, [
    isProposalStateExecuted,
    isProposalStateSucceeded,
    isProposalStateValidatorVoting,
    isProposalStateVoting,
    isProposalStateWaitingForVotingTransfer,
    rewardTokenAddress,
    voteEnd,
    wrappedProposalView,
  ])

  const handleCardBtnClick = useCallback(async () => {
    if (isProposalStateVoting || isProposalStateValidatorVoting) {
      navigate(proposalDetailsLinkPath)
    } else if (isProposalStateWaitingForVotingTransfer) {
      await moveProposalToValidators()
    } else if (isProposalStateSucceeded) {
      if (isEqual(rewardTokenAddress, ZERO_ADDR)) {
        await execute()
      } else {
        await executeAndClaim()
      }
    } else if (
      isProposalStateExecuted &&
      !!rewardTokenAddress &&
      !isEqual(rewardTokenAddress, ZERO_ADDR)
    ) {
      await claimRewards()
    }

    if (onButtonClick) {
      onButtonClick()
    }
  }, [
    claimRewards,
    execute,
    executeAndClaim,
    isProposalStateExecuted,
    isProposalStateSucceeded,
    isProposalStateValidatorVoting,
    isProposalStateVoting,
    isProposalStateWaitingForVotingTransfer,
    moveProposalToValidators,
    onButtonClick,
    proposalDetailsLinkPath,
    rewardTokenAddress,
  ])

  return (
    <S.Root {...rest}>
      <GovProposalCardHead
        isInsurance={isInsurance}
        name={name}
        pool={insuranceProposalView?.form?.pool}
        to={proposalDetailsLinkPath}
        completed={completed}
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
              {fromBig(currentVotesVoted)}/
              <S.DaoVotingStatusCounterTotal>
                {normalizeBigNumber(votesTotalNeed)}
              </S.DaoVotingStatusCounterTotal>
            </>
          </S.DaoProposalCardBlockInfoValue>
          <S.DaoProposalCardBlockInfoLabel>
            Voting status
          </S.DaoProposalCardBlockInfoLabel>
        </S.DaoProposalCardBlockInfo>
        <S.DaoVotingProgressBar>
          <Flex full ai={"center"} jc={"space-between"} gap={"3"}>
            {isSecondStepProgressStarted ? (
              <>
                <ProgressLine w={100} />
                <ProgressLine w={progress} />
              </>
            ) : (
              <ProgressLine w={progress} />
            )}
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
                  <>
                    {`${normalizeBigNumber(
                      wrappedProposalView.currentAccountRewards
                    )} ${rewardToken?.[1]?.symbol}`}
                  </>
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

        {!isProposalStateDefeated && cardBtnText && (
          <S.DaoCenteredButton
            text={cardBtnText}
            onClick={handleCardBtnClick}
          />
        )}
      </S.DaoProposalCardBody>
    </S.Root>
  )
}

export default DaoProposalCard
