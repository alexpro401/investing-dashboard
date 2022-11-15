import { useCallback, useState, useEffect } from "react"
import { isNil } from "lodash"

import useError from "hooks/useError"
import { ZERO } from "constants/index"
import { parseTransactionError } from "utils"
import { useGovPoolContract } from "contracts"
import { BigNumber } from "@ethersproject/bignumber"

interface WithdrawableAssets {
  tokens: BigNumber
  nfts: any[]
}

const useGovPoolWithdrawableAssets = (
  govPoolAddress?: string,
  from?: string,
  to?: string
): [WithdrawableAssets, (from?: string, to?: string) => void] => {
  const [, setError] = useError()
  const govPoolContract = useGovPoolContract(govPoolAddress)

  const [tokens, setTokens] = useState(ZERO)
  const [nfts, setNfts] = useState<any[]>([])

  const _throwTxError = useCallback((error) => {
    if (!!error && !!error.data && !!error.data.message) {
      setError(error.data.message)
    } else {
      const errorMessage = parseTransactionError(error.toString())
      !!errorMessage && setError(errorMessage)
    }
  }, [])

  const updateWithdrawableAssets = useCallback(
    async (_from?: string, _to?: string) => {
      if (!govPoolContract || !from || !to) return
      try {
        const assets = await govPoolContract.getWithdrawableAssets(
          _from ?? from,
          _to ?? to
        )
        if (!isNil(assets)) {
          setTokens(assets.tokens)
          setNfts(assets.nfts)
        }
      } catch (error: any) {
        _throwTxError(error)
      }
    },
    [govPoolContract, from, to]
  )

  useEffect(() => {
    if (!govPoolContract || !from || !to) return
    ;(async () => await updateWithdrawableAssets())()
  }, [govPoolContract, from, to])

  return [
    {
      tokens,
      nfts,
    },
    updateWithdrawableAssets,
  ]
}

export default useGovPoolWithdrawableAssets
