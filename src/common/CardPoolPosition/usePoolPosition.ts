import { parseUnits } from "@ethersproject/units"
import { BigNumber } from "@ethersproject/bignumber"
import { useCallback, useEffect, useMemo, useState } from "react"

import { ZERO } from "consts"
import { useERC20Data } from "state/erc20/hooks"
import { IPosition } from "interfaces/thegraphs/all-pools"
import useTokenPriceOutUSD from "hooks/useTokenPriceOutUSD"
import { usePoolRegistryContract, usePriceFeedContract } from "contracts"

import {
  divideBignumbers,
  subtractBignumbers,
  multiplyBignumbers,
  calcPositionPnlPercentage,
} from "utils/formulas"
import { ITokenBase } from "interfaces"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import { usePoolContract } from "hooks"

interface IPayload {
  currentPositionVolume: BigNumber
  entryPriceBase: BigNumber
  entryPriceUSD: BigNumber
  markPriceBase: BigNumber
  markPriceUSD: BigNumber
  pnlPercentage: BigNumber
  pnlBase: BigNumber
  pnlUSD: BigNumber
  positionToken: ITokenBase | null
  baseToken: ITokenBase | null
  poolMetadata: any
  poolType: string | null
}

function usePoolPosition(position: IPosition): [IPayload] {
  const priceFeed = usePriceFeedContract()
  const traderPoolRegistry = usePoolRegistryContract()
  const [positionToken] = useERC20Data(position.positionToken)
  const [baseToken] = useERC20Data(position.traderPool.baseToken)
  const [, poolInfo] = usePoolContract(position.traderPool.id)

  const [{ poolMetadata }] = usePoolMetadata(
    position.traderPool.id,
    poolInfo?.parameters.descriptionURL
  )

  const currentPriceUSD = useTokenPriceOutUSD({
    tokenAddress: position.positionToken,
  })

  // STATE DATA
  const [markPrice, setMarkPriceBase] = useState<BigNumber>(ZERO)
  const [poolType, setPoolType] = useState<string | null>(null)

  // MEMOIZED DATA
  /**
   * Current position amount in position token
   *
   * closed ? totalPositionCloseVolume : totalPositionOpenVolume - totalPositionCloseVolume
   */
  const currentPositionVolume = useMemo<BigNumber>(() => {
    if (!position) return ZERO

    const { totalPositionOpenVolume, totalPositionCloseVolume } = position

    if (position.closed) {
      return BigNumber.from(totalPositionCloseVolume)
    }

    return subtractBignumbers(
      [BigNumber.from(totalPositionOpenVolume), 18],
      [BigNumber.from(totalPositionCloseVolume), 18]
    )
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
  const pnlPercentage = useMemo<BigNumber>(() => {
    if (!markPriceBase || !entryPriceBase || entryPriceBase.isZero()) {
      return ZERO
    }

    return calcPositionPnlPercentage(markPriceBase, entryPriceBase)
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

    return multiplyBignumbers([priceDiff, 18], [currentPositionVolume, 18])
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

    return multiplyBignumbers([priceDiff, 18], [currentPositionVolume, 18])
  }, [markPriceUSD, entryPriceUSD, currentPositionVolume])

  const getPoolType = useCallback(async () => {
    if (!traderPoolRegistry || !position.traderPool.id) return null

    try {
      const isBasicPool = await traderPoolRegistry.isBasicPool(
        position.traderPool.id
      )
      return isBasicPool ? "BASIC_POOL" : "INVEST_POOL"
    } catch (error) {
      console.error(error)
      return null
    }
  }, [traderPoolRegistry, position])

  useEffect(() => {
    getPoolType().then((res) => setPoolType(res))
  }, [getPoolType])

  const getPositionTokenPrice = useCallback(async () => {
    if (!priceFeed || !position || position.closed) return ZERO

    try {
      const amount = parseUnits("1", 18)
      const { positionToken, traderPool } = position

      const price = await priceFeed.getNormalizedExtendedPriceOut(
        positionToken,
        traderPool.baseToken,
        amount,
        []
      )
      return price.amountOut
    } catch (error) {
      console.error(error)
      return ZERO
    }
  }, [position, priceFeed])

  useEffect(() => {
    getPositionTokenPrice().then((res) => setMarkPriceBase(res))
  }, [getPositionTokenPrice])

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
      poolMetadata,
      poolType,
    },
  ]
}

export default usePoolPosition
