import { useQuery } from "urql"
import { useEffect, useState } from "react"
import { BigNumber } from "@ethersproject/bignumber"

import { PositionsByIdsQuery } from "queries"
import { usePriceFeedContract } from "hooks/useContract"
import { addBignumbers } from "utils/formulas"

/**
 * Hook get pool positions, fetch positions tokens and prices of locked tokens in USD
 * @param poolAddress address of pool
 * @param positions addresses of open positions
 */
const useOpenPositionsPriceOutUSD = (
  poolAddress?: string,
  positionAmountsMap?: any,
  positions?: string[]
) => {
  const priceFeed = usePriceFeedContract()

  const [outUSDVolume, setOutUSD] = useState<BigNumber>(BigNumber.from(0))
  const [fullData, setFullData] = useState<boolean>(false)

  const [{ fetching: loading, data, error }, fetchMore] = useQuery({
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
      setFullData(false)
    }
  }, [poolAddress])

  // Must fetch all positions before calculate prices
  useEffect(() => {
    if (
      !loading &&
      data &&
      positions &&
      data.positions.length === positions.length
    ) {
      setFullData(true)
    } else if (
      data &&
      !loading &&
      positions &&
      data.positions.length !== positions.length
    ) {
      fetchMore({ requestPolicy: "network-only" })
    }
  }, [data, fetchMore, loading, positions])

  // Fetch prices of positions locked amounts in USD
  useEffect(() => {
    if (loading || !fullData || !priceFeed || !positionAmountsMap) {
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
  }, [data, fullData, loading, priceFeed, positionAmountsMap])

  return outUSDVolume
}

export default useOpenPositionsPriceOutUSD