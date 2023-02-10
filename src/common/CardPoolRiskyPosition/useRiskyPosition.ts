import { parseUnits } from "@ethersproject/units"
import { BigNumber } from "@ethersproject/bignumber"
import { useEffect, useMemo, useState } from "react"

import { ZERO } from "consts"
import { normalizeBigNumber } from "utils"
import { useERC20Data } from "state/erc20/hooks"
import { usePriceFeedContract } from "contracts"
import useTokenPriceOutUSD from "hooks/useTokenPriceOutUSD"
import { IRiskyPosition } from "interfaces/thegraphs/basic-pools"

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

function useRiskyPosition(position: IRiskyPosition): [IPayload] {
  const [positionToken] = useERC20Data(position?.proposal.token)
  const [baseToken] = useERC20Data(position.proposal.basicPool.baseToken)

  const priceFeed = usePriceFeedContract()

  const [currentPositionPriceBase, setCurrentPositionPriceBase] = useState(ZERO)
  const currentPositionPriceUSD = useTokenPriceOutUSD({
    tokenAddress: position.proposal.token,
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
        big: BigNumber.from(totalPositionCloseVolume),
        format: normalizeBigNumber(BigNumber.from(totalPositionCloseVolume)),
      }
    }

    const big = subtractBignumbers(
      [BigNumber.from(totalPositionOpenVolume), 18],
      [BigNumber.from(totalPositionCloseVolume), 18]
    )
    return { big, format: normalizeBigNumber(big) }
  }, [position])

  /**
   * Entry price (in fund base token)
   * totalBaseOpenVolume/totalPositionOpenVolume
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
   * totalUSDOpenVolume/totalPositionOpenVolume
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
   * Mark price (in fund base token)
   * if position open return currentPositionPriceBase (price for 1 position token)
   * otherwise return totalBaseCloseVolume/totalPositionCloseVolume
   */
  const markPriceBase = useMemo<BigNumber>(() => {
    if (!position) return ZERO

    if (!position.isClosed) {
      return currentPositionPriceBase
    } else {
      const { totalBaseCloseVolume, totalPositionCloseVolume } = position

      return divideBignumbers(
        [BigNumber.from(totalBaseCloseVolume), 18],
        [BigNumber.from(totalPositionCloseVolume), 18]
      )
    }
  }, [currentPositionPriceBase, position])

  /**
   * Mark price (in USD)
   * if position open return markPriceBase (price for 1 position token)
   * otherwise return totalUSDCloseVolume/totalPositionCloseVolume
   */
  const markPriceUSD = useMemo<BigNumber>(() => {
    if (!position) return ZERO

    if (!position.isClosed) {
      return currentPositionPriceUSD
    } else {
      const { totalUSDCloseVolume, totalPositionCloseVolume } = position

      return divideBignumbers(
        [BigNumber.from(totalUSDCloseVolume), 18],
        [BigNumber.from(totalPositionCloseVolume), 18]
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
      return ZERO
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
      return ZERO
    }

    const priceDiff = subtractBignumbers(
      [markPriceUSD, 18],
      [entryPriceUSD, 18]
    )

    return multiplyBignumbers([priceDiff, 18], [positionVolume.big, 18])
  }, [markPriceUSD, entryPriceUSD, positionVolume])

  // get mark price
  useEffect(() => {
    if (!priceFeed) return
    ;(async () => {
      if (!position.proposal.token || !position.proposal.basicPool) return

      try {
        const amount = parseUnits("1", 18)

        // without extended
        const price = await priceFeed.getNormalizedExtendedPriceOut(
          position.proposal.token,
          position.proposal.basicPool.baseToken,
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
