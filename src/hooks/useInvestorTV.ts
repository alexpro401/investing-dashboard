import { useEffect, useState } from "react"
import { isEmpty, isNil } from "lodash"

import { TraderPool } from "abi"
import useError from "./useError"
import { ZERO } from "constants/index"
import { useActiveWeb3React } from "hooks"
import { parseTransactionError } from "utils"
import { getContract } from "utils/getContract"
import {
  addBignumbers,
  divideBignumbers,
  multiplyBignumbers,
} from "utils/formulas"

function useInvestorTV(address?: string | null, pools?: { id: string }[]) {
  const { library } = useActiveWeb3React()
  const [, setError] = useError()

  const [loading, setLoading] = useState(true)
  const [usd, setUsd] = useState(ZERO)

  useEffect(() => {
    if (isNil(pools) || isEmpty(pools) || isNil(library) || isNil(address)) {
      return
    }

    ;(async () => {
      try {
        const last = pools.at(-1)

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

          setUsd((prev) => addBignumbers([prev, 18], [balanceUSD, 18]))

          if (!isNil(last) && pool.id === last.id) {
            setLoading(false)
          }
        }
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
