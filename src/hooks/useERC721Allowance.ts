import { useERC721Contract } from "contracts"
import useError from "hooks/useError"
import { parseTransactionError } from "utils"
import { TransactionType } from "state/transactions/types"
import { useTransactionAdder } from "state/transactions/hooks"
import { SubmitState } from "consts/types"
import usePayload from "hooks/usePayload"
import { isTxMined } from "utils"
import { ZERO_ADDR } from "consts"
import { BigNumberish } from "@ethersproject/bignumber"
import { useSingleContractMultipleData } from "state/multicall/hooks"
import { useCallback, useMemo } from "react"
import { useActiveWeb3React } from "hooks"

export const useERC721Allowance = (
  collectionAddress: string,
  tokenIds: number[],
  spender?: string
) => {
  const { account } = useActiveWeb3React()
  const [, setPayload] = usePayload()
  const [, setError] = useError()
  const addTransaction = useTransactionAdder()
  const erc721 = useERC721Contract(collectionAddress)

  const validatedTokenIdsMap = useMemo(
    () => tokenIds.map((id) => [id]),
    [tokenIds]
  )

  const callResults = useSingleContractMultipleData(
    erc721,
    "getApproved",
    validatedTokenIdsMap
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
    async (tokenId: BigNumberish) => {
      if (!spender || !account || !erc721) return

      try {
        setPayload(SubmitState.SIGN)

        const approveResponse = await erc721.approve(spender, tokenId)
        setPayload(SubmitState.WAIT_CONFIRM)

        const receipt = await addTransaction(approveResponse, {
          type: TransactionType.APPROVAL,
          tokenAddress: collectionAddress,
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
    [
      account,
      addTransaction,
      handleError,
      setPayload,
      spender,
      erc721,
      collectionAddress,
    ]
  )

  const allowances: { [tokenId: number]: string } = useMemo(() => {
    if (account && tokenIds.length > 0) {
      return tokenIds.reduce((memo, id, i) => {
        if (isNaN(id)) return memo

        try {
          const address = callResults[i].result || undefined
          memo[id] = address?.toLocaleString() || ZERO_ADDR
          return memo
        } catch {
          memo[id] = ZERO_ADDR
        }

        return memo
      }, {})
    }

    return {}
  }, [account, tokenIds, callResults])

  return { allowances, anyLoading, updateAllowance }
}

export default useERC721Allowance
