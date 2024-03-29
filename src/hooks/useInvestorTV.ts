import { useCallback, useEffect, useState } from "react"
import { isEmpty, isNil } from "lodash"

import { TraderPool } from "abi"
import useError from "./useError"
import { ZERO } from "consts"
import { useActiveWeb3React } from "hooks"
import { parseTransactionError } from "utils"
import { getContract } from "utils/getContract"
import {
  addBignumbers,
  divideBignumbers,
  multiplyBignumbers,
} from "utils/formulas"
import { BigNumber } from "@ethersproject/bignumber"

export function useInvestorTV(
  address?: string | null,
  pools?: { id: string }[]
): [{ usd: BigNumber }, { loading: boolean }] {
  const { library } = useActiveWeb3React()
  const [, setError] = useError()

  const [loading, setLoading] = useState(true)
  const [usd, setUsd] = useState(ZERO)

  const calculateTV = useCallback(
    async (address, pools) => {
      let result = ZERO

      for (const pool of pools) {
        const poolContract = await getContract(
          pool.id,
          TraderPool,
          library,
          address
        )

        const poolInfo = await poolContract.getPoolInfo()
        const poolPriceUSD = divideBignumbers(
          [poolInfo.totalPoolUSD, 18],
          [poolInfo.lpSupply, 18]
        )

        const balanceLP = await poolContract.balanceOf(address)

        const balanceUSD = multiplyBignumbers(
          [poolPriceUSD, 18],
          [balanceLP, 18]
        )

        result = addBignumbers([result, 18], [balanceUSD, 18])
      }

      return result
    },
    [library]
  )

  useEffect(() => {
    if (isNil(library) || isNil(address) || !loading) {
      return
    }

    if (isEmpty(pools)) {
      setLoading(false)
      return
    }

    ;(async () => {
      try {
        const amount = await calculateTV(address, pools)
        setUsd(amount)
        setLoading(false)
      } catch (error: any) {
        if (!!error && !!error.data && !!error.data.message) {
          setError(error.data.message)
        } else {
          const errorMessage = parseTransactionError(error.toString())
          !!errorMessage && setError(errorMessage)
        }
      }
    })()
  }, [pools, library, address])

  // Clear state when address or pools changed
  useEffect(() => {
    setLoading(true)
    setUsd(ZERO)
  }, [address, pools])

  return [{ usd }, { loading }]
}

export default useInvestorTV
