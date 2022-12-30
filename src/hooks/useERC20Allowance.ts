import useError from "hooks/useError"
import { parseTransactionError } from "utils/index"
import { TransactionType } from "state/transactions/types"
import { useTransactionAdder } from "state/transactions/hooks"
import { SubmitState } from "consts/types"
import usePayload from "hooks/usePayload"
import { approve, isAddress, isTxMined } from "utils"
import { ZERO } from "consts"
import { BigNumber } from "@ethersproject/bignumber"
import { useMultipleContractSingleData } from "state/multicall/hooks"
import { useCallback, useMemo } from "react"
import { ERC20 } from "abi"
import { Interface } from "@ethersproject/abi"
import { useActiveWeb3React } from "hooks"

const ERC20_INTERFACE = new Interface(ERC20)

export const useERC20Allowance = (tokens: string[], spender?: string) => {
  const { account, library } = useActiveWeb3React()
  const [, setPayload] = usePayload()
  const [, setError] = useError()
  const addTransaction = useTransactionAdder()

  const filteredTokens = useMemo(
    () => tokens.filter((token) => isAddress(token)),
    [tokens]
  )

  const callResults = useMultipleContractSingleData(
    useMemo(() => filteredTokens, [filteredTokens]),
    ERC20_INTERFACE,
    "allowance",
    useMemo(
      () => [account || undefined, spender || undefined],
      [account, spender]
    )
  )

  const anyLoading: boolean = useMemo(
    () => callResults.some((callState) => callState.loading),
    [callResults]
  )

  const handleError = useCallback(
    (error) => {
      setPayload(SubmitState.IDLE)

      const errorMessage = parseTransactionError(error)
      !!errorMessage && setError(errorMessage)
    },
    [setError, setPayload]
  )

  const updateAllowance = useCallback(
    async (token: string, amount: BigNumber) => {
      if (!spender || !account || !library) return

      try {
        setPayload(SubmitState.SIGN)

        const approveResponse = await approve(
          token,
          library,
          account,
          spender,
          amount
        )
        setPayload(SubmitState.WAIT_CONFIRM)

        const receipt = await addTransaction(approveResponse, {
          type: TransactionType.APPROVAL,
          tokenAddress: token,
          spender: account,
        })

        if (isTxMined(receipt)) {
          //   fetchAndUpdateAllowance()
        }
      } catch (e) {
        handleError(e)
      } finally {
        setPayload(SubmitState.IDLE)
      }
    },
    [account, addTransaction, handleError, library, setPayload, spender]
  )

  const allowances: { [tokenAddress: string]: BigNumber } = useMemo(() => {
    if (account && tokens.length > 0) {
      return tokens.reduce((memo, token, i) => {
        const value = callResults?.[i]?.result?.[0]

        if (!token) return memo

        if (value) {
          try {
            memo[token] = value
          } catch {
            memo[token] = ZERO
          }
        } else {
          memo[token] = ZERO
        }

        return memo
      }, {})
    }

    return {}
  }, [account, tokens, callResults])

  return { allowances, anyLoading, updateAllowance }
}

export default useERC20Allowance
