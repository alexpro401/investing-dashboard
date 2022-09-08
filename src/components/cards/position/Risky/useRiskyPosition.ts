import { parseUnits } from "@ethersproject/units"
import { BigNumber } from "@ethersproject/bignumber"
import { useEffect, useMemo, useState } from "react"

import { normalizeBigNumber } from "utils"
import { IRiskyPositionCard } from "interfaces/thegraphs/basic-pools"
import { useERC20, usePriceFeedContract } from "hooks/useContract"
import useTokenPriceOutUSD from "hooks/useTokenPriceOutUSD"

import {
  divideBignumbers,
  subtractBignumbers,
  multiplyBignumbers,
  calcPositionPnlPercentage,
} from "utils/formulas"
import { ITokenBase } from "interfaces"

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
  positionVolume: IAmount
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

function useRiskyPosition(position: IRiskyPositionCard): [IPayload] {
  const [, positionToken] = useERC20(position?.token)
  const [, baseToken] = useERC20(position.pool.baseToken)

  const priceFeed = usePriceFeedContract()

  const [currentPositionPriceBase, setCurrentPositionPriceBase] =
    useState(BIG_ZERO)
  const currentPositionPriceUSD = useTokenPriceOutUSD({
    tokenAddress: position.token,
  })

  /**
   * Position volume
   * if position.closed return totalPositionCloseVolume
   * otherwise return current position volume
   */
  const positionVolume = useMemo<IAmount>(() => {
    if (!position) return INITIAL_AMOUNT

    const { totalPositionOpenVolume, totalPositionCloseVolume } = position

    if (position.isClosed) {
      return {
        big: totalPositionCloseVolume,
        format: normalizeBigNumber(totalPositionCloseVolume),
      }
    }

    const big = subtractBignumbers(
      [totalPositionOpenVolume, 18],
      [totalPositionCloseVolume, 18]
    )
    return { big, format: normalizeBigNumber(big) }
  }, [position])

  /**
   * Entry price (in fund base token)
   * totalBaseOpenVolume/totalPositionOpenVolume
   */
  const entryPriceBase = useMemo<BigNumber>(() => {
    if (!position) return BigNumber.from("0")

    const { totalBaseOpenVolume, totalPositionOpenVolume } = position
    return divideBignumbers(
      [totalBaseOpenVolume, 18],
      [totalPositionOpenVolume, 18]
    )
  }, [position])

  /**
   * Entry price (in USD)
   * totalUSDOpenVolume/totalPositionOpenVolume
   */
  const entryPriceUSD = useMemo<BigNumber>(() => {
    if (!position) return BigNumber.from("0")

    const { totalUSDOpenVolume, totalPositionOpenVolume } = position

    return divideBignumbers(
      [totalUSDOpenVolume, 18],
      [totalPositionOpenVolume, 18]
    )
  }, [position])

  /**
   * Mark price (in fund base token)
   * if position open return currentPositionPriceBase (price for 1 position token)
   * otherwise return totalBaseCloseVolume/totalPositionCloseVolume
   */
  const markPriceBase = useMemo<BigNumber>(() => {
    if (!position) return BigNumber.from("0")

    if (!position.isClosed) {
      return currentPositionPriceBase
    } else {
      const { totalBaseCloseVolume, totalPositionCloseVolume } = position

      return divideBignumbers(
        [totalBaseCloseVolume, 18],
        [totalPositionCloseVolume, 18]
      )
    }
  }, [currentPositionPriceBase, position])

  /**
   * Mark price (in USD)
   * if position open return markPriceBase (price for 1 position token)
   * otherwise return totalUSDCloseVolume/totalPositionCloseVolume
   */
  const markPriceUSD = useMemo<BigNumber>(() => {
    if (!position) return BigNumber.from("0")

    if (!position.isClosed) {
      return currentPositionPriceUSD
    } else {
      const { totalUSDCloseVolume, totalPositionCloseVolume } = position

      return divideBignumbers(
        [totalUSDCloseVolume, 18],
        [totalPositionCloseVolume, 18]
      )
    }
  }, [currentPositionPriceUSD, position])

  /**
   * P&L (in %)
   */
  const pnlPercentage = useMemo<IAmount>(() => {
    if (!markPriceBase || !entryPriceBase) {
      return INITIAL_AMOUNT
    }

    const big = calcPositionPnlPercentage(markPriceBase, entryPriceBase)

    return {
      big,
      format: normalizeBigNumber(big, 18, 2),
    }
  }, [markPriceBase, entryPriceBase])

  /**
   * P&L (in baseToken)
   * (markPriceBase - entryPriceBase) * positionVolume
   */
  const pnlBase = useMemo<BigNumber>(() => {
    if (!markPriceBase || !entryPriceBase || !positionVolume) {
      return BIG_ZERO
    }

    const priceDiff = subtractBignumbers(
      [markPriceBase, 18],
      [entryPriceBase, 18]
    )

    return multiplyBignumbers([priceDiff, 18], [positionVolume.big, 18])
  }, [markPriceBase, entryPriceBase, positionVolume])

  /**
   * P&L (in USD)
   */
  const pnlUSD = useMemo<BigNumber>(() => {
    if (!markPriceUSD || !entryPriceUSD || !positionVolume) {
      return BIG_ZERO
    }

    const priceDiff = subtractBignumbers(
      [markPriceUSD, 18],
      [entryPriceUSD, 18]
    )

    return multiplyBignumbers([priceDiff, 18], [positionVolume.big, 18])
  }, [markPriceUSD, entryPriceUSD, positionVolume])

  // get mark price
  useEffect(() => {
    if (!priceFeed || !position || !position.token || !position.pool) return
    ;(async () => {
      try {
        const amount = parseUnits("1", 18)

        // without extended
        const price = await priceFeed.getNormalizedExtendedPriceOut(
          position.token,
          position.pool.baseToken,
          amount,
          []
        )
        if (price && price.amountOut) {
          setCurrentPositionPriceBase(price.amountOut)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [priceFeed, position])

  return [
    {
      positionVolume,
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

export default useRiskyPosition
