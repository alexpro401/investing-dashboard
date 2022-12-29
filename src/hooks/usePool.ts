import { useCallback, useEffect, useState, useMemo } from "react"
import { BigNumber } from "@ethersproject/bignumber"
import { parseUnits } from "@ethersproject/units"
import { isEmpty, isNil } from "lodash"
import { useQuery } from "urql"
import { useSelector } from "react-redux"
import { Client } from "@urql/core/dist/types/client"

import { IPosition } from "interfaces/thegraphs/all-pools"
import { IPoolQuery } from "interfaces/thegraphs/all-pools"
import { ILeverageInfo } from "interfaces/contracts/ITraderPool"
import { IPoolInfo } from "interfaces/contracts/ITraderPool"
import { isAddress } from "utils"
import { PoolPositionLast, PoolQuery } from "queries"
import { PoolsByInvestorsQuery } from "queries/all-pools"
import { useTraderPoolContract } from "contracts"

import { ZERO } from "consts"
import { normalizeBigNumber } from "utils"
import usePoolPrice from "hooks/usePoolPrice"
import { useERC20Data } from "state/erc20/hooks"
import { usePriceFeedContract } from "contracts"
import {
  divideBignumbers,
  generateLockedFundsChartData,
  generatePoolPnlHistory,
  getLP,
  multiplyBignumbers,
} from "utils/formulas"
import { AppState } from "state"
import { selectPoolByAddress } from "state/pools/selectors"
import {
  TIMEFRAME_AGGREGATION_CODE,
  TIMEFRAME_FROM_DATE,
  TIMEFRAME_LIMIT_CODE,
  TIMEFRAME,
} from "consts/chart"
import { usePriceHistory } from "state/pools/hooks"
import { useAPI } from "api"

/**
 * Returns TheGraph info about the pool
 */
export function usePoolQuery(
  address: string | undefined,
  context?: Client
): [IPoolQuery | undefined, () => void] {
  const [pool, executeQuery] = useQuery<{
    traderPool: IPoolQuery
  }>({
    pause: !isAddress(address),
    query: PoolQuery,
    variables: { address },
    ...(!isNil(context) ? { context } : {}),
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
  const traderPool = useTraderPoolContract(address)
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
        const leverage = await traderPool.getLeverageInfo()
        const poolInfo = await traderPool.getPoolInfo()

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

  const { TokenAPI } = useAPI()

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

    const big = BigNumber.from(poolData.priceHistory[0].absPNLBase)

    return { big, format: normalizeBigNumber(big, 18, 6) }
  }, [poolData])

  const totalUSDPnlPerc = useMemo(() => {
    if (!poolData || !poolData.priceHistory || !poolData.priceHistory[0]) {
      return "0"
    }

    const big = BigNumber.from(poolData.priceHistory[0].percPNLUSD)
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
        const price = await TokenAPI.getHistoricalPrices(baseToken, [
          creationTime,
        ])

        setInitialPriceUSD(BigNumber.from(price[baseToken][creationTime]))
      } catch (error) {
        console.error(error)
      }
    })()
  }, [poolData, TokenAPI])

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

export const usePoolPriceHistory = (
  address: string | undefined,
  tf: TIMEFRAME
) => {
  const [history, fetching] = usePriceHistory(
    address,
    TIMEFRAME_AGGREGATION_CODE[tf],
    TIMEFRAME_LIMIT_CODE[tf],
    TIMEFRAME_FROM_DATE[tf]
  )

  return [generatePoolPnlHistory(history), fetching]
}

export const usePoolLockedFundsHistory = (
  address: string | undefined,
  tf: TIMEFRAME
) => {
  const [history, fetching] = usePriceHistory(
    address,
    TIMEFRAME_AGGREGATION_CODE[tf],
    TIMEFRAME_LIMIT_CODE[tf],
    TIMEFRAME_FROM_DATE[tf]
  )
  return [generateLockedFundsChartData(history), fetching]
}

export const usePoolPriceHistoryDiff = (priceHistoryFrom, priceHistoryTo) => {
  const initialPriceUSD = useMemo(() => {
    if (!priceHistoryFrom) return 0

    const { baseTVL, supply } = priceHistoryFrom
    return Number(getLP(String(baseTVL), String(supply)))
  }, [priceHistoryFrom])

  const currentPriceUSD = useMemo(() => {
    if (!priceHistoryTo) return 0

    const { baseTVL, supply } = priceHistoryTo
    return Number(getLP(String(baseTVL), String(supply)))
  }, [priceHistoryTo])

  const priceDiffUSD = useMemo(() => {
    if (!currentPriceUSD) return 0

    return currentPriceUSD - initialPriceUSD
  }, [currentPriceUSD, initialPriceUSD])

  return {
    initialPriceUSD,
    currentPriceUSD,
    priceDiffUSD,
  }
}
