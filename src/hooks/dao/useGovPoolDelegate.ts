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

const useGovPoolDelegate = (daoPoolAddress?: string) => {
  const govPool = useGovPoolContract(daoPoolAddress)
  const addTransaction = useTransactionAdder()
  const [, setPayload] = usePayload()
  const [, setError] = useError()

  const delegate = useCallback(
    async (
      delegator: string,
      delegatee: string,
      depositTokens: BigNumberish,
      depositNfts: BigNumberish[],
      voteTokens: BigNumberish,
      voteNfts: BigNumberish[]
    ) => {
      if (!govPool) return
      setPayload(SubmitState.SIGN)

      try {
        setPayload(SubmitState.WAIT_CONFIRM)

        const params: string[] = []

        if (!BigNumber.from(depositTokens).isZero() || !!depositNfts.length) {
          params.push(
            encodeAbiMethod(GovPool, "deposit", [
              delegator,
              depositTokens,
              depositNfts,
            ])
          )
        }

        params.push(
          encodeAbiMethod(GovPool, "delegate", [
            delegatee,
            voteTokens,
            voteNfts,
          ])
        )

        const transactionResponse = await govPool.multicall(params)

        const receipt = await addTransaction(transactionResponse, {
          type: TransactionType.GOV_POOL_DELEGATE,
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

  const undelegate = useCallback(
    async (delegatee: string, tokens: BigNumberish, nfts: BigNumberish[]) => {
      if (!govPool) return
      setPayload(SubmitState.SIGN)

      try {
        setPayload(SubmitState.WAIT_CONFIRM)
        const transactionResponse = await govPool.undelegate(
          delegatee,
          tokens,
          nfts
        )

        const receipt = await addTransaction(transactionResponse, {
          type: TransactionType.GOV_POOL_UNDELEGATE,
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

  return { delegate, undelegate }
}

export default useGovPoolDelegate
