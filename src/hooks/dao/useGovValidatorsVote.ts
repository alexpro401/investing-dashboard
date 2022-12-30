import { SubmitState } from "consts/types"
import { BigNumberish } from "@ethersproject/bignumber"
import { useCallback } from "react"
import { useGovValidatorsContract } from "contracts"
import { useTransactionAdder } from "state/transactions/hooks"
import usePayload from "hooks/usePayload"
import useError from "hooks/useError"
import { TransactionType } from "state/transactions/types"
import { isTxMined, parseTransactionError } from "utils"

const useGovValidatorsVote = (daoPoolAddress?: string) => {
  const govValidators = useGovValidatorsContract(daoPoolAddress)
  const addTransaction = useTransactionAdder()
  const [, setPayload] = usePayload()
  const [, setError] = useError()

  const vote = useCallback(
    async (
      proposalId: BigNumberish,
      voteAmount: BigNumberish,
      isInternal: boolean
    ) => {
      if (!govValidators) return
      setPayload(SubmitState.SIGN)

      try {
        setPayload(SubmitState.WAIT_CONFIRM)
        const transactionResponse = await govValidators.vote(
          proposalId,
          voteAmount,
          isInternal
        )

        const receipt = await addTransaction(transactionResponse, {
          type: TransactionType.GOV_POOL_VOTE,
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
      } finally {
        setPayload(SubmitState.IDLE)
      }
    },
    [addTransaction, govValidators, setError, setPayload]
  )

  return { vote }
}

export default useGovValidatorsVote
