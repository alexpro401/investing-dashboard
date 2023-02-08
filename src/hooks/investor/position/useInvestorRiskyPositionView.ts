import { BigNumber } from "@ethersproject/bignumber"
import { useMemo } from "react"

import { ZERO } from "consts"
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

interface IPayload {
  positionVolume: BigNumber
  entryPriceBase: BigNumber
  entryPriceUSD: BigNumber
  markPriceBase: BigNumber
  markPriceUSD: BigNumber
  pnlPercentage: BigNumber
  pnlBase: BigNumber
  pnlUSD: BigNumber
  positionToken: ITokenBase | null
  baseToken: ITokenBase | null
}

function useInvestorRiskyPositionView(position: any, utilityIds): [IPayload] {
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
  const positionVolume = useMemo<BigNumber>(() => {
    if (!position) return ZERO

    const { totalLP2OpenVolume, totalLP2CloseVolume } = position

    if (position.isClosed) {
      return BigNumber.from(totalLP2CloseVolume)
    }

    return subtractBignumbers(
      [BigNumber.from(totalLP2OpenVolume), 18],
      [BigNumber.from(totalLP2CloseVolume), 18]
    )
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
  const pnlPercentage = useMemo<BigNumber>(() => {
    if (!markPriceBase || !entryPriceBase) {
      return ZERO
    }

    return calcPositionPnlPercentage(markPriceBase, entryPriceBase)
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

    return multiplyBignumbers([priceDiff, 18], [positionVolume, 18])
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

    return multiplyBignumbers([priceDiff, 18], [positionVolume, 18])
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

export default useInvestorRiskyPositionView
