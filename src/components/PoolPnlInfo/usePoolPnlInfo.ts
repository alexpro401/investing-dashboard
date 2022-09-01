import axios from "axios"
import { useEffect, useState, useMemo } from "react"
import { BigNumber } from "@ethersproject/bignumber"

import { normalizeBigNumber } from "utils"
import { usePoolQuery } from "hooks/usePool"
import { useERC20 } from "hooks/useContract"
import usePoolPrice from "hooks/usePoolPrice"
import { _divideBignumbers, _multiplyBignumbers } from "utils/formulas"

const usePoolPnlInfo = (address: string | undefined) => {
  const [poolData] = usePoolQuery(address)
  const [, baseToken] = useERC20(poolData?.baseToken)
  const [{ priceUSD }] = usePoolPrice(address)

  const [initialPriceUSD, setInitialPriceUSD] = useState(BigNumber.from(0))

  useEffect(() => {
    if (!poolData) return
    ;(async () => {
      try {
        const { baseToken, creationTime } = poolData
        const price = await axios.get(
          `https://api-staging.kattana.trade/historical_price/${baseToken}/${creationTime}`
        )

        setInitialPriceUSD(BigNumber.from(price[baseToken][creationTime]))
      } catch (error) {
        console.error(error)
      }
    })()
  }, [poolData])

  const totalPnlPercentage = useMemo(() => {
    if (initialPriceUSD.isZero() || !priceUSD) {
      return "0"
    }

    const d = _multiplyBignumbers([priceUSD, 18], [BigNumber.from(100), 18])
    const r = _divideBignumbers([d, 18], [initialPriceUSD, 18])
    return normalizeBigNumber(r, 18, 2)
  }, [initialPriceUSD, priceUSD])

  const totalPnlBase = useMemo(() => {
    if (!poolData) return "0"

    const big = BigNumber.from(poolData.priceHistory[0].absPNL)
    return normalizeBigNumber(big, 18, 6)
  }, [poolData])

  const totalUSDPnlPerc = useMemo(() => {
    if (!poolData) return "0"

    const big = BigNumber.from(poolData.priceHistory[0].percPNL)
    return normalizeBigNumber(big, 4, 2)
  }, [poolData])

  const totalUSDPnlUSD = useMemo(() => {
    if (!poolData) return "0"

    const big = BigNumber.from(poolData.priceHistory[0].usdTVL)
    return normalizeBigNumber(big, 18, 2)
  }, [poolData])

  return [
    { poolData, baseToken },
    { totalPnlPercentage, totalPnlBase, totalUSDPnlPerc, totalUSDPnlUSD },
  ]
}

export default usePoolPnlInfo
