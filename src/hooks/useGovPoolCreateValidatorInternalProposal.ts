import { useCallback, useMemo, useContext } from "react"
import { parseUnits } from "@ethersproject/units"
import { BigNumberish } from "@ethersproject/bignumber"
import { useNavigate } from "react-router-dom"

import { useGovValidatorsContract } from "contracts"
import useError from "hooks/useError"
import usePayload from "./usePayload"
import useGasTracker from "state/gas/hooks"
import { SubmitState } from "constants/types"
import { isTxMined, parseTransactionError } from "utils"
import { useTransactionAdder } from "state/transactions/hooks"
import { TransactionType } from "state/transactions/types"
import { DaoProposalCreatingContext } from "context/DaoProposalCreatingContext"
import { useActiveWeb3React } from "hooks"

interface IProps {
  daoAddress: string
}

const useGovPoolCreateValidatorInternalProposal = ({ daoAddress }: IProps) => {
  const navigate = useNavigate()
  const { account } = useActiveWeb3React()
  const govValidatorsContract = useGovValidatorsContract(daoAddress)

  const [, setPayload] = usePayload()
  const [, setError] = useError()
  const [gasTrackerResponse] = useGasTracker()
  const addTransaction = useTransactionAdder()
  const { setSuccessModalState, closeSuccessModalState } = useContext(
    DaoProposalCreatingContext
  )

  const transactionOptions = useMemo(() => {
    if (!gasTrackerResponse) return

    return {
      gasPrice: parseUnits(gasTrackerResponse.ProposeGasPrice, "gwei"),
    }
  }, [gasTrackerResponse])

  const tryEstimateGas = useCallback(
    async (proposalType: number, values: BigNumberish[], users: string[]) => {
      if (!govValidatorsContract) return

      try {
        const gas =
          await govValidatorsContract?.estimateGas.createInternalProposal(
            proposalType,
            values,
            users,
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
    [govValidatorsContract, transactionOptions]
  )

  const createFunction = useCallback(
    async ({
      internalProposalType,
      values,
      users,
      proposalName,
      proposalDescription,
    }: {
      internalProposalType: number
      values: BigNumberish[]
      users: string[]
      proposalName: string
      proposalDescription: string
    }) => {
      if (!govValidatorsContract || !account) return

      try {
        setPayload(SubmitState.SIGN)

        const gasLimit = await tryEstimateGas(
          internalProposalType,
          values,
          users
        )

        //TODO handle proposal name and proposal description
        const resultTransaction =
          await govValidatorsContract.createInternalProposal(
            internalProposalType,
            values,
            users,
            { ...transactionOptions, gasLimit, from: account }
          )

        setPayload(SubmitState.WAIT_CONFIRM)

        const receipt = await addTransaction(resultTransaction, {
          type: TransactionType.GOV_POOL_CREATE_INTERNAL_PROPOSAL,
        })

        if (isTxMined(receipt)) {
          setPayload(SubmitState.SUCCESS)
          setSuccessModalState({
            opened: true,
            title: "Success",
            text: "Congrats! You just successfully created a proposal and voted for it. Follow the proposal’s status at All proposals.",
            image: "",
            buttonText: "Validator proposals",
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
      govValidatorsContract,
      setPayload,
      setError,
      transactionOptions,
      tryEstimateGas,
      navigate,
      addTransaction,
      closeSuccessModalState,
      setSuccessModalState,
      account,
    ]
  )

  return createFunction
}

export default useGovPoolCreateValidatorInternalProposal
