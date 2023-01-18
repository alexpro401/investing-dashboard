import { SubmitState } from "consts/types"
import { BigNumberish } from "@ethersproject/bignumber"
import { useCallback } from "react"
import { useGovPoolContract } from "contracts"
import { useTransactionAdder } from "state/transactions/hooks"
import usePayload from "hooks/usePayload"
import useError from "hooks/useError"
import { TransactionType } from "state/transactions/types"
import { isTxMined, parseTransactionError } from "utils"
import { encodeAbiMethod } from "utils/encodeAbi"
import { GovPool } from "abi"

const useGovPoolVote = (daoPoolAddress?: string) => {
  const govPool = useGovPoolContract(daoPoolAddress)
  const addTransaction = useTransactionAdder()
  const [, setPayload] = usePayload()
  const [, setError] = useError()

  const vote = useCallback(
    async (
      account: string,
      proposalId: BigNumberish,
      depositAmount: BigNumberish,
      depositNfts: BigNumberish[],
      voteAmount: BigNumberish,
      voteNftIds: BigNumberish[]
    ) => {
      if (!govPool) return
      setPayload(SubmitState.SIGN)

      try {
        setPayload(SubmitState.WAIT_CONFIRM)
        const deposit = encodeAbiMethod(GovPool, "deposit", [
          account,
          depositAmount,
          depositNfts,
        ])

        const vote = encodeAbiMethod(GovPool, "vote", [
          proposalId,
          voteAmount,
          voteNftIds,
        ])

        const transactionResponse = await govPool.multicall([deposit, vote])

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
    [addTransaction, govPool, setError, setPayload]
  )

  const voteDelegated = useCallback(
    async (
      proposalId: BigNumberish,
      voteAmount: BigNumberish,
      voteNftIds: BigNumberish[]
    ) => {
      if (!govPool) return
      setPayload(SubmitState.SIGN)

      try {
        setPayload(SubmitState.WAIT_CONFIRM)
        const transactionResponse = await govPool.voteDelegated(
          proposalId,
          voteAmount,
          voteNftIds
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
        throw new Error(error)
      } finally {
        setPayload(SubmitState.IDLE)
      }
    },
    [addTransaction, govPool, setError, setPayload]
  )

  return { vote, voteDelegated }
}

export default useGovPoolVote
