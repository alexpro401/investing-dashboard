import { IPoolQuery } from "interfaces/thegraphs/all-pools"
import { getPNL, getPriceLP } from "utils/formulas"
import { useMemo } from "react"

export const usePoolStatistics = (poolData?: IPoolQuery) => {
  const lastHistoryPoint = poolData?.priceHistory?.length
    ? poolData?.priceHistory[poolData?.priceHistory?.length - 1]
    : undefined

  const priceLP = getPriceLP(poolData?.priceHistory)

  const tvl = useMemo(() => lastHistoryPoint?.usdTVL, [lastHistoryPoint])

  const apy = useMemo(() => lastHistoryPoint?.APY, [lastHistoryPoint])

  const pnlBasePercent = useMemo(
    () => lastHistoryPoint?.percPNLBase,
    [lastHistoryPoint]
  )

  const pnlBase24hPercent = getPNL(priceLP)

  const depositors = useMemo(() => poolData?.investorsCount, [poolData])

  return {
    priceLP,

    tvl,
    apy,
    pnlBasePercent,
    pnlBase24hPercent,
    depositors,
  }
}
