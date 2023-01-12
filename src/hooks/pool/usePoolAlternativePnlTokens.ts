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
  // Tokens prices in USD
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

  // Token count on invests
  const totalTokensVolume = React.useMemo(() => {
    return investList.reduce(
      (acc, vest) => ({
        eth: addBignumbers(
          [acc.eth, 18],
          [BigNumber.from(vest.volumeNative), 18]
        ),
        btc: addBignumbers([acc.btc, 18], [BigNumber.from(vest.volumeBTC), 18]),
      }),
      { eth: ZERO, btc: ZERO }
    )
  }, [investList])

  // WATP
  const weightedAverageTokensPrice = React.useMemo(() => {
    const volumes = investList.reduce(
      (acc, vest, index) => {
        const { volumeNative, volumeBTC } = vest
        return {
          eth: addBignumbers(
            [acc.eth, 18],
            [
              multiplyBignumbers(
                [BigNumber.from(volumeNative), 18],
                [tokenHistoricalPrices[index].eth, 18]
              ),
              18,
            ]
          ),
          btc: addBignumbers(
            [acc.btc, 18],
            [
              multiplyBignumbers(
                [BigNumber.from(volumeBTC), 18],
                [tokenHistoricalPrices[index].btc, 18]
              ),
              18,
            ]
          ),
        }
      },
      { eth: ZERO, btc: ZERO }
    )

    return {
      eth: divideBignumbers([volumes.eth, 18], [totalTokensVolume.eth, 18]),
      btc: divideBignumbers([volumes.btc, 18], [totalTokensVolume.btc, 18]),
    }
  }, [investList, totalTokensVolume, tokenHistoricalPrices])

  // PNL_USD = (CTP - WATP) / WATP
  const pnlUSD = React.useMemo(() => {
    const { eth, btc } = weightedAverageTokensPrice

    const _eth = divideBignumbers(
      [subtractBignumbers([ethPriceOutUSD, 18], [eth, 18]), 18],
      [eth, 18]
    )

    const _btc = divideBignumbers(
      [subtractBignumbers([btcPriceOutUSD, 18], [btc, 18]), 18],
      [btc, 18]
    )

    return { eth: _eth, btc: _btc }
  }, [ethPriceOutUSD, btcPriceOutUSD, weightedAverageTokensPrice])

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
