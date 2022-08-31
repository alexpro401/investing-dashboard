import { BigNumber } from "@ethersproject/bignumber"

import { PositionsByIdsQuery } from "queries"
import { usePriceFeedContract } from "hooks/useContract"
import useQueryPagination from "hooks/useQueryPagination"
import { useEffect, useState } from "react"
import { addBignumbers, subtractBignumbers } from "utils/formulas"

/**
 * Hook get pool positions, fetch positions tokens and prices of locked tokens in USD
 * @param poolAddress address of pool
 * @param positions addresses of open positions
 * @param baseAndPositionBalances normalized positions balances in position token (dont need increase index for mapping with positions)
 */
const useOpenPositionsPricesOutUSD = (
  poolAddress: string,
  positions: string[],
  baseAndPositionBalances: BigNumber[]
) => {
  const priceFeed = usePriceFeedContract()

  const [outUSDVolume, setOutUSD] = useState<BigNumber>(BigNumber.from(0))
  const [fullData, setFullData] = useState<boolean>(false)

  const [{ data, error, loading }, fetchMore] = useQueryPagination(
    PositionsByIdsQuery,
    { idList: positions.map((pId) => poolAddress + pId) },
    (p) => p.positions
  )

  // Must fetch all positions before calculate prices
  useEffect(() => {
    if (data && !loading && data.length !== positions.length) {
      fetchMore()
    } else {
      setFullData(true)
    }
  }, [data, fetchMore, loading, positions])

  // Fetch prices of positions locked amounts in USD
  useEffect(() => {
    if (!fullData || !priceFeed) {
      return
    }

    ;(async () => {
      try {
        for (const [i, p] of data.entries()) {
          //TODO: choose one of options described below

          //? First option is calculate p.totalUSDOpenVolume - p.totalUSDCloseVolume
          //! Maybe p.totalUSDOpenVolume - p.totalUSDCloseVolume !== baseAndPositionBalances[i]
          const { totalUSDOpenVolume, totalUSDCloseVolume, baseToken } = p
          const currentUSDOpenVolume = subtractBignumbers(
            [totalUSDOpenVolume, 18],
            [totalUSDCloseVolume, 18]
          )
          setOutUSD((prev) =>
            addBignumbers([prev, 18], [currentUSDOpenVolume, 18])
          )

          //? Second option is get baseAndPositionBalances[i]
          //! baseAndPositionBalances[i] can be wrong index => wrong priceFeed result
          const price = await priceFeed.getNormalizedPriceOutUSD(
            baseToken,
            baseAndPositionBalances[i]
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
  }, [baseAndPositionBalances, data, fullData, priceFeed])

  return outUSDVolume
}

export default useOpenPositionsPricesOutUSD
