import { parseUnits } from "@ethersproject/units"
import { BigNumber } from "@ethersproject/bignumber"
import { useEffect, useMemo, useState } from "react"

import { ZERO } from "consts"
import { useERC20Data } from "state/erc20/hooks"
import { usePriceFeedContract } from "contracts"
import useTokenPriceOutUSD from "hooks/useTokenPriceOutUSD"
import {
  RiskyPositionPayload,
  WrappedPoolRiskyProposalPositionViewUtilityIds,
} from "interfaces/thegraphs/basic-pools"

import {
  divideBignumbers,
  subtractBignumbers,
  multiplyBignumbers,
  calcPositionPnlPercentage,
} from "utils/formulas"
import { ITokenBase } from "interfaces"

interface IPayload {
  positionVolume: BigNumber
  entryPriceBase: BigNumber
  entryPriceUSD: BigNumber
  markPriceBase: BigNumber
  markPriceUSD: BigNumber
  pnlPercentage: BigNumber
  pnlBase: BigNumber
  pnlUSD: BigNumber
  proposalToken: ITokenBase | null
  poolBaseToken: ITokenBase | null
}

function usePoolRiskyPositionView(
  position: RiskyPositionPayload,
  utilityIds: WrappedPoolRiskyProposalPositionViewUtilityIds
): [IPayload] {
  const [proposalToken] = useERC20Data(utilityIds.proposalTokenAddress)
  const [poolBaseToken] = useERC20Data(utilityIds.poolBaseTokenAddress)

  const priceFeed = usePriceFeedContract()

  const [currentPositionPriceBase, setCurrentPositionPriceBase] = useState(ZERO)
  const currentPositionPriceUSD = useTokenPriceOutUSD({
    tokenAddress: utilityIds.proposalTokenAddress,
  })

  /**
   * Position volume
   * if position.closed return totalPositionCloseVolume
   * otherwise return current position volume
   */
  const positionVolume = useMemo<BigNumber>(() => {
    if (!position) return ZERO

    const { totalPositionOpenVolume, totalPositionCloseVolume } = position

    if (position.isClosed) {
      return BigNumber.from(totalPositionCloseVolume)
    }

    return subtractBignumbers(
      [BigNumber.from(totalPositionOpenVolume), 18],
      [BigNumber.from(totalPositionCloseVolume), 18]
    )
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
  const pnlPercentage = useMemo<BigNumber>(() => {
    if (!markPriceBase || !entryPriceBase) return ZERO

    return calcPositionPnlPercentage(markPriceBase, entryPriceBase)
  }, [markPriceBase, entryPriceBase])

  /**
   * P&L (in poolBaseToken)
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

  // get mark price
  useEffect(() => {
    if (!priceFeed) return
    ;(async () => {
      if (
        !utilityIds.proposalTokenAddress ||
        !utilityIds.poolBaseTokenAddress
      ) {
        return
      }

      try {
        const amount = parseUnits("1", 18)

        // without extended
        const price = await priceFeed.getNormalizedExtendedPriceOut(
          utilityIds.proposalTokenAddress,
          utilityIds.poolBaseTokenAddress,
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
  }, [priceFeed, utilityIds])

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
      proposalToken,
      poolBaseToken,
    },
  ]
}

export default usePoolRiskyPositionView
