import { useEffect, useState } from "react"
import { parseUnits } from "@ethersproject/units"
import { BigNumber } from "@ethersproject/bignumber"

import { usePriceFeedContract } from "contracts"
import { ZERO } from "constants/index"

interface IParams {
  tokenAddress: string | undefined
  amount?: BigNumber
}

export function useTokenPriceOutUSD({
  tokenAddress,
  amount,
}: IParams): BigNumber {
  const priceFeed = usePriceFeedContract()

  const [markPriceUSD, setMarkPriceUSD] = useState(ZERO)

  useEffect(() => {
    if (!priceFeed || !tokenAddress || tokenAddress.length !== 42) return
    ;(async () => {
      try {
        const _amount = amount ?? parseUnits("1", 18)

        const priceUSD = await priceFeed
          .getNormalizedPriceOutUSD(tokenAddress, _amount.toHexString())
          .catch(console.error)

        if (!!priceUSD) {
          setMarkPriceUSD(priceUSD.amountOut)
        }
      } catch (e) {
        console.error(e)
      }
    })()
  }, [tokenAddress, priceFeed, amount])

  return markPriceUSD
}

export default useTokenPriceOutUSD
