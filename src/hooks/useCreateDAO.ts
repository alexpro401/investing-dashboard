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
import { IPoolFactory } from "../interfaces/typechain/PoolFactory"

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
      quorum: parseUnits(
        String(defaultProposalSettingForm.quorum.get),
        25
      ).toString(),
      quorumValidators: isValidator.get
        ? parseUnits(
            String(defaultProposalSettingForm.quorumValidators.get),
            25
          ).toString()
        : parseUnits(
            String(defaultProposalSettingForm.quorum.get),
            25
          ).toString(),
      minVotesForVoting: parseEther(
        String(defaultProposalSettingForm.minVotesForVoting.get)
      ).toString(),
      minVotesForCreating: parseEther(
        String(defaultProposalSettingForm.minVotesForCreating.get)
      ).toString(),
      rewardToken: defaultProposalSettingForm.rewardToken.get || ZERO_ADDR,
      creationReward: parseUnits(
        String(defaultProposalSettingForm.creationReward.get),
        18
      ).toString(),
      executionReward: parseUnits(
        String(defaultProposalSettingForm.executionReward.get),
        18
      ).toString(),
      voteRewardsCoefficient: parseUnits(
        String(defaultProposalSettingForm.voteRewardsCoefficient.get),
        18
      ).toString(),
      executorDescription: "default",
    }

    const internalSettings = {
      ...(isCustomVoting.get
        ? {
            earlyCompletion: internalProposalForm.earlyCompletion.get,
            delegatedVotingAllowed:
              internalProposalForm.delegatedVotingAllowed.get,
            validatorsVote: internalProposalForm.validatorsVote.get,
            duration: internalProposalForm.duration.get,
            durationValidators: isValidator.get
              ? internalProposalForm.durationValidators.get
              : internalProposalForm.duration.get,
            quorum: parseUnits(
              String(internalProposalForm.quorum.get),
              25
            ).toString(),
            quorumValidators: isValidator.get
              ? parseUnits(
                  String(internalProposalForm.quorumValidators.get),
                  25
                ).toString()
              : parseUnits(
                  String(internalProposalForm.quorum.get),
                  25
                ).toString(),
            minVotesForVoting: parseEther(
              String(internalProposalForm.minVotesForVoting.get)
            ).toString(),
            minVotesForCreating: parseEther(
              String(internalProposalForm.minVotesForCreating.get)
            ).toString(),
            rewardToken: internalProposalForm.rewardToken.get || ZERO_ADDR,
            creationReward: parseUnits(
              String(internalProposalForm.creationReward.get),
              18
            ).toString(),
            executionReward: parseUnits(
              String(internalProposalForm.executionReward.get),
              18
            ).toString(),
            voteRewardsCoefficient: parseUnits(
              String(internalProposalForm.voteRewardsCoefficient.get),
              18
            ).toString(),
            executorDescription: "internal",
          }
        : { ...cloneDeep(defaultSettings), executorDescription: "internal" }),
    }

    const DPSettings = {
      ...(isDistributionProposal.get
        ? {
            earlyCompletion:
              distributionProposalSettingsForm.earlyCompletion.get,
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
            ).toString(),
            quorumValidators: isValidator.get
              ? parseUnits(
                  String(distributionProposalSettingsForm.quorumValidators.get),
                  25
                ).toString()
              : parseUnits(
                  String(distributionProposalSettingsForm.quorum.get),
                  25
                ).toString(),
            minVotesForVoting: parseEther(
              String(distributionProposalSettingsForm.minVotesForVoting.get)
            ).toString(),
            minVotesForCreating: parseEther(
              String(distributionProposalSettingsForm.minVotesForCreating.get)
            ).toString(),
            rewardToken:
              distributionProposalSettingsForm.rewardToken.get || ZERO_ADDR,
            creationReward: parseUnits(
              String(distributionProposalSettingsForm.creationReward.get),
              18
            ).toString(),
            executionReward: parseUnits(
              String(distributionProposalSettingsForm.executionReward.get),
              18
            ).toString(),
            voteRewardsCoefficient: parseUnits(
              String(
                distributionProposalSettingsForm.voteRewardsCoefficient.get
              ),
              18
            ).toString(),
          }
        : {
            ...cloneDeep(defaultSettings),
            delegatedVotingAllowed: false,
            earlyCompletion: false,
            executorDescription: "DP",
          }),
    }

    const validatorsSettings = {
      ...cloneDeep(defaultSettings),
      executorDescription: "validators",
    }

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
        name: isValidator.get ? validatorsParams.name.get : "Validator Token",
        symbol: isValidator.get ? validatorsParams.symbol.get : "VT",
        duration: isValidator.get
          ? validatorsParams.duration.get
          : defaultSettings.duration,
        quorum: isValidator.get
          ? parseUnits(String(validatorsParams.quorum.get), 25).toString()
          : defaultSettings.quorum,
        validators: isValidator.get ? validatorsParams.validators.get : [],
        balances: isValidator.get
          ? validatorsParams.balances.get?.map((el) =>
              parseEther(String(el)).toString()
            )
          : [],
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

    console.log(POOL_PARAMETERS)

    const gasLimit = await tryEstimateGas(POOL_PARAMETERS)

    try {
      const transactionResponse = await factory.deployGovPool(
        POOL_PARAMETERS as unknown as IPoolFactory.GovPoolDeployParamsStruct,
        {
          ...transactionOptions,
          gasLimit,
        }
      )

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
    } finally {
      setPayload(SubmitState.IDLE)
    }
  }, [
    account,
    addTransaction,
    defaultProposalSettingForm.creationReward.get,
    defaultProposalSettingForm.delegatedVotingAllowed.get,
    defaultProposalSettingForm.duration.get,
    defaultProposalSettingForm.durationValidators.get,
    defaultProposalSettingForm.earlyCompletion.get,
    defaultProposalSettingForm.executionReward.get,
    defaultProposalSettingForm.minVotesForCreating.get,
    defaultProposalSettingForm.minVotesForVoting.get,
    defaultProposalSettingForm.quorum.get,
    defaultProposalSettingForm.quorumValidators.get,
    defaultProposalSettingForm.rewardToken.get,
    defaultProposalSettingForm.validatorsVote.get,
    defaultProposalSettingForm.voteRewardsCoefficient.get,
    distributionProposalSettingsForm.creationReward.get,
    distributionProposalSettingsForm.delegatedVotingAllowed.get,
    distributionProposalSettingsForm.duration.get,
    distributionProposalSettingsForm.durationValidators.get,
    distributionProposalSettingsForm.earlyCompletion.get,
    distributionProposalSettingsForm.executionReward.get,
    distributionProposalSettingsForm.minVotesForCreating.get,
    distributionProposalSettingsForm.minVotesForVoting.get,
    distributionProposalSettingsForm.quorum.get,
    distributionProposalSettingsForm.quorumValidators.get,
    distributionProposalSettingsForm.rewardToken.get,
    distributionProposalSettingsForm.validatorsVote.get,
    distributionProposalSettingsForm.voteRewardsCoefficient.get,
    factory,
    internalProposalForm.creationReward.get,
    internalProposalForm.delegatedVotingAllowed.get,
    internalProposalForm.duration.get,
    internalProposalForm.durationValidators.get,
    internalProposalForm.earlyCompletion.get,
    internalProposalForm.executionReward.get,
    internalProposalForm.minVotesForCreating.get,
    internalProposalForm.minVotesForVoting.get,
    internalProposalForm.quorum.get,
    internalProposalForm.quorumValidators.get,
    internalProposalForm.rewardToken.get,
    internalProposalForm.validatorsVote.get,
    internalProposalForm.voteRewardsCoefficient.get,
    isDistributionProposal.get,
    isErc721.get,
    isErc721Enumerable.get,
    isValidator.get,
    setError,
    setPayload,
    transactionOptions,
    tryEstimateGas,
    userKeeperParams.nftAddress.get,
    userKeeperParams.nftsTotalSupply.get,
    userKeeperParams.tokenAddress.get,
    userKeeperParams.totalPowerInTokens.get,
    validatorsParams.balances.get,
    validatorsParams.duration.get,
    validatorsParams.name.get,
    validatorsParams.quorum.get,
    validatorsParams.symbol.get,
    validatorsParams.validators.get,
  ])

  return createPool
}

export default useCreateDAO
