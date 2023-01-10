import * as React from "react"
import { isEmpty } from "lodash"
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

const usePoolAlternativePnlToken = (
  vests?: InvestorVest[],
  baseToken?: string,
  token?: string
): Record<string, BigNumber> => {
  const { TokenAPI } = useAPI()
  // CTP - Current Token Price
  const tokenPriceOutUSD = useTokenPriceOutUSD({ tokenAddress: token })

  const investList = React.useMemo(
    () => vests?.filter((vest) => vest.isInvest) ?? [],
    [vests]
  )

  // Price of token in USD at invests times
  const [tokenHistoricalPrices, setTokenHistoricalPrices] = React.useState<
    Record<string, BigNumber>
  >({})

  // Get historical prices for token of all invests
  React.useEffect(() => {
    if (!TokenAPI || !token || !investList || isEmpty(investList)) return
    ;(async () => {
      const timestamps = investList.map((vest) =>
        expandTimestamp(Number(vest.timestamp))
      )
      const pricesToken = await TokenAPI.getHistoricalPrices(token, timestamps)

      if (pricesToken) {
        const pricesDTO = Object.entries(pricesToken).reduce(
          (acc, [timestamp, price]) => ({
            ...acc,
            [timestamp]: BigNumber.from(price),
          }),
          {}
        )
        setTokenHistoricalPrices(pricesDTO)
      }
    })()
  }, [investList, TokenAPI, token])

  // ATIP - Average Token Invest Price
  const averageTokenDepositPriceInUSD = React.useMemo(() => {
    if (isEmpty(tokenHistoricalPrices)) return ZERO

    const tokenHistoricalPricesList = Object.values(tokenHistoricalPrices)

    const totalTokenInvestingPrice = tokenHistoricalPricesList.reduce(
      (acc, price) => addBignumbers([acc, 18], [price, 18]),
      ZERO
    )

    return divideBignumbers(
      [totalTokenInvestingPrice, 18],
      [BigNumber.from(tokenHistoricalPricesList.length), 18]
    )
  }, [tokenHistoricalPrices])

  // PNL_USD = (CTP - ATIP) / ATIP
  const pnlUSD = React.useMemo(() => {
    const s1 = subtractBignumbers(
      [tokenPriceOutUSD, 18],
      [averageTokenDepositPriceInUSD, 18]
    )
    return divideBignumbers([s1, 18], [averageTokenDepositPriceInUSD, 18])
  }, [tokenPriceOutUSD, averageTokenDepositPriceInUSD])

  // PNL = PNL_USD * 100
  const pnlPercentage = React.useMemo(() => {
    return multiplyBignumbers([pnlUSD, 18], [BigNumber.from(100), 18])
  }, [pnlUSD])
  return React.useMemo(
    () => ({ usd: pnlUSD, percentage: pnlPercentage }),
    [pnlUSD, pnlPercentage]
  )
}

export default usePoolAlternativePnlToken
