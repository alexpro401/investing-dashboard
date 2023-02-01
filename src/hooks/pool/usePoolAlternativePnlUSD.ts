import * as React from "react"
import { isEmpty, isNil } from "lodash"
import { BigNumber } from "@ethersproject/bignumber"

import { useAPI } from "api"
import { ZERO } from "consts"
import { expandTimestamp } from "utils"
import { InvestorVest } from "interfaces/thegraphs/investors"
import {
  addBignumbers,
  divideBignumbers,
  multiplyBignumbers,
  subtractBignumbers,
} from "utils/formulas"
import { useTokenPriceOutUSD } from "hooks"

type Response = { usd: BigNumber; percentage: BigNumber }

const usePoolAlternativePnlUSD = (
  vests?: InvestorVest[],
  baseToken?: string
): Response => {
  const { TokenAPI } = useAPI()
  const tokenPriceOutUSD = useTokenPriceOutUSD({ tokenAddress: baseToken })

  const investList = React.useMemo(
    () => vests?.filter((vest) => vest.isInvest),
    [vests]
  )

  const divestList = React.useMemo(
    () => vests?.filter((vest) => !vest.isInvest),
    [vests]
  )

  const [baseTokenHistoricalPrices, setBaseTokenHistoricalPrices] =
    React.useState<Record<string, BigNumber>>({})

  // Get historical prices for base token of all invests
  React.useEffect(() => {
    if (!TokenAPI || !baseToken || !investList || isEmpty(investList)) return
    ;(async () => {
      const timestamps = investList.map((vest) =>
        expandTimestamp(Number(vest.timestamp))
      )

      let prices
      try {
        prices = await TokenAPI.getHistoricalPrices(baseToken, timestamps)
      } catch (error) {
        console.error({ error })
      }

      if (prices) {
        const pricesDTO = Object.entries(prices).reduce(
          (acc, [timestamp, price]) => ({
            ...acc,
            [timestamp]: BigNumber.from(price),
          }),
          {}
        )
        setBaseTokenHistoricalPrices(pricesDTO)
      }
    })()
  }, [investList, baseToken, TokenAPI])

  // Average price of token at invest times
  const averageDepositPrice = React.useMemo(() => {
    if (isEmpty(baseTokenHistoricalPrices)) return ZERO

    const historicalPricesList = Object.values(baseTokenHistoricalPrices)

    const totalInvestingPrice = historicalPricesList.reduce(
      (acc, price) => addBignumbers([acc, 18], [price, 18]),
      ZERO
    )

    return divideBignumbers(
      [totalInvestingPrice, 18],
      [BigNumber.from(historicalPricesList.length), 18]
    )
  }, [baseTokenHistoricalPrices])

  // Count of invested tokens
  const totalInvestedTokensCount = React.useMemo(() => {
    if (isNil(investList) || isEmpty(investList)) return ZERO

    return investList.reduce(
      (acc, vest) =>
        addBignumbers([acc, 18], [BigNumber.from(vest.volumeBase), 18]),
      ZERO
    )
  }, [investList])

  // Price of invested tokens (used average price of invests)
  const totalInvestedPriceUSD = React.useMemo(
    () =>
      multiplyBignumbers(
        [averageDepositPrice, 18],
        [totalInvestedTokensCount, 18]
      ),
    [averageDepositPrice, totalInvestedTokensCount]
  )

  // Count of divested tokens
  const totalDivestedTokensCount = React.useMemo(() => {
    if (isNil(divestList) || isEmpty(divestList)) return ZERO

    return divestList.reduce(
      (acc, vest) =>
        addBignumbers([acc, 18], [BigNumber.from(vest.volumeBase), 18]),
      ZERO
    )
  }, [divestList])

  // Price of divested tokens (used average price of invests)
  const totalDivestedPriceUSD = React.useMemo(
    () =>
      multiplyBignumbers(
        [averageDepositPrice, 18],
        [totalDivestedTokensCount, 18]
      ),
    [averageDepositPrice, totalDivestedTokensCount]
  )

  // посчитать остаток от инвестов
  const totalInvestedTokensLeftPriceUSD = React.useMemo(() => {
    return subtractBignumbers(
      [totalInvestedPriceUSD, 18],
      [totalDivestedPriceUSD, 18]
    )
  }, [totalInvestedPriceUSD, totalDivestedPriceUSD])

  const currentTokensCount = React.useMemo(
    () =>
      subtractBignumbers(
        [totalInvestedTokensCount, 18],
        [totalDivestedTokensCount, 18]
      ),
    [totalInvestedTokensCount, totalDivestedTokensCount]
  )

  // Price of current tokens count in USD
  const currentBalancePriceUSD = React.useMemo(() => {
    return multiplyBignumbers([currentTokensCount, 18], [tokenPriceOutUSD, 18])
  }, [tokenPriceOutUSD, currentTokensCount])

  // Percentage of current tokens price
  const currentBalancePercentage = React.useMemo(() => {
    const s1 = subtractBignumbers(
      [currentBalancePriceUSD, 18],
      [totalInvestedTokensLeftPriceUSD, 18]
    )
    const s2 = divideBignumbers([s1, 18], [totalInvestedTokensLeftPriceUSD, 18])

    return multiplyBignumbers([s2, 18], [BigNumber.from(100), 18])
  }, [currentBalancePriceUSD, totalInvestedTokensLeftPriceUSD])

  return React.useMemo<Response>(() => {
    return { usd: currentBalancePriceUSD, percentage: currentBalancePercentage }
  }, [currentBalancePriceUSD, currentBalancePercentage])
}

export default usePoolAlternativePnlUSD
