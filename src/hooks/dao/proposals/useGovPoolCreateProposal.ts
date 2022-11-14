import { useActiveWeb3React } from "hooks"
import { useCallback, useEffect, useMemo } from "react"
import { useGovPool } from "hooks/dao/useGovPool"
import usePayload from "hooks/usePayload"
import useError from "hooks/useError"
import useGasTracker from "state/gas/hooks"
import { useTransactionAdder } from "state/transactions/hooks"
import { parseUnits } from "@ethersproject/units"
import { SubmitState } from "constants/types"
import { TransactionType } from "state/transactions/types"
import { getERC20Contract, isTxMined, parseTransactionError } from "utils"
import { ERC20 } from "interfaces/typechain"
import {
  useDistributionProposalContract,
  useGovSettingsContract,
  useGovUserKeeperContract,
  useGovValidatorsContract,
} from "contracts"

export const useGovPoolCreateProposal = (
  daoPoolAddress: string | undefined
) => {
  const { account, library } = useActiveWeb3React()

  const {
    govPoolContract,

    settingsAddress,
    userKeeperAddress,
    validatorsAddress,
    distributionProposalAddress,

    init,
  } = useGovPool(daoPoolAddress)

  const govValidatorsContract = useGovValidatorsContract(daoPoolAddress)
  const govUserKeeperContract = useGovUserKeeperContract(daoPoolAddress)
  const govSettingsContract = useGovSettingsContract(daoPoolAddress)
  const distributionProposalContract = useDistributionProposalContract(
    distributionProposalAddress
  )

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

  const tryEstimateGas = useCallback(
    async (
      descriptionURL: string,
      executors: string[],
      values: number[],
      data: string[]
    ) => {
      try {
        const gas = await govPoolContract!.estimateGas.createProposal(
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
    },
    [transactionOptions, govPoolContract]
  )

  const createProposal = useCallback(
    async (
      descriptionURL: string,
      executors: string[],
      values: number[],
      data: string[]
    ) => {
      if (!govPoolContract) return

      try {
        const gasLimit = await tryEstimateGas(
          descriptionURL,
          executors,
          values,
          data
        )

        const txResult = await govPoolContract.createProposal(
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
    },
    [
      addTransaction,
      govPoolContract,
      setError,
      setPayload,
      transactionOptions,
      tryEstimateGas,
    ]
  )

  // creating proposals

  const createNewDaoProposalType = useCallback(async () => {
    if (!govPoolContract) return

    await createProposal(
      "",
      [daoPoolAddress as string],
      [0],
      [
        (
          await govPoolContract.populateTransaction.editDescriptionURL("")
        )?.data as string,
      ]
    )
  }, [createProposal, daoPoolAddress, govPoolContract])

  const createInternalValidatorProposal = useCallback(async () => {
    if (!govPoolContract) return

    await createProposal(
      "",
      [daoPoolAddress as string],
      [0],
      [
        (
          await govPoolContract.populateTransaction.editDescriptionURL("")
        )?.data as string,
      ]
    )
  }, [createProposal, daoPoolAddress, govPoolContract])

  // can be called only on dexe dao pool
  const createInsuranceProposal = useCallback(async () => {
    if (!govPoolContract) return

    await createProposal(
      "",
      [daoPoolAddress as string],
      [0],
      [
        (
          await govPoolContract.populateTransaction.editDescriptionURL("")
        )?.data as string,
      ]
    )
  }, [createProposal, daoPoolAddress, govPoolContract])

  const createInternalProposal = useCallback(async () => {
    if (!govPoolContract) return

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
  }, [createProposal, daoPoolAddress, govPoolContract])

  const createDistributionProposal = useCallback(async () => {
    if (!govPoolContract || !distributionProposalContract) return
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

      const latestProposalId = await govPoolContract.latestProposalId()

      const erc20Token = getERC20Contract(
        "0x6De41c91D028c963f374850D76A93B102F65aE50",
        library,
        account
      ) as ERC20

      const descriptionURL = "additionalData._path"
      const executors = [
        "0x6De41c91D028c963f374850D76A93B102F65aE50",
        distributionProposalAddress,
      ]
      const values = [0, 0]
      const data = [
        (
          await erc20Token?.populateTransaction.transfer(
            distributionProposalAddress,
            parseUnits(
              "5", // will be from input
              18
            ).toString()
          )
        )?.data as string,
        (
          await distributionProposalContract.populateTransaction.execute(
            latestProposalId!.add(1).toString(),
            "0x6De41c91D028c963f374850D76A93B102F65aE50",
            0
          )
        )?.data as string,
      ]

      await createProposal(descriptionURL, executors, values, data)
    } catch (error) {}
  }, [
    account,
    createProposal,
    daoPoolAddress,
    distributionProposalContract,
    distributionProposalAddress,
    govPoolContract,
    library,
  ])

  const createValidatorProposal = useCallback(async () => {
    if (!govValidatorsContract) return

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
      const executors = [validatorsAddress]
      const values = [0]
      const data = [
        (
          await govValidatorsContract.populateTransaction.changeBalances(
            [
              parseUnits(
                "0.0001", // will be from input
                18
              ).toString(),
            ],
            ["0xC87B0398F86276D3D590A14AB53fF57185899C42"]
          )
        )?.data as string,
      ]

      if (!data[0]) return

      await createProposal(descriptionURL, executors, values, data)
    } catch (error) {}
  }, [createProposal, daoPoolAddress, validatorsAddress, govValidatorsContract])

  const createCustomProposal = useCallback(async () => {
    if (!govPoolContract) return

    await createProposal(
      "",
      [daoPoolAddress as string],
      [0],
      [
        (
          await govPoolContract.populateTransaction.editDescriptionURL("")
        )?.data as string,
      ]
    )
  }, [createProposal, daoPoolAddress, govPoolContract])

  return {
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
