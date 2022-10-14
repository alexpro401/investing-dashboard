import { useWeb3React } from "@web3-react/core"
import { useCallback, useContext, useMemo } from "react"
import { parseEther, parseUnits } from "@ethersproject/units"

import { usePoolFactoryContract } from "contracts"
import useGasTracker from "state/gas/hooks"
import { useTransactionAdder } from "state/transactions/hooks"
import { TransactionType } from "state/transactions/types"
import { isTxMined, parseTransactionError } from "utils"
import usePayload from "./usePayload"
import { SubmitState } from "constants/types"
import useError from "hooks/useError"
import { FundDaoCreatingContext } from "context/FundDaoCreatingContext"
import { cloneDeep } from "lodash"

const useCreateDAO = () => {
  const {
    isErc20,
    isErc721,
    isCustomVoting,
    isDistributionProposal,
    isValidator,
    isErc721Enumerable,
    avatarUrl,
    daoName,
    websiteUrl,
    description,
    documents,
    userKeeperParams,
    validatorsParams,
    govPoolDeployParams,
    internalProposalForm,
    validatorsBalancesSettingsForm,
    defaultProposalSettingForm,
    distributionProposalSettingsForm,
  } = useContext(FundDaoCreatingContext)

  const factory = usePoolFactoryContract()
  const { account } = useWeb3React()

  const [gasTrackerResponse] = useGasTracker()
  const addTransaction = useTransactionAdder()
  const [, setPayload] = usePayload()
  const [, setError] = useError()

  const transactionOptions = useMemo(() => {
    if (!gasTrackerResponse) return

    return {
      gasPrice: parseUnits(gasTrackerResponse.ProposeGasPrice, "gwei"),
    }
  }, [gasTrackerResponse])

  const tryEstimateGas = useCallback(
    async (params) => {
      try {
        const gas = await factory?.estimateGas.deployGovPool(
          params,
          transactionOptions
        )

        if (!gas?._isBigNumber) {
          return
        }

        return gas
      } catch {
        return
      }
    },
    [factory, transactionOptions]
  )

  const createPool = useCallback(async () => {
    if (!factory || !account) return

    setPayload(SubmitState.SIGN)

    const ZERO_ADDR = "0x0000000000000000000000000000000000000000"

    const defaultSettings = {
      earlyCompletion: defaultProposalSettingForm.earlyCompletion.get,
      delegatedVotingAllowed:
        defaultProposalSettingForm.delegatedVotingAllowed.get,
      validatorsVote: defaultProposalSettingForm.validatorsVote.get,
      duration: defaultProposalSettingForm.duration.get,
      durationValidators: isValidator.get
        ? defaultProposalSettingForm.durationValidators.get
        : defaultProposalSettingForm.duration.get,
      quorum: parseUnits(String(defaultProposalSettingForm.quorum.get), 25),
      quorumValidators: isValidator.get
        ? parseUnits(
            String(defaultProposalSettingForm.quorumValidators.get),
            25
          )
        : parseUnits(String(defaultProposalSettingForm.quorum.get), 25),
      minVotesForVoting: parseEther(
        String(defaultProposalSettingForm.minVotesForVoting.get)
      ),
      minVotesForCreating: parseEther(
        String(defaultProposalSettingForm.minVotesForCreating.get)
      ),
      rewardToken: defaultProposalSettingForm.rewardToken.get || ZERO_ADDR,
      creationReward: parseUnits(
        String(defaultProposalSettingForm.creationReward.get),
        18
      ),
      executionReward: parseUnits(
        String(defaultProposalSettingForm.executionReward.get),
        18
      ),
      voteRewardsCoefficient: parseUnits(
        String(defaultProposalSettingForm.voteRewardsCoefficient.get),
        18
      ),
      executorDescription: "default",
    }

    const internalSettings = isValidator.get
      ? {
          earlyCompletion: internalProposalForm.earlyCompletion.get,
          delegatedVotingAllowed:
            internalProposalForm.delegatedVotingAllowed.get,
          validatorsVote: internalProposalForm.validatorsVote.get,
          duration: internalProposalForm.duration.get,
          durationValidators: isValidator.get
            ? internalProposalForm.durationValidators.get
            : internalProposalForm.duration.get,
          quorum: parseUnits(String(internalProposalForm.quorum.get), 25),
          quorumValidators: isValidator.get
            ? parseUnits(String(internalProposalForm.quorumValidators.get), 25)
            : parseUnits(String(internalProposalForm.quorum.get), 25),
          minVotesForVoting: parseEther(
            String(internalProposalForm.minVotesForVoting.get)
          ),
          minVotesForCreating: parseEther(
            String(internalProposalForm.minVotesForCreating.get)
          ),
          rewardToken: internalProposalForm.rewardToken.get || ZERO_ADDR,
          creationReward: parseUnits(
            String(internalProposalForm.creationReward.get),
            18
          ),
          executionReward: parseUnits(
            String(internalProposalForm.executionReward.get),
            18
          ),
          voteRewardsCoefficient: parseUnits(
            String(internalProposalForm.voteRewardsCoefficient.get),
            18
          ),
          executorDescription: "internal",
        }
      : cloneDeep(defaultSettings)

    const DPSettings = isDistributionProposal.get
      ? {
          earlyCompletion: distributionProposalSettingsForm.earlyCompletion.get,
          delegatedVotingAllowed:
            distributionProposalSettingsForm.delegatedVotingAllowed.get,
          validatorsVote: distributionProposalSettingsForm.validatorsVote.get,
          duration: distributionProposalSettingsForm.duration.get,
          durationValidators: isValidator.get
            ? distributionProposalSettingsForm.durationValidators.get
            : distributionProposalSettingsForm.duration.get,
          quorum: parseUnits(
            String(distributionProposalSettingsForm.quorum.get),
            25
          ),
          quorumValidators: isValidator.get
            ? parseUnits(
                String(distributionProposalSettingsForm.quorumValidators.get),
                25
              )
            : parseUnits(
                String(distributionProposalSettingsForm.quorum.get),
                25
              ),
          minVotesForVoting: parseEther(
            String(distributionProposalSettingsForm.minVotesForVoting.get)
          ),
          minVotesForCreating: parseEther(
            String(distributionProposalSettingsForm.minVotesForCreating.get)
          ),
          rewardToken:
            distributionProposalSettingsForm.rewardToken.get || ZERO_ADDR,
          creationReward: parseUnits(
            String(distributionProposalSettingsForm.creationReward.get),
            18
          ),
          executionReward: parseUnits(
            String(distributionProposalSettingsForm.executionReward.get),
            18
          ),
          voteRewardsCoefficient: parseUnits(
            String(distributionProposalSettingsForm.voteRewardsCoefficient.get),
            18
          ),
          executorDescription: "DP",
        }
      : cloneDeep(defaultSettings)

    const validatorsSettings = cloneDeep(defaultSettings)

    const POOL_PARAMETERS = {
      settingsParams: {
        proposalSettings: [
          defaultSettings,
          internalSettings,
          DPSettings,
          validatorsSettings,
        ],
        additionalProposalExecutors: [],
      },
      validatorsParams: {
        name: validatorsParams.name.get,
        symbol: validatorsParams.symbol.get,
        duration: validatorsParams.duration.get,
        quorum: parseUnits(String(validatorsParams.quorum.get), 25),
        validators: validatorsParams.validators.get,
        balances: validatorsParams.balances.get.map((el) =>
          parseEther(String(el))
        ),
      },
      userKeeperParams: {
        tokenAddress: userKeeperParams.tokenAddress.get || ZERO_ADDR,
        nftAddress: userKeeperParams.nftAddress.get || ZERO_ADDR,
        totalPowerInTokens: isErc721.get
          ? parseEther(String(userKeeperParams.totalPowerInTokens.get))
          : 0,
        nftsTotalSupply: isErc721Enumerable.get
          ? 0
          : userKeeperParams.nftsTotalSupply.get,
      },
      descriptionURL: "example.com",
    }

    const gasLimit = await tryEstimateGas(POOL_PARAMETERS)

    try {
      const transactionResponse = await factory.deployGovPool(POOL_PARAMETERS, {
        ...transactionOptions,
        gasLimit,
      })

      setPayload(SubmitState.WAIT_CONFIRM)
      const receipt = await addTransaction(transactionResponse, {
        type: TransactionType.GOV_POOL_CREATE,
      })

      if (isTxMined(receipt)) {
        setPayload(SubmitState.SUCCESS)
      }
    } catch (error: any) {
      console.log(error)
      setPayload(SubmitState.IDLE)
      if (!!error && !!error.data && !!error.data.message) {
        setError(error.data.message)
      } else {
        const errorMessage = parseTransactionError(error.toString())
        !!errorMessage && setError(errorMessage)
      }
    }
  }, [
    account,
    addTransaction,
    factory,
    setError,
    setPayload,
    transactionOptions,
    tryEstimateGas,
  ])

  return createPool
}

export default useCreateDAO
