import { useCallback, useEffect, useMemo, useState } from "react"
import { DateUtil } from "utils"
import { IpfsEntity } from "utils/ipfsEntity"
import { createClient, useQuery } from "urql"
import { useActiveWeb3React } from "hooks"
import {
  useGovPoolExecutor,
  useGovPool,
  useDistributionProposalToken,
} from "hooks/dao"
import { BigNumber } from "@ethersproject/bignumber"
import { ProposalState, WrappedProposalView } from "types"
import { useERC20 } from "hooks"
import { useSelector } from "react-redux"
import { selectInsuranceAddress } from "state/contracts/selectors"
import { InsuranceAccident } from "interfaces/insurance"

const GovPoolGraphClient = createClient({
  url: process.env.REACT_APP_DAO_POOLS_API_URL || "",
})

const GovPoolValidatorsGraphClient = createClient({
  url: process.env.REACT_APP_DAO_VALIDATORS_API_URL || "",
})

export const useGovPoolProposal = (
  wrappedProposalView: WrappedProposalView,
  govPoolAddress?: string
) => {
  const {
    descriptionUrl: _descriptionUrl,
    moveProposalToValidators: _moveProposalToValidators,
    execute: _execute,
    executeAndClaim: _executeAndClaim,
    claimRewards: _claimRewards,
    getCurrentAccountTotalVotes: _getCurrentAccountTotalVotes,
  } = useGovPool(govPoolAddress)

  const { account } = useActiveWeb3React()

  const [{ data: daoPoolGraph }] = useQuery({
    query: `
      query {
        proposals(where: { pool: "${govPoolAddress}", proposalId: "${wrappedProposalView?.proposalId}" }) {
          id
          executor
          creator
          voters
          distributionProposal {
            token
            amount
          }
        }
      }
    `,
    context: GovPoolGraphClient,
  })

  const [{ data: daoPoolValidatorsGraph }] = useQuery({
    query: `
      query {
        proposals(where: { pool: "${govPoolAddress}", proposalId: "${wrappedProposalView?.proposalId}", isInternal: false }) {
          id
          totalVote
        }
      }
    `,
    context: GovPoolValidatorsGraphClient,
  })

  const insuranceAddress = useSelector(selectInsuranceAddress)

  const graphGovPoolProposal = useMemo(
    () => daoPoolGraph?.proposals?.[0],
    [daoPoolGraph]
  )

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [insuranceProposalView, setInsuranceProposalView] =
    useState<InsuranceAccident>({} as InsuranceAccident)

  const [myVotesAmount, setMyVotesAmount] = useState<BigNumber>()

  const coreSettings = useMemo(
    () => wrappedProposalView?.proposal.core.settings,
    [wrappedProposalView]
  )

  const govPoolDescriptionURL = useMemo(
    () => _descriptionUrl,
    [_descriptionUrl]
  )

  const requiredQuorum = useMemo(
    () => wrappedProposalView?.requiredQuorum,
    [wrappedProposalView]
  )

  const creator = useMemo(
    () => graphGovPoolProposal?.creator,
    [graphGovPoolProposal]
  )
  const votedAddresses = useMemo(
    () => graphGovPoolProposal?.voters?.length || 0,
    [graphGovPoolProposal]
  )

  const voteEnd = useMemo(() => {
    const isValidatorsVoting =
      String(wrappedProposalView?.proposalState) ===
      ProposalState.ValidatorVoting
    return wrappedProposalView?.proposal
      ? (DateUtil.fromTimestamp(
          isValidatorsVoting
            ? wrappedProposalView?.validatorProposal?.core?.voteEnd.toNumber()
            : wrappedProposalView?.proposal.core.voteEnd.toNumber(),
          "dd/mm/yy hh:mm:ss"
        ) as string)
      : ""
  }, [wrappedProposalView])

  const executors = useMemo(
    () => wrappedProposalView?.proposal.executors || [],
    [wrappedProposalView]
  )

  const [executor] = useGovPoolExecutor(
    (govPoolAddress || "").toLowerCase(),
    (executors[executors.length - 1] || "").toLowerCase()
  )

  const proposalType = useMemo(() => {
    return executor?.type
  }, [executor])

  const proposalSettings = useMemo(
    () => wrappedProposalView?.proposal?.core?.settings || {},
    [wrappedProposalView]
  )

  const votesFor = useMemo(
    () => wrappedProposalView?.proposal?.core?.votesFor || 0,
    [wrappedProposalView]
  )

  const executed = useMemo(
    () => wrappedProposalView?.proposal?.core?.executed,
    [wrappedProposalView]
  )

  const isInsurance = useMemo(() => {
    const lastExecutor = String(
      wrappedProposalView?.proposal?.executors[
        wrappedProposalView?.proposal?.executors.length - 1
      ]
    ).toLocaleLowerCase()

    return lastExecutor === String(insuranceAddress).toLocaleLowerCase()
  }, [wrappedProposalView])

  const isDistribution = useMemo(() => {
    return executor?.type === "distribution"
  }, [executor])

  const distributionProposalTokenAddress = useMemo(
    () => graphGovPoolProposal?.distributionProposal?.[0]?.token,
    [graphGovPoolProposal]
  )

  const distributionProposalTokenAmount = useMemo(
    () => graphGovPoolProposal?.distributionProposal?.[0]?.amount,
    [graphGovPoolProposal]
  )

  const distributionProposalToken = useDistributionProposalToken(
    distributionProposalTokenAddress
  )

  const rewardTokenAddress = useMemo(
    () => wrappedProposalView?.proposal.core.settings.rewardToken,
    [wrappedProposalView]
  )

  const rewardToken = useERC20(rewardTokenAddress)

  const isProposalStateVoting = useMemo(
    () => String(wrappedProposalView?.proposalState) === ProposalState.Voting,
    [wrappedProposalView]
  )
  const isProposalStateWaitingForVotingTransfer = useMemo(
    () =>
      String(wrappedProposalView?.proposalState) ===
      ProposalState.WaitingForVotingTransfer,
    [wrappedProposalView]
  )
  const isProposalStateValidatorVoting = useMemo(
    () =>
      String(wrappedProposalView?.proposalState) ===
      ProposalState.ValidatorVoting,
    [wrappedProposalView]
  )
  const isProposalStateDefeated = useMemo(
    () => String(wrappedProposalView?.proposalState) === ProposalState.Defeated,
    [wrappedProposalView]
  )
  const isProposalStateSucceeded = useMemo(
    () =>
      String(wrappedProposalView?.proposalState) === ProposalState.Succeeded,
    [wrappedProposalView]
  )
  const isProposalStateExecuted = useMemo(
    () => String(wrappedProposalView?.proposalState) === ProposalState.Executed,
    [wrappedProposalView]
  )

  const isSecondStepProgressStarted = useMemo(
    () =>
      !!wrappedProposalView?.validatorProposal?.core?.voteEnd?.gt(0) ||
      isProposalStateValidatorVoting ||
      wrappedProposalView?.proposal?.core?.votesFor.gt(
        wrappedProposalView?.requiredQuorum
      ),
    [isProposalStateValidatorVoting, wrappedProposalView]
  )

  const currentVotesVoted = useMemo(
    () =>
      isSecondStepProgressStarted
        ? wrappedProposalView?.validatorProposal?.core?.votesFor
        : wrappedProposalView?.proposal?.core?.votesFor,
    [isSecondStepProgressStarted, wrappedProposalView]
  )

  const votesTotalNeed = useMemo(
    () =>
      isSecondStepProgressStarted
        ? wrappedProposalView?.requiredValidatorsQuorum
        : wrappedProposalView?.requiredQuorum,
    [isSecondStepProgressStarted, wrappedProposalView]
  )

  const progress = useMemo(() => {
    return isSecondStepProgressStarted
      ? wrappedProposalView.requiredValidatorsQuorum.gt(0)
        ? wrappedProposalView?.validatorProposal?.core?.votesFor
            .mul(100)
            .div(wrappedProposalView.requiredValidatorsQuorum)
            .toNumber()
        : 0
      : wrappedProposalView?.requiredQuorum.gt(0)
      ? wrappedProposalView?.proposal.core.votesFor
          .mul(100)
          .div(wrappedProposalView?.requiredQuorum)
          .toNumber()
      : 0
  }, [isSecondStepProgressStarted, wrappedProposalView])

  const moveProposalToValidators = useCallback(async () => {
    await _moveProposalToValidators(String(wrappedProposalView?.proposalId))
  }, [_moveProposalToValidators, wrappedProposalView])

  const execute = useCallback(async () => {
    await _execute(String(wrappedProposalView?.proposalId))
  }, [_execute, wrappedProposalView])

  const executeAndClaim = useCallback(async () => {
    await _executeAndClaim(String(wrappedProposalView?.proposalId))
  }, [_executeAndClaim, wrappedProposalView])

  const claimRewards = useCallback(async () => {
    await _claimRewards([String(wrappedProposalView?.proposalId)])
  }, [_claimRewards, wrappedProposalView])

  const loadDetailsFromIpfs = useCallback(async () => {
    try {
      if (isInsurance) {
        const entity = new IpfsEntity<InsuranceAccident>({
          path: wrappedProposalView?.proposal.descriptionURL,
        })

        const response = await entity.load()

        setInsuranceProposalView(response)
        setName("Insurance accident")
        setDescription(response.form.description)
      } else {
        const entity = new IpfsEntity<{
          proposalName: string
          proposalDescription: string
        }>({
          path: wrappedProposalView?.proposal.descriptionURL,
        })

        const response = await entity.load()

        setName(response.proposalName)
        setDescription(response.proposalDescription)
      }
    } catch (error) {}
  }, [wrappedProposalView, isInsurance])

  const loadProposalTotalVotes = useCallback(async () => {
    if (!account) return

    try {
      const amounts = await _getCurrentAccountTotalVotes(
        wrappedProposalView?.proposalId
      )
      setMyVotesAmount(amounts?.[1])
    } catch (error) {
      console.error({ error })
    }
  }, [_getCurrentAccountTotalVotes, account, wrappedProposalView])

  const loadRewardsIfExist = useCallback(async () => {}, [])

  const init = useCallback(async () => {
    try {
      await loadDetailsFromIpfs()
      await loadProposalTotalVotes()
    } catch (error) {}
  }, [loadDetailsFromIpfs, loadProposalTotalVotes, isInsurance])

  useEffect(() => {
    init()
  }, [init, wrappedProposalView])

  return {
    wrappedProposalView,

    govPoolAddress,
    creator,
    votedAddresses,
    name,
    description,
    executors,
    proposalSettings,
    requiredQuorum,
    distributionProposalTokenAddress,
    distributionProposalTokenAmount,
    distributionProposalToken,
    rewardTokenAddress,
    rewardToken,
    coreSettings,
    isProposalStateVoting,
    isProposalStateWaitingForVotingTransfer,
    isProposalStateValidatorVoting,
    isProposalStateDefeated,
    isProposalStateSucceeded,
    isProposalStateExecuted,
    proposalType,
    voteEnd,
    isSecondStepProgressStarted,
    currentVotesVoted,
    votesTotalNeed,
    votesFor,
    myVotesAmount,
    executed,
    isInsurance,
    isDistribution,
    moveProposalToValidators,
    execute,
    executeAndClaim,
    claimRewards,
    govPoolDescriptionURL,
    progress,
    insuranceProposalView,
  }
}
