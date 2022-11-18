import { useGovPoolVotingAssets } from "hooks/dao"
import { useCallback } from "react"
import { BigNumber } from "@ethersproject/bignumber"

import { useGovUserKeeperContract, useGovPoolContract } from "contracts"
import { useERC20 } from "../useERC20"
import useError from "hooks/useError"
import usePayload from "../usePayload"
import { useTransactionAdder } from "state/transactions/hooks"
import { SubmitState } from "constants/types"
import { TransactionType } from "state/transactions/types"
import { isTxMined, parseTransactionError } from "utils"
import { useGovPoolHelperContracts } from "."

const useGovPoolDeposit = (daoPoolAddress: string) => {
  const [{ tokenAddress }] = useGovPoolVotingAssets(daoPoolAddress)
  const [fromToken] = useERC20(tokenAddress)
  const govPoolContract = useGovPoolContract(daoPoolAddress)
  const userKeeperContract = useGovUserKeeperContract(daoPoolAddress)
  const { govUserKeeperAddress } = useGovPoolHelperContracts(daoPoolAddress)

  const addTransaction = useTransactionAdder()
  const [, setPayload] = usePayload()
  const [, setError] = useError()

  const daoDeposit = useCallback(
    async (account: string, amount: BigNumber, nftIds: number[]) => {
      try {
        if (!account || !govPoolContract || !userKeeperContract || !fromToken)
          return

        setPayload(SubmitState.SIGN)

        await fromToken.approve(govUserKeeperAddress, amount)

        const transactionResponse = await govPoolContract.deposit(
          account,
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
    [
      govPoolContract,
      userKeeperContract,
      fromToken,
      govUserKeeperAddress,
      addTransaction,
      setError,
      setPayload,
    ]
  )

  return daoDeposit
}

export default useGovPoolDeposit
