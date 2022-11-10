import { useActiveWeb3React } from "hooks"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useGovPool } from "hooks/dao/useGovPool"
import usePayload from "hooks/usePayload"
import useError from "hooks/useError"
import useGasTracker from "state/gas/hooks"
import { useTransactionAdder } from "state/transactions/hooks"
import { parseUnits } from "@ethersproject/units"
import { SubmitState } from "constants/types"
import { TransactionType } from "state/transactions/types"
import { isTxMined, parseTransactionError } from "utils"

export const useGovPoolCreateProposal = (
  daoPoolAddress: string | undefined
) => {
  const [_descriptionURL, _setDescriptionURL] = useState<string>("")
  const [_executors, _setExecutors] = useState<string[]>([])
  const [_values, _setValues] = useState<number[]>([])
  const [_data, _setData] = useState<string[]>([])

  const navigate = useNavigate()
  const { account } = useActiveWeb3React()

  const {
    govPoolContract,

    init,
  } = useGovPool(daoPoolAddress)

  useEffect(() => {
    init()
  }, [daoPoolAddress, init])

  /* handle sending transactions */
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

  const tryEstimateGas = async (
    descriptionURL: string,
    executors: string[],
    values: number[],
    data: string[]
  ) => {
    try {
      const gas = await govPoolContract?.estimateGas.createProposal(
        descriptionURL,
        executors,
        values,
        data,
        transactionOptions
      )

      if (!gas?._isBigNumber) {
        return
      }

      return gas
    } catch {
      return
    }
  }

  const createProposal = async (
    descriptionURL: string,
    executors: string[],
    values: number[],
    data: string[]
  ) => {
    try {
      const gasLimit = await tryEstimateGas(
        descriptionURL,
        executors,
        values,
        data
      )

      const txResult = await govPoolContract?.createProposal(
        descriptionURL,
        executors,
        values,
        data,
        { ...transactionOptions, gasLimit }
      )

      setPayload(SubmitState.WAIT_CONFIRM)

      const receipt = await addTransaction(txResult, {
        type: TransactionType.GOV_POOL_CREATE_INTERNAL_PROPOSAL,
        title: "Some Proposal Name",
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
  }

  // creating proposals

  const createNewDaoProposalType = async () => {
    await createProposal(
      "",
      [daoPoolAddress as string],
      [0],
      [
        (
          await govPoolContract?.populateTransaction.editDescriptionURL("")
        )?.data as string,
      ]
    )
  }

  const createInternalValidatorProposal = async () => {
    await createProposal(
      "",
      [daoPoolAddress as string],
      [0],
      [
        (
          await govPoolContract?.populateTransaction.editDescriptionURL("")
        )?.data as string,
      ]
    )
  }

  const createInsuranceProposal = async () => {
    await createProposal(
      "",
      [daoPoolAddress as string],
      [0],
      [
        (
          await govPoolContract?.populateTransaction.editDescriptionURL("")
        )?.data as string,
      ]
    )
  }

  const createInternalProposal = async () => {
    if (!daoPoolAddress) throw new Error("GovPool is not defined")

    try {
      // const additionalData = new IpfsEntity(
      //   JSON.stringify({
      //     name: "",
      //     description: "",
      //   })
      // )
      //
      // await additionalData.uploadSelf()

      // if (!additionalData._path) throw new Error("uploaded data has no path")

      const descriptionURL = "additionalData._path"
      const executors = [daoPoolAddress]
      const values = [0]
      const data = [
        (await govPoolContract?.populateTransaction.editDescriptionURL(""))
          ?.data as string,
      ]

      await createProposal(descriptionURL, executors, values, data)
    } catch (error) {}
  }

  const createDistributionProposal = async () => {
    await createProposal(
      "",
      [daoPoolAddress as string],
      [0],
      [
        (
          await govPoolContract?.populateTransaction.editDescriptionURL("")
        )?.data as string,
      ]
    )
  }

  const createValidatorProposal = async () => {
    await createProposal(
      "",
      [daoPoolAddress as string],
      [0],
      [
        (
          await govPoolContract?.populateTransaction.editDescriptionURL("")
        )?.data as string,
      ]
    )
  }

  const createCustomProposal = async () => {
    await createProposal(
      "",
      [daoPoolAddress as string],
      [0],
      [
        (
          await govPoolContract?.populateTransaction.editDescriptionURL("")
        )?.data as string,
      ]
    )
  }

  return {
    descriptionURL: { get: _descriptionURL, set: _setDescriptionURL },
    executors: { get: _executors, set: _setExecutors },
    values: { get: _values, set: _setValues },
    data: { get: _data, set: _setData },

    createProposal,
    createNewDaoProposalType,
    createInternalValidatorProposal,
    createInsuranceProposal,
    createInternalProposal,
    createDistributionProposal,
    createValidatorProposal,
    createCustomProposal,
  }
}
