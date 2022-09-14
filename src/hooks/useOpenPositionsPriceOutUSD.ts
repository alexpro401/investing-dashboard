import { useQuery } from "urql"
import { useEffect, useState } from "react"
import { BigNumber } from "@ethersproject/bignumber"

import useError from "hooks/useError"
import { PositionsByIdsQuery } from "queries"
import { addBignumbers } from "utils/formulas"
import { usePriceFeedContract } from "hooks/useContract"

/**
 * Hook get pool positions, fetch positions tokens and prices of locked tokens in USD
 * @param poolAddress address of pool
 * @param positionAmountsMap amounts of open positions
 * @param positions addresses of open positions
 */
const useOpenPositionsPriceOutUSD = (
  poolAddress?: string,
  positionAmountsMap?: any,
  positions?: string[]
) => {
  const [, setError] = useError()
  const priceFeed = usePriceFeedContract()

  const [outUSDVolume, setOutUSD] = useState<BigNumber>(BigNumber.from(0))

  const [{ fetching: loading, data, error }] = useQuery({
    query: PositionsByIdsQuery,
    variables: {
      idList: positions
        ? positions.map((pId) => `${poolAddress}${pId}${0}`.toLowerCase())
        : [],
    },
  })

  // Clear state to prevent memory leak
  useEffect(() => {
    return () => {
      setOutUSD(BigNumber.from(0))
    }
  }, [poolAddress])

  // Fetch prices of positions locked amounts in USD
  useEffect(() => {
    if (loading || !priceFeed || !positionAmountsMap) {
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
  }, [data, loading, priceFeed, positionAmountsMap])

  // Clear error state
  useEffect(() => {
    return () => setError("")
  }, [setError])

  // Set error
  useEffect(() => {
    if (!loading && !!positions && error && error.message) {
      setError(error.message)
    }
  }, [loading, positions, error, setError])

  return outUSDVolume
}

export default useOpenPositionsPriceOutUSD
