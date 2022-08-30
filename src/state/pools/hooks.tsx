import { useState, useEffect, useCallback, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useQuery } from "urql"
import { BigNumber, FixedNumber } from "@ethersproject/bignumber"
import { parseEther } from "@ethersproject/units"

import { useTraderPoolRegistryContract } from "hooks/useContract"
import { AppDispatch, AppState } from "state"
import {
  addPools,
  setFilter,
  setLoading,
  setPagination,
} from "state/pools/actions"
import { selectActivePoolType, selectPoolsFilters } from "state/pools/selectors"

import { poolTypes } from "constants/index"

import { isAddress } from "utils"

import {
  IPoolQuery,
  IPriceHistoryQuery,
  IPriceHistory,
} from "constants/interfaces_v2"

import {
  OwnedPoolsQuery,
  ManagedPoolsQuery,
  PriceHistoryQuery,
  getPoolsQueryVariables,
} from "queries"

import { useTraderPool } from "hooks/usePool"

/**
 * Returns top members filter state variables and setter
 */
export function usePoolsFilters(): [
  AppState["pools"]["filters"],
  (name: string, value: string) => void
] {
  const filters = useSelector(selectPoolsFilters)

  const dispatch = useDispatch<AppDispatch>()
  const handleChange = (name, value) => dispatch(setFilter({ name, value }))

  return [filters, handleChange]
}

/**
 * Returns owned pools data
 */
export function useOwnedPools(
  address: string | null | undefined
): [IPoolQuery[], boolean] {
  const [pools, setPools] = useState<IPoolQuery[]>([])

  const [pool] = useQuery<{
    traderPools: IPoolQuery[]
  }>({
    pause: !isAddress(address),
    query: OwnedPoolsQuery,
    variables: { address },
  })

  useEffect(() => {
    if (pool.fetching || pool.error || !pool.data) return
    setPools(pool.data.traderPools)
  }, [pool])

  return [pools, pool.fetching]
}

/**
 * Returns managed pools data
 */
export function useManagedPools(
  address: string | null | undefined
): [IPoolQuery[], boolean] {
  const [pools, setPools] = useState<IPoolQuery[]>([])

  const [pool] = useQuery<{
    traderPools: IPoolQuery[]
  }>({
    pause: !isAddress(address),
    query: ManagedPoolsQuery,
    variables: { address },
  })

  useEffect(() => {
    if (pool.fetching || pool.error || !pool.data) return
    setPools(pool.data.traderPools)
  }, [pool])

  return [pools, pool.fetching]
}

/**
 * Returns map of pool price history
 */
export function usePriceHistory(
  address: string | undefined,
  timeframes: [number, number],
  limit = 1000,
  startDate: number
): IPriceHistory[] | undefined {
  const [history, setHistory] = useState<IPriceHistory[] | undefined>(undefined)
  const [pool] = useQuery<{
    traderPool: IPriceHistoryQuery
  }>({
    query: PriceHistoryQuery(startDate),
    variables: {
      address,
      minTimeframe: timeframes[0],
      maxTimeframe: timeframes[1],
      limit,
      startDate,
    },
    requestPolicy: "network-only",
  })

  useEffect(() => {
    if (
      !pool ||
      !pool.data ||
      !pool.data.traderPool ||
      !pool.data.traderPool.priceHistory
    )
      return

    setHistory(pool.data.traderPool.priceHistory)
  }, [pool])

  return history
}

export function usePoolPrice(address: string | undefined) {
  const traderPool = useTraderPool(address)
  const [priceUSD, setPriceUSD] = useState(parseEther("1"))
  const [priceBase, setPriceBase] = useState(parseEther("1"))

  useEffect(() => {
    if (!traderPool) return
    ;(async () => {
      const poolInfo = await traderPool.getPoolInfo()
      if (poolInfo.lpSupply.gt("0")) {
        const base = FixedNumber.fromValue(poolInfo.totalPoolBase, 18)
        const usd = FixedNumber.fromValue(poolInfo.totalPoolUSD, 18)
        const supply = FixedNumber.fromValue(poolInfo.lpSupply, 18)

        const usdPrice = usd.divUnsafe(supply)
        const basePrice = base.divUnsafe(supply)
        setPriceUSD(BigNumber.from(usdPrice._hex))
        setPriceBase(BigNumber.from(basePrice._hex))
      }
    })()
  }, [traderPool])

  return { priceUSD, priceBase }
}

export function usePoolsCounter() {
  const [, setUpdate] = useState(false)
  const updateRef = useRef(false)
  const dispatch = useDispatch<AppDispatch>()
  const traderPoolRegistry = useTraderPoolRegistryContract()

  const handleUpdate = useCallback(() => {
    updateRef.current = !updateRef.current
    setUpdate(updateRef.current)
  }, [])

  // Fetch total number of pools
  useEffect(() => {
    if (!traderPoolRegistry || !dispatch) return
    ;(async () => {
      const basicPoolsLength = await traderPoolRegistry.countPools(
        poolTypes.basic
      )
      dispatch(
        setPagination({
          name: "total",
          type: "BASIC_POOL",
          value: Number(basicPoolsLength.toString()),
        })
      )
      const investPoolsLength = await traderPoolRegistry.countPools(
        poolTypes.invest
      )
      dispatch(
        setPagination({
          name: "total",
          type: "INVEST_POOL",
          value: Number(investPoolsLength.toString()),
        })
      )
    })()
  }, [traderPoolRegistry, dispatch])

  return handleUpdate
}

// Hook that handles fetching and storing pools
// @param poolType - type of pool to fetch (all, basic, invest)
// @return loading indicator of pools
// @return loadMore function to start fetching new batch of pools
export function usePools(): () => void {
  const poolType = useSelector(selectActivePoolType)
  const dispatch = useDispatch<AppDispatch>()

  const filters = useSelector(selectPoolsFilters)

  const queryArgs = getPoolsQueryVariables(filters, poolType)

  const [response, handleMore] = useQuery<{
    traderPools: IPoolQuery[]
  }>(queryArgs)

  useEffect(() => {
    if (!dispatch) return
    dispatch(setLoading({ loading: response.fetching }))
  }, [response.fetching, dispatch])

  // Store pools to redux
  useEffect(() => {
    if (!dispatch || !response || !response.data || response.fetching) return

    dispatch(
      addPools({
        data: response.data.traderPools,
        type: poolType,
      })
    )
  }, [response, dispatch, poolType])

  return handleMore
}
