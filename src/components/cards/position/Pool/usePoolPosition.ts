import { parseUnits } from "@ethersproject/units"
import { BigNumber } from "@ethersproject/bignumber"
import { useEffect, useMemo, useState } from "react"

import { formatBigNumber } from "utils"
import { IPosition } from "constants/interfaces_v2"
import { useERC20, usePriceFeedContract } from "hooks/useContract"
import useTokenPriceOutUSD from "hooks/useTokenPriceOutUSD"

import {
  subtractBignumbers,
  addBignumbers,
  multiplyBignumbers,
  divideBignumbers,
  calcPositionPnlPercentage,
} from "utils/formulas"
import { ITokenBase } from "constants/interfaces"

const BIG_ZERO: BigNumber = BigNumber.from(0)

interface IAmount {
  big: BigNumber
  format: string
}

const INITIAL_AMOUNT: IAmount = {
  big: BIG_ZERO,
  format: "0",
}

interface IPayload {
  currentPositionVolume: string
  entryPriceBase: BigNumber
  entryPriceUSD: BigNumber
  markPriceBase: BigNumber
  markPriceUSD: BigNumber
  pnlPercentage: IAmount
  pnlBase: BigNumber
  pnlUSD: BigNumber
  positionToken: ITokenBase | null
  baseToken: ITokenBase | null
}

function usePoolPosition(position: IPosition): [IPayload] {
  const priceFeed = usePriceFeedContract()
  const [, positionToken] = useERC20(position.positionToken)
  const [, baseToken] = useERC20(position.traderPool.baseToken)

  const currentPriceUSD = useTokenPriceOutUSD({
    tokenAddress: position.positionToken,
  })

  // STATE DATA
  const [markPrice, setMarkPriceBase] = useState<BigNumber>(BIG_ZERO)
  const [pnlUSDCurrent, setPnlUSDCurrent] = useState<BigNumber>(BIG_ZERO)

  // MEMOIZED DATA
  /**
   * Current position amount in position token
   *
   * closed ? totalPositionCloseVolume : totalPositionOpenVolume - totalPositionCloseVolume
   */
  const currentPositionVolume = useMemo<string>(() => {
    if (!position) return "0"

    if (position.closed) {
      return formatBigNumber(position.totalPositionCloseVolume)
    }

    const { totalPositionOpenVolume, totalPositionCloseVolume } = position
    const volume = subtractBignumbers(
      [totalPositionOpenVolume, 18],
      [totalPositionCloseVolume, 18]
    )
    return formatBigNumber(volume)
  }, [position])

  /**
   * Entry price (in fund base token)
   *
   * totalBaseOpenVolume / totalPositionOpenVolume
   */
  const entryPriceBase = useMemo<BigNumber>(() => {
    if (!position) return BIG_ZERO

    const { totalBaseOpenVolume, totalPositionOpenVolume } = position
    return divideBignumbers(
      [totalBaseOpenVolume, 18],
      [totalPositionOpenVolume, 18]
    )
  }, [position])

  /**
   * Entry price (in USD)
   *
   * totalBaseOpenVolume / totalPositionOpenVolume
   */
  const entryPriceUSD = useMemo<BigNumber>(() => {
    if (!position) return BIG_ZERO

    const { totalUSDOpenVolume, totalPositionOpenVolume } = position
    return divideBignumbers(
      [totalUSDOpenVolume, 18],
      [totalPositionOpenVolume, 18]
    )
  }, [position])

  /**
   * Mark price (in base token)
   *
   * closed ? totalBaseCloseVolume / totalPositionCloseVolume : markPrice
   */
  const markPriceBase = useMemo<BigNumber>(() => {
    if (!position) return BIG_ZERO

    if (position.closed) {
      const { totalBaseCloseVolume, totalPositionCloseVolume } = position
      return divideBignumbers(
        [totalBaseCloseVolume, 18],
        [totalPositionCloseVolume, 18]
      )
    }
    return markPrice
  }, [markPrice, position])

  /**
   * Mark price (in USD)
   *
   * close ? totalUSDCloseVolume / totalPositionCloseVolume : currentPriceUSD
   */
  const markPriceUSD = useMemo<BigNumber>(() => {
    if (!position) return BIG_ZERO

    if (position.closed) {
      const { totalUSDCloseVolume, totalPositionCloseVolume } = position
      return divideBignumbers(
        [totalUSDCloseVolume, 18],
        [totalPositionCloseVolume, 18]
      )
    }
    return currentPriceUSD
  }, [currentPriceUSD, position])

  /**
   * P&L (in %)
   */
  const pnlPercentage = useMemo<IAmount>(() => {
    if (!markPriceBase || !entryPriceBase || entryPriceBase.isZero()) {
      return INITIAL_AMOUNT
    }

    const big = calcPositionPnlPercentage(markPriceBase, entryPriceBase)

    return {
      big,
      format: formatBigNumber(big, 18, 2),
    }
  }, [markPriceBase, entryPriceBase])

  /**
   * P&L (in base token)
   *
   */
  const pnlBase = useMemo<BigNumber>(() => {
    if (!position || !pnlPercentage || pnlPercentage.big.isZero()) {
      return BIG_ZERO
    }

    const { closed, totalBaseOpenVolume, totalBaseCloseVolume } = position

    const totalBaseVolume = closed
      ? totalBaseCloseVolume
      : subtractBignumbers(
          [totalBaseOpenVolume, 18],
          [totalBaseCloseVolume, 18]
        ) // current base open volume

    const pnlBaseVolume = multiplyBignumbers(
      [totalBaseVolume, 18],
      [pnlPercentage.big, 18]
    )

    return addBignumbers([totalBaseVolume, 18], [pnlBaseVolume, 18])
  }, [position, pnlPercentage])

  /**
   * P&L (in USD)
   */
  const pnlUSD = useMemo<BigNumber>(() => {
    if (!position || !markPriceUSD || !entryPriceUSD) return BIG_ZERO

    if (position.closed) {
      return subtractBignumbers([markPriceUSD, 18], [entryPriceUSD, 18])
    }
    return pnlUSDCurrent
  }, [markPriceUSD, entryPriceUSD, position, pnlUSDCurrent])

  // SIDE EFFECTS
  // Fetch price of 1 position token in base token
  useEffect(() => {
    if (!priceFeed || !position || position.closed) return
    ;(async () => {
      try {
        const amount = parseUnits("1", 18)

        const { positionToken, traderPool } = position

        const price = await priceFeed.getNormalizedExtendedPriceOut(
          positionToken,
          traderPool.baseToken,
          amount,
          []
        )

        if (price && price.amountOut && !price.amountOut.isZero()) {
          setMarkPriceBase(price.amountOut)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [position, priceFeed])

  // fetch pnl price in USD
  useEffect(() => {
    if (!priceFeed || !pnlBase || !baseToken) return
    ;(async () => {
      try {
        const price = await priceFeed.getNormalizedPriceOutUSD(
          baseToken.address,
          pnlBase.abs().toHexString()
        )

        if (price && price.amountOut && !price.amountOut.isZero()) {
          setPnlUSDCurrent(
            pnlBase.isNegative()
              ? multiplyBignumbers(
                  [price.amountOut, 18],
                  [BigNumber.from("-1"), 18]
                )
              : price.amountOut
          )
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [baseToken, pnlBase, priceFeed])

  return [
    {
      currentPositionVolume,
      entryPriceBase,
      entryPriceUSD,
      markPriceBase,
      markPriceUSD,
      pnlPercentage,
      pnlBase,
      pnlUSD,
      positionToken,
      baseToken,
    },
  ]
}

export default usePoolPosition
