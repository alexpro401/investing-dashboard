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
import { IPoolFactory } from "interfaces/typechain/PoolFactory"
import { IpfsEntity } from "utils/ipfsEntity"
import { BytesLike, ethers } from "ethers"
import { ZERO_ADDR } from "constants/index"

const useCreateDAO = () => {
  const {
    isErc721,
    isCustomVoting,
    isDistributionProposal,
    isValidator,
    avatarUrl,
    daoName,
    websiteUrl,
    description,
    socialLinks,
    documents,
    erc721,
    userKeeperParams,
    validatorsParams,
    internalProposalForm,
    defaultProposalSettingForm,
    distributionProposalSettingsForm,
    createdDaoAddress,
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

    const additionalData = new IpfsEntity(
      JSON.stringify({
        avatarUrl: avatarUrl.get,
        daoName: daoName.get,
        websiteUrl: websiteUrl.get,
        description: description.get,
        socialLinks: socialLinks.get,
        documents: documents.get,
      })
    )

    await additionalData.uploadSelf()

    if (!additionalData._path) {
      // TODO: handle case when ipfs upload failed
      return
    }

    const defaultSettings = {
      earlyCompletion: defaultProposalSettingForm.earlyCompletion.get,
      delegatedVotingAllowed:
        defaultProposalSettingForm.delegatedVotingAllowed.get,
      validatorsVote: defaultProposalSettingForm.validatorsVote.get,
      duration: defaultProposalSettingForm.duration.get,
      durationValidators: isValidator.get
        ? defaultProposalSettingForm.durationValidators.get
        : defaultProposalSettingForm.duration.get,
      quorum: parseUnits(defaultProposalSettingForm.quorum.get, 25).toString(),
      quorumValidators: isValidator.get
        ? parseUnits(
            defaultProposalSettingForm.quorumValidators.get,
            25
          ).toString()
        : parseUnits(defaultProposalSettingForm.quorum.get, 25).toString(),
      minVotesForVoting: parseEther(
        defaultProposalSettingForm.minVotesForVoting.get
      ).toString(),
      minVotesForCreating: parseEther(
        defaultProposalSettingForm.minVotesForCreating.get
      ).toString(),
      rewardToken: defaultProposalSettingForm.rewardToken.get || ZERO_ADDR,
      creationReward: parseUnits(
        defaultProposalSettingForm.creationReward.get,
        18
      ).toString(),
      executionReward: parseUnits(
        defaultProposalSettingForm.executionReward.get,
        18
      ).toString(),
      voteRewardsCoefficient: parseUnits(
        defaultProposalSettingForm.voteRewardsCoefficient.get,
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
            quorum: parseUnits(internalProposalForm.quorum.get, 25).toString(),
            quorumValidators: isValidator.get
              ? parseUnits(
                  internalProposalForm.quorumValidators.get,
                  25
                ).toString()
              : parseUnits(internalProposalForm.quorum.get, 25).toString(),
            minVotesForVoting: parseEther(
              internalProposalForm.minVotesForVoting.get
            ).toString(),
            minVotesForCreating: parseEther(
              internalProposalForm.minVotesForCreating.get
            ).toString(),
            rewardToken: internalProposalForm.rewardToken.get || ZERO_ADDR,
            creationReward: parseUnits(
              internalProposalForm.creationReward.get,
              18
            ).toString(),
            executionReward: parseUnits(
              internalProposalForm.executionReward.get,
              18
            ).toString(),
            voteRewardsCoefficient: parseUnits(
              internalProposalForm.voteRewardsCoefficient.get,
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
              distributionProposalSettingsForm.quorum.get,
              25
            ).toString(),
            quorumValidators: isValidator.get
              ? parseUnits(
                  distributionProposalSettingsForm.quorumValidators.get,
                  25
                ).toString()
              : parseUnits(
                  distributionProposalSettingsForm.quorum.get,
                  25
                ).toString(),
            minVotesForVoting: parseEther(
              distributionProposalSettingsForm.minVotesForVoting.get
            ).toString(),
            minVotesForCreating: parseEther(
              distributionProposalSettingsForm.minVotesForCreating.get
            ).toString(),
            rewardToken:
              distributionProposalSettingsForm.rewardToken.get || ZERO_ADDR,
            creationReward: parseUnits(
              distributionProposalSettingsForm.creationReward.get,
              18
            ).toString(),
            executionReward: parseUnits(
              distributionProposalSettingsForm.executionReward.get,
              18
            ).toString(),
            voteRewardsCoefficient: parseUnits(
              distributionProposalSettingsForm.voteRewardsCoefficient.get,
              18
            ).toString(),
            executorDescription: "DP",
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
      name: daoName.get,
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
        nftsTotalSupply:
          isErc721.get && erc721.isEnumerable
            ? 0
            : userKeeperParams.nftsTotalSupply.get,
      },
      descriptionURL: additionalData._path,
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
        const data = receipt?.logs[receipt?.logs.length - 1].data
        const abiCoder = new ethers.utils.AbiCoder()
        const govPoolAddress = abiCoder.decode(
          ["address", "address", "address"],
          data as BytesLike
        )[0]

        createdDaoAddress.set(govPoolAddress)
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
      throw new Error(error)
    } finally {
      setPayload(SubmitState.IDLE)
    }
  }, [
    account,
    addTransaction,
    avatarUrl.get,
    daoName.get,
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
    description.get,
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
    documents.get,
    erc721.isEnumerable,
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
    isCustomVoting.get,
    isDistributionProposal.get,
    isErc721.get,
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
    websiteUrl.get,
  ])

  return createPool
}

export default useCreateDAO
