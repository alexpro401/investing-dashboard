import { useCallback } from "react"
import { BigNumber } from "@ethersproject/bignumber"

import { useGovUserKeeperContract, useGovPoolContract } from "contracts"
import useError from "hooks/useError"
import usePayload from "../usePayload"
import { useTransactionAdder } from "state/transactions/hooks"
import { SubmitState } from "consts/types"
import { TransactionType } from "state/transactions/types"
import { isTxMined, parseTransactionError } from "utils"

const useGovPoolDeposit = (daoPoolAddress: string) => {
  const govPoolContract = useGovPoolContract(daoPoolAddress)
  const userKeeperContract = useGovUserKeeperContract(daoPoolAddress)

  const addTransaction = useTransactionAdder()
  const [, setPayload] = usePayload()
  const [, setError] = useError()

  const daoDeposit = useCallback(
    async (receiver: string, amount: BigNumber, nftIds: number[]) => {
      try {
        if (!receiver || !govPoolContract || !userKeeperContract) return

        setPayload(SubmitState.SIGN)

        const transactionResponse = await govPoolContract.deposit(
          receiver,
          amount,
          nftIds
        )

        setPayload(SubmitState.WAIT_CONFIRM)
        const receipt = await addTransaction(transactionResponse, {
          type: TransactionType.GOV_POOL_DEPOSIT,
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
    [govPoolContract, userKeeperContract, addTransaction, setError, setPayload]
  )

  return daoDeposit
}

export default useGovPoolDeposit
