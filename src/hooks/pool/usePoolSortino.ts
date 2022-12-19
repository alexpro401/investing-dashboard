/**
 * _P (Period): last 12 month (exclude current one) - Sortino calculation period
 * _RP (Real period): if pool exist less than 12-month use count of month pool exist otherwise 12 month
 */

/** Sortino (S)
 * @formula: S = (R – T) / DR
 * @param: R – Actual portfolio return (средний PnL за период _RP)
 * @param: T – Risk-free rate (Ожидаемая доходность)
 * @param: DR – Standard deviation of the downside (т.н "волатильность вниз" aka Целевое отклонение в сторону понижения)
 */

/** Actual portfolio return (R)
 * @formula: R = sum(poolPNLs) / poolPNLs.length
 * @param: poolPNLs - array of pool pnl's (_RP)
 */

/** Risk-free rate (T)
 * @formula: T = Tp / Tm
 * @param: Tp - token PnL for _RP period
 * @param: Tm - count of periods with existing PnL (_RP.length)
 */

/** Token PnL for _RP period (Tp)
 * @formula: Tp = ((Pe - Ps) / Ps) * 100
 * @param: Ps - token price at the start of first month in _RP
 * @param: Pe - token price at the end of last month in _RP
 */

/** Standard deviation of the downside (DR)
 * @step0: subtract riskFreeRate from each monthly pnl in _RP
 * @step1: take negative PnL for each month (_RP)
 * @step2: convert every value from @step1 to decimal and square
 * @step3: summarise values from @step2
 * @step4: divide the sum from @step3 by _RP.length
 * @step5: get square from sum in @step4
 */

import * as React from "react"
import { normalizeBigNumber } from "utils"
import { usePoolSortinoData } from "hooks/pool"
import { BigNumberish } from "@ethersproject/bignumber"

function getTokenPnlToPeriod(start, end) {
  return ((end - start) / start) * 100
}

type Response = Record<string, BigNumberish> | undefined

const usePoolSortino = (poolAddress: string, tokens: string[]): Response => {
  const { data, actualPeriod, tokensPrices } = usePoolSortinoData(
    poolAddress,
    tokens
  )

  const history = React.useMemo(() => {
    if (!data || data.length === 0) {
      return undefined
    }

    return data.map((month) => ({
      ...month,
      pnl: Number(normalizeBigNumber(month.percPNLBase, 4, 6)),
    }))
  }, [data])

  const tokensHistoricalPrices = React.useMemo(() => {
    if (!actualPeriod || !tokensPrices) return undefined

    const result = {} as Record<string, number>
    for (const [token, prices] of Object.entries(tokensPrices)) {
      result[token] = getTokenPnlToPeriod(
        prices[actualPeriod.start],
        prices[actualPeriod.end]
      )
    }

    return result
  }, [actualPeriod, tokensPrices])

  // 1) R – Actual portfolio return
  const actualPortfolioReturn = React.useMemo(() => {
    if (!history) return undefined

    const sum = history.reduce((prev, h) => prev + h.pnl, 0)
    return sum / history.length
  }, [history])

  // 2) T – Risk-free rate
  const riskFreeRate = React.useMemo(() => {
    if (!history || !tokensHistoricalPrices || !tokens || tokens.length === 0) {
      return undefined
    }

    return tokens.reduce((prev, token) => {
      return {
        ...prev,
        ...{
          [token]: tokensHistoricalPrices[token] / history.length,
        },
      }
    }, {} as Record<string, number>)
  }, [history, tokensHistoricalPrices, tokens])

  // 3) DR – Standard deviation of the downside
  const standardDeviation = React.useMemo(() => {
    if (!tokens || tokens.length === 0 || !history || !riskFreeRate) {
      return undefined
    }

    return tokens.reduce((prev, token) => {
      // @step0
      const pnlSubRiskFreeRate = history.map((h) => {
        if (riskFreeRate[token] > 0) {
          return h.pnl - riskFreeRate[token]
        } else {
          return h.pnl + riskFreeRate[token]
        }
      })
      // @step1
      const actualPNLs = pnlSubRiskFreeRate.filter((pnl) => pnl < 0)
      // @step2
      const powered = actualPNLs.map((pnl) => {
        const decimals = pnl / 100
        return Math.pow(decimals, 2) * 100
      })
      // @step3
      const sum = powered.reduce((prev, pnl) => prev + pnl, 0)
      // @step4
      const middle = sum / history.length

      // @step5
      prev[token] = Math.sqrt(middle)
      return prev
    }, {})
  }, [history, tokens, riskFreeRate])

  // 4) S - Sortino
  return React.useMemo(() => {
    if (
      !tokens ||
      tokens.length === 0 ||
      !actualPortfolioReturn ||
      !riskFreeRate ||
      !standardDeviation
    ) {
      return undefined
    }

    return tokens.reduce(
      (prev, token) => ({
        ...prev,
        [token]:
          (actualPortfolioReturn / 100 - riskFreeRate[token] / 100) /
          standardDeviation[token],
      }),
      {}
    )
  }, [tokens, actualPortfolioReturn, riskFreeRate, standardDeviation])
}

export default usePoolSortino
