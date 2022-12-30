import { parseUnits } from "@ethersproject/units"
import { BigNumber } from "@ethersproject/bignumber"
import { useEffect, useMemo, useState } from "react"

import { ZERO } from "consts"
import { formatBigNumber } from "utils"
import { useERC20Data } from "state/erc20/hooks"
import { IPosition } from "interfaces/thegraphs/all-pools"
import useTokenPriceOutUSD from "hooks/useTokenPriceOutUSD"
import { usePriceFeedContract } from "contracts"

import {
  divideBignumbers,
  subtractBignumbers,
  multiplyBignumbers,
  calcPositionPnlPercentage,
} from "utils/formulas"
import { ITokenBase } from "interfaces"

interface IAmount {
  big: BigNumber
  format: string
}

const INITIAL_AMOUNT: IAmount = {
  big: ZERO,
  format: "0",
}

interface IPayload {
  currentPositionVolume: IAmount
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
  const [positionToken] = useERC20Data(position.positionToken)
  const [baseToken] = useERC20Data(position.traderPool.baseToken)

  const currentPriceUSD = useTokenPriceOutUSD({
    tokenAddress: position.positionToken,
  })

  // STATE DATA
  const [markPrice, setMarkPriceBase] = useState<BigNumber>(ZERO)

  // MEMOIZED DATA
  /**
   * Current position amount in position token
   *
   * closed ? totalPositionCloseVolume : totalPositionOpenVolume - totalPositionCloseVolume
   */
  const currentPositionVolume = useMemo<IAmount>(() => {
    if (!position) return INITIAL_AMOUNT

    const { totalPositionOpenVolume, totalPositionCloseVolume } = position

    if (position.closed) {
      return {
        big: BigNumber.from(totalPositionCloseVolume),
        format: formatBigNumber(BigNumber.from(totalPositionCloseVolume)),
      }
    }

    const big = subtractBignumbers(
      [BigNumber.from(totalPositionOpenVolume), 18],
      [BigNumber.from(totalPositionCloseVolume), 18]
    )
    return { big, format: formatBigNumber(big) }
  }, [position])

  /**
   * Entry price (in fund base token)
   *
   * totalBaseOpenVolume / totalPositionOpenVolume
   */
  const entryPriceBase = useMemo<BigNumber>(() => {
    if (!position) return ZERO

    const { totalBaseOpenVolume, totalPositionOpenVolume } = position

    return divideBignumbers(
      [BigNumber.from(totalBaseOpenVolume), 18],
      [BigNumber.from(totalPositionOpenVolume), 18]
    )
  }, [position])

  /**
   * Entry price (in USD)
   *
   * totalBaseOpenVolume / totalPositionOpenVolume
   */
  const entryPriceUSD = useMemo<BigNumber>(() => {
    if (!position) return ZERO

    const { totalUSDOpenVolume, totalPositionOpenVolume } = position
    return divideBignumbers(
      [BigNumber.from(totalUSDOpenVolume), 18],
      [BigNumber.from(totalPositionOpenVolume), 18]
    )
  }, [position])

  /**
   * Mark price (in base token)
   *
   * closed ? totalBaseCloseVolume / totalPositionCloseVolume : markPrice
   */
  const markPriceBase = useMemo<BigNumber>(() => {
    if (!position) return ZERO

    if (position.closed) {
      const { totalBaseCloseVolume, totalPositionCloseVolume } = position
      return divideBignumbers(
        [BigNumber.from(totalBaseCloseVolume), 18],
        [BigNumber.from(totalPositionCloseVolume), 18]
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
    if (!position) return ZERO

    if (position.closed) {
      const { totalUSDCloseVolume, totalPositionCloseVolume } = position
      return divideBignumbers(
        [BigNumber.from(totalUSDCloseVolume), 18],
        [BigNumber.from(totalPositionCloseVolume), 18]
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
   * (markPriceBase - entryPriceBase) * volumeInPositionToken
   */
  const pnlBase = useMemo<BigNumber>(() => {
    if (!markPriceBase || !entryPriceBase || !currentPositionVolume) return ZERO

    const priceDiff = subtractBignumbers(
      [markPriceBase, 18],
      [entryPriceBase, 18]
    )

    return multiplyBignumbers([priceDiff, 18], [currentPositionVolume.big, 18])
  }, [markPriceBase, entryPriceBase, currentPositionVolume])

  /**
   * P&L (in USD)
   */
  const pnlUSD = useMemo<BigNumber>(() => {
    if (!markPriceUSD || !entryPriceUSD || !currentPositionVolume) {
      return ZERO
    }

    const priceDiff = subtractBignumbers(
      [markPriceUSD, 18],
      [entryPriceUSD, 18]
    )

    return multiplyBignumbers([priceDiff, 18], [currentPositionVolume.big, 18])
  }, [markPriceUSD, entryPriceUSD, currentPositionVolume])

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
