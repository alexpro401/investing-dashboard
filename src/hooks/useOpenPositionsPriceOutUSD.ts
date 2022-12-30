import { useQuery } from "urql"
import { isEmpty, isNil } from "lodash"
import { useEffect, useMemo, useState } from "react"
import { BigNumber } from "@ethersproject/bignumber"

import useError from "hooks/useError"
import { ZERO } from "consts"
import { PositionsByIdsQuery } from "queries"
import { addBignumbers } from "utils/formulas"
import { usePriceFeedContract } from "contracts"

/**
 * Hook get pool positions, fetch positions tokens and prices of locked tokens in USD
 * @param poolAddress address of pool
 * @param positionAmountsMap amounts of open positions
 * @param positions addresses of open positions
 */
export const useOpenPositionsPriceOutUSD = (
  poolAddress?: string,
  positionAmountsMap?: any,
  positions?: string[]
) => {
  const [, setError] = useError()
  const priceFeed = usePriceFeedContract()

  const [outUSDVolume, setOutUSD] = useState<BigNumber>(ZERO)

  const pause = useMemo(
    () => isNil(positions) || isEmpty(positions) || isNil(poolAddress),
    [positions, poolAddress]
  )

  const variables = useMemo(
    () => ({
      idList: positions
        ? positions.map((pId) => `${poolAddress}${pId}${0}`.toLowerCase())
        : [],
    }),
    [positions, poolAddress]
  )

  const [{ fetching, data, error }] = useQuery({
    query: PositionsByIdsQuery,
    variables,
    pause,
  })

  // Clear state to prevent memory leak
  useEffect(() => {
    return () => {
      setOutUSD(ZERO)
    }
  }, [])
  useEffect(() => {
    setOutUSD(ZERO)
  }, [poolAddress, positionAmountsMap, positions])

  // Fetch prices of positions locked amounts in USD
  useEffect(() => {
    if (
      fetching ||
      !priceFeed ||
      !positionAmountsMap ||
      !data ||
      !data.positions
    ) {
      return
    }

    ;(async () => {
      try {
        for (const { id, positionToken } of data.positions.values()) {
          const amount = positionAmountsMap.get(id)
          const price = await priceFeed.getNormalizedPriceOutUSD(
            positionToken,
            amount
          )

          if (price && price.amountOut) {
            setOutUSD((prev) =>
              addBignumbers([prev, 18], [price.amountOut, 18])
            )
          }
        }
      } catch (error) {
        //TODO: handle error
        console.error(error)
      }
    })()
  }, [data, fetching, priceFeed, positionAmountsMap])

  // Clear error state
  useEffect(() => {
    return () => setError("")
  }, [setError])

  // Set error
  useEffect(() => {
    if (!fetching && !!positions && error && error.message) {
      setError(error.message)
    }
  }, [fetching, positions, error, setError])

  return outUSDVolume
}

export default useOpenPositionsPriceOutUSD
