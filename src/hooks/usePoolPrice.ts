import { useEffect, useState } from "react"
import { BigNumber, FixedNumber } from "@ethersproject/bignumber"
import { parseEther } from "@ethersproject/units"
import { useTraderPool } from "hooks/usePool"
import useForceUpdate from "hooks/useForceUpdate"

function usePoolPrice(
  address: string | undefined
): [{ priceUSD: BigNumber; priceBase: BigNumber }, () => void] {
  const [updateObserver, update] = useForceUpdate()
  const traderPool = useTraderPool(address)
  const [priceUSD, setPriceUSD] = useState(parseEther("1"))
  const [priceBase, setPriceBase] = useState(parseEther("1"))

  useEffect(() => {
    if (!traderPool) return
    ;(async () => {
      const poolInfo = await traderPool.getPoolInfo()
      if (poolInfo.lpSupply.gt("0")) {
        const base = FixedNumber.fromValue(poolInfo.totalPoolBase, 18)
        const usd = FixedNumber.fromValue(poolInfo.totalPoolUSD, 18)
        const supply = FixedNumber.fromValue(poolInfo.lpSupply, 18)

        const usdPrice = usd.divUnsafe(supply)
        const basePrice = base.divUnsafe(supply)
        setPriceUSD(BigNumber.from(usdPrice._hex))
        setPriceBase(BigNumber.from(basePrice._hex))
      }
    })()
  }, [traderPool, updateObserver])

  return [{ priceUSD, priceBase }, update]
}

export default usePoolPrice
