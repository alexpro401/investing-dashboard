import { useCallback, useState, useEffect } from "react"
import { BigNumber } from "@ethersproject/bignumber"

import { useGovUserKeeperContract, useGovPoolContract } from "contracts"
import { useERC20 } from "./useERC20"
import useError from "hooks/useError"
import usePayload from "./usePayload"
import { useTransactionAdder } from "state/transactions/hooks"
import { SubmitState } from "constants/types"
import { TransactionType } from "state/transactions/types"
import { isTxMined, parseTransactionError } from "utils"

const useDAODeposit = (daoPoolAddress: string) => {
  const [userKeeperAddress, setUserKeeperAddress] = useState<string>("")
  const [tokenAddress, setTokenAddress] = useState<string>("")

  const [fromToken] = useERC20(tokenAddress)
  const govPoolContract = useGovPoolContract(daoPoolAddress)
  const userKeeperContract = useGovUserKeeperContract(userKeeperAddress)
  const addTransaction = useTransactionAdder()
  const [, setPayload] = usePayload()
  const [, setError] = useError()

  const updateUserKeeperContract = useCallback(async () => {
    try {
      if (!govPoolContract) return

      const _userKeeperAddress = await govPoolContract.govUserKeeper()
      setUserKeeperAddress(_userKeeperAddress)
    } catch (error) {
      console.log("updateUserKeeperContract error: ", error)
    }
  }, [govPoolContract])

  const updateTokenAddress = useCallback(async () => {
    try {
      if (!userKeeperContract) return

      const _tokenAddress = await userKeeperContract.tokenAddress()
      setTokenAddress(_tokenAddress)
    } catch (error) {
      console.log("updateTokenAddress error: ", error)
    }
  }, [userKeeperContract])

  useEffect(() => {
    updateUserKeeperContract()
  }, [updateUserKeeperContract])

  useEffect(() => {
    updateTokenAddress()
  }, [updateTokenAddress])

  const daoDeposit = useCallback(
    async (account: string, amount: BigNumber) => {
      try {
        if (!account || !govPoolContract || !userKeeperContract || !fromToken)
          return

        setPayload(SubmitState.SIGN)

        await fromToken.approve(userKeeperAddress, amount)

        const transactionResponse = await govPoolContract.deposit(
          account,
          amount,
          []
        )

        console.log(transactionResponse)

        setPayload(SubmitState.WAIT_CONFIRM)
        const receipt = await addTransaction(transactionResponse, {
          type: TransactionType.GOV_POOL_CREATE,
        })

        if (isTxMined(receipt)) {
          setPayload(SubmitState.SUCCESS)
        }
      } catch (error: any) {
        console.log("daoDeposit error: ", error)
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
      userKeeperAddress,
      addTransaction,
      setError,
      setPayload,
    ]
  )

  return daoDeposit
}

export default useDAODeposit
