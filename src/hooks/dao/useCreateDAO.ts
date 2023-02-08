import { useWeb3React } from "@web3-react/core"
import { useCallback, useContext, useMemo } from "react"
import { parseEther, parseUnits } from "@ethersproject/units"

import { usePoolFactoryContract } from "contracts"
import useGasTracker from "state/gas/hooks"
import { useTransactionAdder } from "state/transactions/hooks"
import { TransactionType } from "state/transactions/types"
import { isTxMined, parseTransactionError } from "utils"
import usePayload from "hooks/usePayload"
import { SubmitState } from "consts/types"
import useError from "hooks/useError"
import { GovPoolFormContext } from "context/govPool/GovPoolFormContext"
import { cloneDeep } from "lodash"
import { IpfsEntity } from "utils/ipfsEntity"
import { BigNumber, BytesLike, ethers } from "ethers"

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
    tokenCreation,
    isTokenCreation,
  } = useContext(GovPoolFormContext)

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
    async (poolParams, tokenParams) => {
      try {
        const gas = await factory?.estimateGas.deployGovPoolWithTokenSale(
          poolParams,
          tokenParams,
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

    const additionalData = new IpfsEntity({
      data: JSON.stringify({
        avatarUrl: avatarUrl.get,
        daoName: daoName.get,
        websiteUrl: websiteUrl.get,
        description: description.get,
        socialLinks: socialLinks.get,
        documents: documents.get,
      }),
    })

    await additionalData.uploadSelf()

    if (!additionalData._path) {
      // TODO: handle case when ipfs upload failed
      return
    }

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
              18 // TODO: 18 or 25?
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

    const tokenSaleSettings = {
      ...cloneDeep(defaultSettings),
      executorDescription: "tokenSale",
    }

    const POOL_PARAMETERS = {
      nftMultiplierAddress: ZERO_ADDR,
      name: daoName.get,
      settingsParams: {
        proposalSettings: [
          defaultSettings,
          internalSettings,
          DPSettings,
          validatorsSettings,
          tokenSaleSettings,
        ],
        additionalProposalExecutors: [ZERO_ADDR],
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
        tokenAddress: isTokenCreation
          ? ZERO_ADDR
          : userKeeperParams.tokenAddress.get || ZERO_ADDR,
        nftAddress: userKeeperParams.nftAddress.get || ZERO_ADDR,
        totalPowerInTokens: isErc721.get
          ? parseEther(String(userKeeperParams.totalPowerInTokens.get))
          : 0,
        nftsTotalSupply:
          isErc721.get && erc721.isEnumerable
            ? 0
            : userKeeperParams.nftsTotalSupply.get,
      },
      verifier: ZERO_ADDR,
      descriptionURL: additionalData._path,
    }

    const TOKEN_SALE_PARAMETERS = {
      tiersParams: [],
      whitelistParams: [],
      tokenParams: {
        name: tokenCreation.name.get || "",
        symbol: tokenCreation.symbol.get || "",
        users: isTokenCreation
          ? [account, ...tokenCreation.recipients.get.map((el) => el.address)]
          : [],
        saleAmount: "0",
        cap: isTokenCreation
          ? parseUnits(tokenCreation.totalSupply.get, 18)
          : "0",
        mintedTotal: isTokenCreation
          ? parseUnits(tokenCreation.initialDistribution.get, 18)
          : "0",
        amounts: isTokenCreation
          ? [
              parseUnits(
                BigNumber.from(tokenCreation.initialDistribution.get)
                  .sub(
                    tokenCreation.recipients.get.reduce((acc, curr) => {
                      return acc.add(BigNumber.from(curr.amount))
                    }, BigNumber.from(0))
                  )
                  .toString(),
                18
              ),
              ...tokenCreation.recipients.get.map((el) =>
                parseUnits(el.amount, 18)
              ),
            ]
          : [],
      },
    }

    const gasLimit = await tryEstimateGas(POOL_PARAMETERS, {
      ...{ ...cloneDeep(defaultSettings), executorDescription: "" },
    })

    try {
      const transactionResponse = await factory.deployGovPoolWithTokenSale(
        POOL_PARAMETERS,
        TOKEN_SALE_PARAMETERS,
        {
          ...transactionOptions,
          from: account,
          gasLimit,
        }
      )

      setPayload(SubmitState.WAIT_CONFIRM)
      const receipt = await addTransaction(transactionResponse, {
        type: TransactionType.GOV_POOL_CREATE,
      })

      if (isTxMined(receipt)) {
        const logs = receipt?.logs

        const eventSignature =
          "0x1c4fe3cb721cec58479040064cec69b10ec801c7ac5198dce8335e2f65c76dbf"

        const data = logs?.find((log) =>
          log.topics.includes(eventSignature)
        )?.data

        if (!data) throw new Error("data not found")

        const abiCoder = new ethers.utils.AbiCoder()
        const govPoolAddress = abiCoder.decode(
          [
            "string",
            "address",
            "address",
            "address",
            "address",
            "address",
            "address",
          ],
          data as BytesLike
        )[1]

        createdDaoAddress.set(govPoolAddress)
        setPayload(SubmitState.SUCCESS)
      }
    } catch (error: any) {
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
    factory,
    account,
    setPayload,
    avatarUrl.get,
    daoName.get,
    websiteUrl.get,
    description.get,
    socialLinks.get,
    documents.get,
    defaultProposalSettingForm,
    isValidator.get,
    isCustomVoting.get,
    internalProposalForm,
    isDistributionProposal.get,
    distributionProposalSettingsForm,
    validatorsParams,
    userKeeperParams,
    isErc721.get,
    erc721.isEnumerable,
    tryEstimateGas,
    transactionOptions,
    addTransaction,
    createdDaoAddress,
    setError,
  ])

  return createPool
}

export default useCreateDAO
