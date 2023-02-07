import { SubmitState } from "consts/types"
import { BigNumber, BigNumberish } from "@ethersproject/bignumber"
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
      voteNftIds: BigNumberish[],
      delegateAmount: BigNumberish,
      delegateNftIds: BigNumberish[]
    ) => {
      if (!govPool) return
      setPayload(SubmitState.SIGN)

      try {
        setPayload(SubmitState.WAIT_CONFIRM)

        const params: string[] = []

        if (!BigNumber.from(depositAmount).isZero() || !!depositNfts.length) {
          params.push(
            encodeAbiMethod(GovPool, "deposit", [
              account,
              depositAmount,
              depositNfts,
            ])
          )
        }

        if (!BigNumber.from(voteAmount).isZero() || !!voteNftIds.length) {
          params.push(
            encodeAbiMethod(GovPool, "vote", [
              proposalId,
              voteAmount,
              voteNftIds,
            ])
          )
        }

        if (
          !BigNumber.from(delegateAmount).isZero() ||
          !!delegateNftIds.length
        ) {
          params.push(
            encodeAbiMethod(GovPool, "voteDelegated", [
              proposalId,
              delegateAmount,
              delegateNftIds,
            ])
          )
        }

        const transactionResponse = await govPool.multicall(params)

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

  // not used for now. but keep it for future use when only delegated vote is needed
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
