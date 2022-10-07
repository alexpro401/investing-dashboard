import { useWeb3React } from "@web3-react/core"
import { useCallback, useMemo } from "react"
import { parseEther, parseUnits } from "@ethersproject/units"

import { usePoolFactoryContract } from "contracts"
import useGasTracker from "state/gas/hooks"
import { useTransactionAdder } from "state/transactions/hooks"
import { TransactionType } from "state/transactions/types"
import { isTxMined, parseTransactionError } from "utils"
import usePayload from "./usePayload"
import { SubmitState } from "constants/types"
import useError from "hooks/useError"

const useCreateDAO = () => {
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
    if (!factory) return

    setPayload(SubmitState.SIGN)

    const OWNER = account
    const ZERO = "0x0000000000000000000000000000000000000000"
    const POOL_PARAMETERS = {
      settingsParams: {
        internalProposalSettings: {
          earlyCompletion: true,
          delegatedVotingAllowed: true,
          validatorsVote: false,
          duration: 500,
          durationValidators: 600,
          quorum: parseUnits("51", 25),
          quorumValidators: parseUnits("61", 25),
          minVotesForVoting: parseEther("10"),
          minVotesForCreating: parseEther("5"),
          rewardToken: ZERO,
          creationReward: 0,
          executionReward: 0,
          voteRewardsCoefficient: 0,
          executorDescription: "internal",
        },
        distributionProposalSettings: {
          earlyCompletion: false,
          delegatedVotingAllowed: false,
          validatorsVote: false,
          duration: 500,
          durationValidators: 600,
          quorum: parseUnits("51", 25),
          quorumValidators: parseUnits("61", 25),
          minVotesForVoting: parseEther("10"),
          minVotesForCreating: parseEther("5"),
          rewardToken: ZERO,
          creationReward: 0,
          executionReward: 0,
          voteRewardsCoefficient: 0,
          executorDescription: "DP",
        },
        validatorsBalancesSettings: {
          earlyCompletion: true,
          delegatedVotingAllowed: false,
          validatorsVote: true,
          duration: 500,
          durationValidators: 600,
          quorum: parseUnits("51", 25),
          quorumValidators: parseUnits("61", 25),
          minVotesForVoting: parseEther("10"),
          minVotesForCreating: parseEther("5"),
          rewardToken: ZERO,
          creationReward: 0,
          executionReward: 0,
          voteRewardsCoefficient: 0,
          executorDescription: "validators",
        },
        defaultProposalSettings: {
          earlyCompletion: false,
          delegatedVotingAllowed: true,
          validatorsVote: true,
          duration: 700,
          durationValidators: 800,
          quorum: parseUnits("71", 25),
          quorumValidators: parseUnits("100", 25),
          minVotesForVoting: parseEther("20"),
          minVotesForCreating: parseEther("5"),
          rewardToken: ZERO,
          creationReward: 0,
          executionReward: 0,
          voteRewardsCoefficient: 0,
          executorDescription: "default",
        },
      },
      validatorsParams: {
        name: "Validator Token",
        symbol: "VT",
        duration: 500,
        quorum: parseUnits("51", 25),
        validators: [OWNER],
        balances: [parseEther("100")],
      },
      userKeeperParams: {
        tokenAddress: "0x8a9424745056eb399fd19a0ec26a14316684e274",
        nftAddress: ZERO,
        totalPowerInTokens: parseEther("33000"),
        nftsTotalSupply: 33,
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
