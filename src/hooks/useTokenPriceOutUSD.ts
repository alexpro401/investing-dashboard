import { useEffect, useState } from "react"
import { parseUnits } from "@ethersproject/units"
import { BigNumber } from "@ethersproject/bignumber"

import { usePriceFeedContract } from "hooks/useContract"
import { ZERO } from "constants/index"

interface IParams {
  tokenAddress: string | undefined
  amount?: BigNumber
}

export default function useTokenPriceOutUSD({
  tokenAddress,
  amount,
}: IParams): BigNumber {
  const priceFeed = usePriceFeedContract()

  const [markPriceUSD, setMarkPriceUSD] = useState(ZERO)

  useEffect(() => {
    if (!priceFeed || !tokenAddress || tokenAddress.length !== 42) return
    ;(async () => {
      const _amount = amount ?? parseUnits("1", 18)

      const priceUSD = await priceFeed
        ?.getNormalizedPriceOutUSD(tokenAddress, _amount.toHexString())
        .catch(console.error)

      if (!!priceUSD) {
        setMarkPriceUSD(priceUSD?.amountOut.toString())
      }
    })()
  }, [tokenAddress, priceFeed, amount])

  return markPriceUSD
}
