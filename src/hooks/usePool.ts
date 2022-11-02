import { useCallback, useEffect, useState, useMemo } from "react"
import { BigNumber } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { parseUnits } from "@ethersproject/units"
import { isEmpty } from "lodash"
import axios from "axios"

import { IPosition } from "interfaces/thegraphs/all-pools"
import { IPoolQuery } from "interfaces/thegraphs/all-pools"
import { ILeverageInfo } from "interfaces/contracts/ITraderPool"
import { IPoolInfo } from "interfaces/contracts/ITraderPool"
import useContract from "hooks/useContract"
import { useQuery } from "urql"
import { isAddress } from "utils"
import { TraderPool } from "abi"
import { PoolPositionLast, PoolQuery } from "queries"
import { PoolsByInvestorsQuery } from "queries/all-pools"

import { ZERO } from "constants/index"
import { normalizeBigNumber } from "utils"
import usePoolPrice from "hooks/usePoolPrice"
import { useERC20Data } from "state/erc20/hooks"
import { usePriceFeedContract } from "contracts"
import { divideBignumbers, multiplyBignumbers } from "utils/formulas"
import { useSelector } from "react-redux"
import { AppState } from "state"
import { selectPoolByAddress } from "state/pools/selectors"

export function useTraderPool(address: string | undefined): Contract | null {
  const traderPool = useContract(address, TraderPool)

  return traderPool
}

/**
 * Returns TheGraph info about the pool
 */
export function usePoolQuery(
  address: string | undefined
): [IPoolQuery | undefined, () => void] {
  const [pool, executeQuery] = useQuery<{
    traderPool: IPoolQuery
  }>({
    pause: !isAddress(address),
    query: PoolQuery,
    variables: { address },
  })

  return [pool.data?.traderPool, executeQuery]
}

/**
 * Returns TheGraph info about specified position
 */
export function usePoolPosition(poolId, tokenId) {
  const [position, setPosition] = useState<IPosition | undefined>()

  const [pool] = useQuery<{
    positions: IPosition[]
  }>({
    query: PoolPositionLast,
    variables: { poolId, tokenId },
  })

  useEffect(() => {
    if (!pool || !pool.data || !pool.data.positions) return

    setPosition(pool.data.positions[0])
  }, [pool])

  return position
}

/**
 * Returns Contract info about the pool
 */
export function usePoolContract(
  address: string | undefined
): [ILeverageInfo | null, IPoolInfo | null, () => void] {
  const traderPool = useTraderPool(address)
  const [update, setUpdate] = useState(false)
  const [leverageInfo, setLeverageInfo] = useState<ILeverageInfo | null>(null)
  const [poolInfo, setPoolInfo] = useState<IPoolInfo | null>(null)

  const fetchUpdate = useCallback(() => {
    setUpdate(!update)
  }, [update])

  useEffect(() => {
    if (!traderPool) return
    ;(async () => {
      try {
        const leverage = await traderPool?.getLeverageInfo()
        const poolInfo = await traderPool?.getPoolInfo()

        setPoolInfo(poolInfo)
        setLeverageInfo(leverage)
      } catch (e) {
        // console.log(e)
      }
    })()
  }, [traderPool, update])

  return [leverageInfo, poolInfo, fetchUpdate]
}

/**
 * Returns TheGraph info about the pool
 */
export function usePoolsByInvestors(investors: string[]) {
  return useQuery<{ traderPools: IPoolQuery[] }>({
    pause: !investors || isEmpty(investors),
    query: PoolsByInvestorsQuery,
    variables: {
      investors,
    },
  })
}

export const usePoolPnlInfo = (address: string | undefined) => {
  const priceFeed = usePriceFeedContract()

  const poolData = useSelector((s: AppState) => selectPoolByAddress(s, address))

  const [{ priceUSD }] = usePoolPrice(address)
  const [baseToken] = useERC20Data(poolData?.baseToken)

  const [_baseTokenPrice, _setBaseTokenPrice] = useState<BigNumber>(ZERO)

  const [initialPriceUSD, setInitialPriceUSD] = useState(ZERO)

  const totalPnlPercentage = useMemo(() => {
    if (initialPriceUSD.isZero() || !priceUSD) {
      return "0"
    }

    const d = multiplyBignumbers([priceUSD, 18], [BigNumber.from(100), 18])
    const r = divideBignumbers([d, 18], [initialPriceUSD, 18])
    return normalizeBigNumber(r, 18, 2)
  }, [initialPriceUSD, priceUSD])

  interface IAmount {
    big: BigNumber
    format: string
  }
  const totalPnlBase = useMemo<IAmount>(() => {
    if (!poolData || !poolData.priceHistory || !poolData.priceHistory[0]) {
      return { big: ZERO, format: "0" }
    }

    const big = BigNumber.from(poolData.priceHistory[0].absPNL)

    return { big, format: normalizeBigNumber(big, 18, 6) }
  }, [poolData])

  const totalUSDPnlPerc = useMemo(() => {
    if (!poolData || !poolData.priceHistory || !poolData.priceHistory[0]) {
      return "0"
    }

    const big = BigNumber.from(poolData.priceHistory[0].percPNL)
    return normalizeBigNumber(big, 4, 2)
  }, [poolData])

  const totalUSDPnlUSD = useMemo(() => {
    if (
      !_baseTokenPrice ||
      !totalPnlBase ||
      totalPnlBase.big.isZero() ||
      _baseTokenPrice.isZero()
    ) {
      return "0"
    }

    const isNegative = totalPnlBase.big.isNegative()

    const big = divideBignumbers(
      [totalPnlBase.big.abs(), 18],
      [_baseTokenPrice, 18]
    )

    const withSign = isNegative ? big.mul(-1) : big

    return normalizeBigNumber(withSign, 18, 2)
  }, [_baseTokenPrice, totalPnlBase])

  useEffect(() => {
    if (!poolData) return
    ;(async () => {
      try {
        const { baseToken, creationTime } = poolData
        const price = await axios.get(
          `https://api-staging.kattana.trade/historical_price/${baseToken}/${creationTime}`
        )

        setInitialPriceUSD(BigNumber.from(price[baseToken][creationTime]))
      } catch (error) {
        console.error(error)
      }
    })()
  }, [poolData])

  // Fetch price of base token
  useEffect(() => {
    if (!priceFeed || !baseToken) return
    ;(async () => {
      try {
        const amount = parseUnits("1", 18)
        const price = await priceFeed.getNormalizedPriceOutUSD(
          baseToken.address,
          amount
        )
        if (price && price.amountOut) {
          _setBaseTokenPrice(price.amountOut)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [priceFeed, baseToken])

  return [
    { poolData, baseToken },
    { totalPnlPercentage, totalPnlBase, totalUSDPnlPerc, totalUSDPnlUSD },
  ]
}
