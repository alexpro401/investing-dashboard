import { useCallback, useEffect, useMemo, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { ZERO_ADDR } from "constants/index"
import { useGovUserKeeperContract } from "contracts"

import {
  OptionalMethodInputs,
  useSingleContractMultipleData,
} from "state/multicall/hooks"

type methods = "tokenBalance" | "nftBalance" | "nftExactBalance"

interface Param {
  voter: string
  isMicroPool: boolean
  useDelegated: boolean
}

interface MulticallProps {
  daoPoolAddress?: string
  params: Param[]
  method: methods
}

export const useGovBalanceMulticall = <T>({
  daoPoolAddress,
  params,
  method,
}: MulticallProps) => {
  const userKeeper = useGovUserKeeperContract(daoPoolAddress)

  const validatedParams = useMemo(
    () =>
      params.map((param) => [
        param.voter!,
        param.isMicroPool || false,
        param.useDelegated || false,
      ]),
    [params]
  ) as unknown as OptionalMethodInputs[]

  const callResults = useSingleContractMultipleData(
    userKeeper,
    method,
    validatedParams
  )

  const anyLoading: boolean = useMemo(
    () => callResults.some((callState) => callState.loading),
    [callResults]
  )

  return useMemo(
    () => [
      !!params.length && !!validatedParams.length
        ? validatedParams.map((param, i) => {
            try {
              return callResults[i].result || undefined
            } catch {
              return undefined
            }
          })
        : [],
      anyLoading,
    ],
    [params.length, validatedParams, anyLoading, callResults]
  ) as [(T | undefined)[], boolean]
}

interface Props {
  daoPoolAddress?: string
  isMicroPool?: boolean
  useDelegated?: boolean
  method: methods
}

const useGovBalance = <T>({
  daoPoolAddress,
  isMicroPool = false,
  useDelegated = false,
  method,
}: Props): T | undefined => {
  const { account } = useWeb3React()
  const [balance, setBalance] = useState<any>()
  const userKeeper = useGovUserKeeperContract(daoPoolAddress)

  const getGovTokenBalance = useCallback(async () => {
    try {
      const _balance = await userKeeper![method](
        account!,
        isMicroPool,
        useDelegated
      )
      setBalance(_balance)
    } catch (error) {
      console.log("getGovTokenBalance error: ", error)
    }
  }, [account, isMicroPool, method, useDelegated, userKeeper])

  useEffect(() => {
    const isEmpty = daoPoolAddress === ZERO_ADDR

    if (!userKeeper || !account || isEmpty) return

    getGovTokenBalance()
  }, [account, daoPoolAddress, getGovTokenBalance, userKeeper])

  return balance
}

export default useGovBalance
