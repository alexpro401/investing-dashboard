import * as React from "react"
import { isEmpty } from "lodash"
import { BigNumber } from "@ethersproject/bignumber"

import { ZERO } from "consts"
import { InvestorVest } from "interfaces/thegraphs/investors"
import {
  addBignumbers,
  divideBignumbers,
  multiplyBignumbers,
  subtractBignumbers,
} from "utils/formulas"
import { useTokenPriceOutUSD } from "hooks"

const usePoolAlternativePnlTokens = (
  vests?: InvestorVest[],
  baseToken?: string,
  tokens?: Record<string, string>
): Record<string, Record<string, BigNumber>> => {
  // CTP - Current Token Price
  const ethPriceOutUSD = useTokenPriceOutUSD({
    tokenAddress: tokens ? tokens.eth : "",
  })
  const btcPriceOutUSD = useTokenPriceOutUSD({
    tokenAddress: tokens ? tokens.btc : "",
  })

  const investList = React.useMemo(
    () => vests?.filter((vest) => vest.isInvest) ?? [],
    [vests]
  )

  const tokenHistoricalPrices = React.useMemo(() => {
    if (!investList || isEmpty(investList)) return []

    return investList.map((vest) => {
      const { volumeNative, volumeBTC, volumeUSD } = vest

      const priceETH = divideBignumbers(
        [BigNumber.from(volumeUSD), 18],
        [BigNumber.from(volumeNative), 18]
      )
      const priceBTC = divideBignumbers(
        [BigNumber.from(volumeUSD), 18],
        [BigNumber.from(volumeBTC), 18]
      )

      return { eth: priceETH, btc: priceBTC }
    })
  }, [investList])

  // ATIP - Average Token Invest Price
  const averageDepositPriceInUSD = React.useMemo(() => {
    if (isEmpty(tokenHistoricalPrices)) return { eth: ZERO, btc: ZERO }

    const totalInvestingPrice = tokenHistoricalPrices.reduce(
      (acc, price) => ({
        eth: addBignumbers([acc.eth, 18], [price.eth, 18]),
        btc: addBignumbers([acc.btc, 18], [price.btc, 18]),
      }),
      { eth: ZERO, btc: ZERO }
    )

    return {
      eth: divideBignumbers(
        [totalInvestingPrice.eth, 18],
        [BigNumber.from(tokenHistoricalPrices.length), 18]
      ),
      btc: divideBignumbers(
        [totalInvestingPrice.btc, 18],
        [BigNumber.from(tokenHistoricalPrices.length), 18]
      ),
    }
  }, [tokenHistoricalPrices])

  // PNL_USD = (CTP - ATIP) / ATIP
  const pnlUSD = React.useMemo(() => {
    const { eth, btc } = averageDepositPriceInUSD

    const _eth = divideBignumbers(
      [subtractBignumbers([ethPriceOutUSD, 18], [eth, 18]), 18],
      [eth, 18]
    )

    const _btc = divideBignumbers(
      [subtractBignumbers([btcPriceOutUSD, 18], [btc, 18]), 18],
      [btc, 18]
    )

    return { eth: _eth, btc: _btc }
  }, [ethPriceOutUSD, btcPriceOutUSD, averageDepositPriceInUSD])

  // PNL = PNL_USD * 100
  const pnlPercentage = React.useMemo(() => {
    return {
      eth: multiplyBignumbers([pnlUSD.eth, 18], [BigNumber.from(100), 18]),
      btc: multiplyBignumbers([pnlUSD.btc, 18], [BigNumber.from(100), 18]),
    }
  }, [pnlUSD])

  return { usd: pnlUSD, percentage: pnlPercentage }
}

export default usePoolAlternativePnlTokens
