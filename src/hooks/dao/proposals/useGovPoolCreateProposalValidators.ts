import { useCallback, useMemo, useContext } from "react"
import { parseUnits } from "@ethersproject/units"
import { useNavigate } from "react-router-dom"

import { useGovPoolContract } from "contracts"
import { useGovValidatorsContractAddress } from "../useGovValidatorsContractAddress"
import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"
import { addDaoProposalData } from "utils/ipfs"
import { encodeAbiMethod } from "utils/encodeAbi"
import { GovValidators } from "abi"
import useGasTracker from "state/gas/hooks"
import useError from "hooks/useError"
import usePayload from "hooks/usePayload"
import { useTransactionAdder } from "state/transactions/hooks"
import { SubmitState } from "constants/types"
import { isTxMined, parseTransactionError } from "utils"
import { TransactionType } from "state/transactions/types"

interface ICreateProposalArgs {
  proposalName: string
  proposalDescription: string
  users: string[]
  balances: string[]
}

const useGovPoolCreateProposalValidators = (govPoolAddress: string) => {
  const navigate = useNavigate()
  const govPoolContract = useGovPoolContract(govPoolAddress)
  const govValidatorsAddress = useGovValidatorsContractAddress(govPoolAddress)

  const [, setPayload] = usePayload()
  const [, setError] = useError()
  const addTransaction = useTransactionAdder()
  const [gasTrackerResponse] = useGasTracker()
  const { setSuccessModalState, closeSuccessModalState } = useContext(
    GovProposalCreatingContext
  )

  const transactionOptions = useMemo(() => {
    if (!gasTrackerResponse) return

    return {
      gasPrice: parseUnits(gasTrackerResponse.ProposeGasPrice, "gwei"),
    }
  }, [gasTrackerResponse])

  const tryEstimateGas = useCallback(
    async (
      daoProposalTypeIPFSCode: string,
      encodedChangeBalancesMethod: any
    ) => {
      try {
        const gas = await govPoolContract?.estimateGas.createProposal(
          daoProposalTypeIPFSCode,
          [govValidatorsAddress],
          [0],
          [encodedChangeBalancesMethod],
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
    [govPoolContract, transactionOptions, govValidatorsAddress]
  )

  const createProposal = useCallback(
    async (args: ICreateProposalArgs) => {
      if (!govPoolContract || !govValidatorsAddress) return

      const { proposalName, proposalDescription, users, balances } = args

      try {
        setPayload(SubmitState.SIGN)

        let { path: daoProposalIPFSCode } = await addDaoProposalData({
          proposalName,
          proposalDescription,
        })
        daoProposalIPFSCode = "ipfs://" + daoProposalIPFSCode

        const encodedChangeBalancesMethod = encodeAbiMethod(
          GovValidators,
          "changeBalances",
          [balances, users]
        )

        const gasLimit = await tryEstimateGas(
          daoProposalIPFSCode,
          encodedChangeBalancesMethod
        )

        const resultTransaction = await govPoolContract.createProposal(
          daoProposalIPFSCode,
          [govValidatorsAddress],
          [0],
          [encodedChangeBalancesMethod],
          { ...transactionOptions, gasLimit }
        )

        setPayload(SubmitState.WAIT_CONFIRM)

        const receipt = await addTransaction(resultTransaction, {
          type: TransactionType.GOV_POOL_CREATE_PROPOSAL,
        })

        if (isTxMined(receipt)) {
          setPayload(SubmitState.SUCCESS)
          setSuccessModalState({
            opened: true,
            title: "Success",
            text: "Congrats! You just successfully created a proposal and voted for it. Follow the proposal’s status at All proposals.",
            image: "",
            buttonText: "Proposals",
            onClick: () => {
              //TODO redirect to real validators proposals list
              navigate("/")
              closeSuccessModalState()
            },
          })
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
    },
    [
      govPoolContract,
      govValidatorsAddress,
      transactionOptions,
      tryEstimateGas,
      setError,
      setPayload,
      addTransaction,
      closeSuccessModalState,
      navigate,
      setSuccessModalState,
    ]
  )

  return createProposal
}

export default useGovPoolCreateProposalValidators
