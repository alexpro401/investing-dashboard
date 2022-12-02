import {
  useDistributionProposalContract,
  useGovPoolContract,
  useGovSettingsContract,
  useGovUserKeeperContract,
  useGovValidatorsContract,
} from "contracts"
import { useGovPoolHelperContracts } from "./useGovPoolHelperContracts"
import { useCallback, useMemo } from "react"
import usePayload from "hooks/usePayload"
import useError from "hooks/useError"
import useGasTracker from "state/gas/hooks"
import { useTransactionAdder } from "state/transactions/hooks"
import { parseUnits } from "@ethersproject/units"
import { useActiveWeb3React } from "hooks"
import { SubmitState } from "constants/types"
import { TransactionType } from "state/transactions/types"
import { isTxMined, parseTransactionError } from "utils"
import { get } from "lodash"

export const useGovPool = (address?: string) => {
  const { account } = useActiveWeb3React()

  const govPoolContract = useGovPoolContract(address)

  const {
    govSettingsAddress: settingsAddress,
    govUserKeeperAddress: userKeeperAddress,
    govValidatorsAddress: validatorsAddress,
    govDistributionProposalAddress: distributionProposalAddress,
  } = useGovPoolHelperContracts(address)

  const govValidatorsContract = useGovValidatorsContract(address)
  const govUserKeeperContract = useGovUserKeeperContract(address)
  const govSettingsContract = useGovSettingsContract(address)
  const distributionProposalContract = useDistributionProposalContract(address)

  const [, setPayload] = usePayload()
  const [, setError] = useError()
  const [gasTrackerResponse] = useGasTracker()
  const addTransaction = useTransactionAdder()

  const transactionOptions = useMemo(() => {
    if (!gasTrackerResponse) return

    return {
      gasPrice: parseUnits(gasTrackerResponse.ProposeGasPrice, "gwei"),
    }
  }, [gasTrackerResponse])

  const tryEstimateGas = useCallback(
    async (contractMethod: string, ...params) => {
      if (!govPoolContract) return

      try {
        const gas = await govPoolContract.estimateGas?.[contractMethod](
          ...params,
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
    [transactionOptions, govPoolContract]
  )

  const moveProposalToValidators = useCallback(
    async (proposalId: string) => {
      try {
        if (!govPoolContract || !account) return

        const gasLimit = await tryEstimateGas(
          "moveProposalToValidators",
          proposalId
        )

        const txResult = await govPoolContract?.moveProposalToValidators(
          proposalId,
          { ...transactionOptions, gasLimit, from: account }
        )

        setPayload(SubmitState.WAIT_CONFIRM)

        const receipt = await addTransaction(txResult, {
          type: TransactionType.GOV_POOL_MOVE_TO_VALIDATORS,
        })

        if (isTxMined(receipt)) {
          setPayload(SubmitState.SUCCESS)
        }

        return receipt
      } catch (error) {
        setPayload(SubmitState.IDLE)

        if (!!error && !!get(error, "data") && !!get(error, "data.message")) {
          setError(get(error, "data.message", ""))
        } else {
          const errorMessage = parseTransactionError(String(error))
          !!errorMessage && setError(errorMessage)
        }
        return undefined
      }
    },
    [
      account,
      addTransaction,
      govPoolContract,
      setError,
      setPayload,
      transactionOptions,
      tryEstimateGas,
    ]
  )

  const execute = useCallback(
    async (proposalId: string) => {
      try {
        if (!govPoolContract || !account) return

        const gasLimit = await tryEstimateGas("execute", proposalId)

        const txResult = await govPoolContract?.execute(proposalId, {
          ...transactionOptions,
          gasLimit,
          from: account,
        })

        setPayload(SubmitState.WAIT_CONFIRM)

        const receipt = await addTransaction(txResult, {
          type: TransactionType.GOV_POOL_MOVE_TO_VALIDATORS,
        })

        if (isTxMined(receipt)) {
          setPayload(SubmitState.SUCCESS)
        }

        return receipt
      } catch (error) {
        setPayload(SubmitState.IDLE)

        if (!!error && !!get(error, "data") && !!get(error, "data.message")) {
          setError(get(error, "data.message", ""))
        } else {
          const errorMessage = parseTransactionError(String(error))
          !!errorMessage && setError(errorMessage)
        }
        return undefined
      }
    },
    [
      account,
      addTransaction,
      govPoolContract,
      setError,
      setPayload,
      transactionOptions,
      tryEstimateGas,
    ]
  )

  const executeAndClaim = useCallback(
    async (proposalId: string) => {
      try {
        if (!govPoolContract || !account) return

        const gasLimit = await tryEstimateGas("executeAndClaim", proposalId)

        const txResult = await govPoolContract?.executeAndClaim(proposalId, {
          ...transactionOptions,
          gasLimit,
          from: account,
        })

        setPayload(SubmitState.WAIT_CONFIRM)

        const receipt = await addTransaction(txResult, {
          type: TransactionType.GOV_POOL_MOVE_TO_VALIDATORS,
        })

        if (isTxMined(receipt)) {
          setPayload(SubmitState.SUCCESS)
        }

        return receipt
      } catch (error) {
        setPayload(SubmitState.IDLE)

        if (!!error && !!get(error, "data") && !!get(error, "data.message")) {
          setError(get(error, "data.message", ""))
        } else {
          const errorMessage = parseTransactionError(String(error))
          !!errorMessage && setError(errorMessage)
        }
        return undefined
      }
    },
    [
      account,
      addTransaction,
      govPoolContract,
      setError,
      setPayload,
      transactionOptions,
      tryEstimateGas,
    ]
  )

  const claimRewards = useCallback(
    async (proposalIds: string[]) => {
      try {
        if (!govPoolContract || !account) return

        const gasLimit = await tryEstimateGas("claimRewards", proposalIds)

        const txResult = await govPoolContract?.claimRewards(proposalIds, {
          ...transactionOptions,
          gasLimit,
          from: account,
        })

        setPayload(SubmitState.WAIT_CONFIRM)

        const receipt = await addTransaction(txResult, {
          type: TransactionType.GOV_POOL_MOVE_TO_VALIDATORS,
        })

        if (isTxMined(receipt)) {
          setPayload(SubmitState.SUCCESS)
        }

        return receipt
      } catch (error) {
        setPayload(SubmitState.IDLE)

        if (!!error && !!get(error, "data") && !!get(error, "data.message")) {
          setError(get(error, "data.message", ""))
        } else {
          const errorMessage = parseTransactionError(String(error))
          !!errorMessage && setError(errorMessage)
        }
        return undefined
      }
    },
    [
      account,
      addTransaction,
      govPoolContract,
      setError,
      setPayload,
      transactionOptions,
      tryEstimateGas,
    ]
  )

  return {
    govPoolContract,

    settingsAddress,
    userKeeperAddress,
    validatorsAddress,
    distributionProposalAddress,

    govValidatorsContract,
    govUserKeeperContract,
    govSettingsContract,
    distributionProposalContract,

    moveProposalToValidators,
    execute,
    executeAndClaim,
    claimRewards,
  }
}
