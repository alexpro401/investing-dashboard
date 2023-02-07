import { BigNumber } from "@ethersproject/bignumber"
import { useMemo } from "react"

import { ZERO } from "consts"
import { normalizeBigNumber } from "utils"
import { useERC20Data } from "state/erc20/hooks"

import {
  divideBignumbers,
  subtractBignumbers,
  multiplyBignumbers,
  calcPositionPnlPercentage,
} from "utils/formulas"
import { ITokenBase } from "interfaces"
import usePoolPrice from "hooks/usePoolPrice"
import useRiskyPrice from "hooks/useRiskyPrice"
import { useRiskyPosition } from "hooks"

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

function useRiskyPositionView(position: any, utilityIds): [IPayload] {
  const data = useRiskyPosition({
    proposalAddress: utilityIds.proposalContractAddress,
    proposalId: String(utilityIds.proposalId),
    closed: position.isClosed,
  })

  const [positionToken] = useERC20Data(data?.proposal?.token)
  const [baseToken] = useERC20Data(utilityIds.poolBaseTokenAddress)

  const [{ priceBase: PoolPriceBase, priceUSD: PoolPriceUSD }] = usePoolPrice(
    utilityIds.poolAddress
  )

  const { priceBase: RiskyPriceBase, priceUSD: RiskyPriceUSD } = useRiskyPrice(
    utilityIds.poolAddress,
    utilityIds.proposalId
  )

  /**
   * Position volume
   * if position.closed return totalLP2CloseVolume
   * otherwise return current position volume
   */
  const positionVolume = useMemo<IAmount>(() => {
    if (!position) return INITIAL_AMOUNT

    const { totalLP2OpenVolume, totalLP2CloseVolume } = position

    if (position.isClosed) {
      return {
        big: BigNumber.from(totalLP2CloseVolume),
        format: normalizeBigNumber(BigNumber.from(totalLP2CloseVolume)),
      }
    }

    const big = subtractBignumbers(
      [BigNumber.from(totalLP2OpenVolume), 18],
      [BigNumber.from(totalLP2CloseVolume), 18]
    )
    return { big, format: normalizeBigNumber(big) }
  }, [position])

  /**
   * Entry price (in fund base token)
   * totalBaseOpenVolume/totalLP2OpenVolume
   */
  const entryPriceBase = useMemo<BigNumber>(() => {
    if (!position) return ZERO

    const { totalBaseOpenVolume, totalLP2OpenVolume } = position
    return divideBignumbers(
      [BigNumber.from(totalBaseOpenVolume), 18],
      [BigNumber.from(totalLP2OpenVolume), 18]
    )
  }, [position])

  /**
   * Entry price (in USD)
   * totalUSDOpenVolume/totalLP2OpenVolume
   */
  const entryPriceUSD = useMemo<BigNumber>(() => {
    if (!position) return ZERO

    const { totalUSDOpenVolume, totalLP2OpenVolume } = position

    return divideBignumbers(
      [BigNumber.from(totalUSDOpenVolume), 18],
      [BigNumber.from(totalLP2OpenVolume), 18]
    )
  }, [position])

  /**
   * Mark price (in fund base token)
   * if position open return currentPositionPriceBase (price for 1 position token)
   * otherwise return totalBaseCloseVolume/totalLP2CloseVolume
   */
  const markPriceBase = useMemo<BigNumber>(() => {
    if (!position) return ZERO

    if (!position.isClosed) {
      return divideBignumbers([RiskyPriceBase, 18], [PoolPriceBase, 18])
    } else {
      const { totalBaseCloseVolume, totalLP2CloseVolume } = position

      return divideBignumbers(
        [BigNumber.from(totalBaseCloseVolume), 18],
        [BigNumber.from(totalLP2CloseVolume), 18]
      )
    }
  }, [RiskyPriceBase, PoolPriceBase, position])

  /**
   * Mark price (in USD)
   * if position open return markPriceBase (price for 1 position token)
   * otherwise return totalUSDCloseVolume/totalLP2CloseVolume
   */
  const markPriceUSD = useMemo<BigNumber>(() => {
    if (!position) return ZERO

    if (!position.isClosed) {
      return divideBignumbers([RiskyPriceUSD, 18], [PoolPriceUSD, 18])
    } else {
      const { totalUSDCloseVolume, totalLP2CloseVolume } = position

      return divideBignumbers(
        [BigNumber.from(totalUSDCloseVolume), 18],
        [BigNumber.from(totalLP2CloseVolume), 18]
      )
    }
  }, [RiskyPriceUSD, PoolPriceUSD, position])

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

export default useRiskyPositionView
