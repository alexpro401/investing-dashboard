import axios from "axios"
import { parseUnits } from "@ethersproject/units"
import { useEffect, useState, useMemo } from "react"
import { BigNumber } from "@ethersproject/bignumber"

import { ZERO } from "constants/index"
import { normalizeBigNumber } from "utils"
import { usePoolQuery } from "hooks/usePool"
import usePoolPrice from "hooks/usePoolPrice"
import { useERC20Data } from "state/erc20/hooks"
import { usePriceFeedContract } from "contracts"
import { divideBignumbers, multiplyBignumbers } from "utils/formulas"

const usePoolPnlInfo = (address: string | undefined) => {
  const priceFeed = usePriceFeedContract()
  const [poolData] = usePoolQuery(address)
  const [{ priceUSD }] = usePoolPrice(address)
  const [baseToken] = useERC20Data(poolData?.baseToken)

  const [_baseTokenPrice, _setBaseTokenPrice] = useState<BigNumber>(ZERO)

  const [initialPriceUSD, setInitialPriceUSD] = useState(ZERO)

  const totalPnlPercentage = useMemo(() => {
    if (initialPriceUSD.isZero() || !priceUSD) {
      return "0"
    }

    const d = multiplyBignumbers([priceUSD, 18], [BigNumber.from(100), 18])
    const r = divideBignumbers([d, 18], [initialPriceUSD, 18])
    return normalizeBigNumber(r, 18, 2)
  }, [initialPriceUSD, priceUSD])

  interface IAmount {
    big: BigNumber
    format: string
  }
  const totalPnlBase = useMemo<IAmount>(() => {
    if (!poolData || !poolData.priceHistory || !poolData.priceHistory[0]) {
      return { big: ZERO, format: "0" }
    }

    const big = BigNumber.from(poolData.priceHistory[0].absPNL)

    return { big, format: normalizeBigNumber(big, 18, 6) }
  }, [poolData])

  const totalUSDPnlPerc = useMemo(() => {
    if (!poolData || !poolData.priceHistory || !poolData.priceHistory[0]) {
      return "0"
    }

    const big = BigNumber.from(poolData.priceHistory[0].percPNL)
    return normalizeBigNumber(big, 4, 2)
  }, [poolData])

  const totalUSDPnlUSD = useMemo(() => {
    if (
      !_baseTokenPrice ||
      !totalPnlBase ||
      totalPnlBase.big.isZero() ||
      _baseTokenPrice.isZero()
    ) {
      return "0"
    }

    const isNegative = totalPnlBase.big.isNegative()

    const big = divideBignumbers(
      [totalPnlBase.big.abs(), 18],
      [_baseTokenPrice, 18]
    )

    const withSign = isNegative ? big.mul(-1) : big

    return normalizeBigNumber(withSign, 18, 2)
  }, [_baseTokenPrice, totalPnlBase])

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

  // Fetch price of base token
  useEffect(() => {
    if (!priceFeed || !baseToken) return
    ;(async () => {
      try {
        const amount = parseUnits("1", 18)
        const price = await priceFeed.getNormalizedPriceOutUSD(
          baseToken.address,
          amount
        )
        if (price && price.amountOut) {
          _setBaseTokenPrice(price.amountOut)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [priceFeed, baseToken])

  return [
    { poolData, baseToken },
    { totalPnlPercentage, totalPnlBase, totalUSDPnlPerc, totalUSDPnlUSD },
  ]
}

export default usePoolPnlInfo
