import { useState, useEffect, useCallback, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useQuery } from "urql"

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

import { isAddress, getPoolsQueryVariables } from "utils"

import {
  IPoolQuery,
  IPriceHistoryQuery,
  IPriceHistory,
} from "interfaces/thegraphs/all-pools"

import { OwnedPoolsQuery, ManagedPoolsQuery, PriceHistoryQuery } from "queries"

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

export function useUserInvolvedPools(
  address: string | null | undefined
): [{ ownedPools: IPoolQuery[]; managedPools: IPoolQuery[] }, boolean] {
  const [ownedPools, ownedLoading] = useOwnedPools(address)
  const [managedPools, managedLoading] = useManagedPools(address)

  return [{ ownedPools, managedPools }, ownedLoading || managedLoading]
}

/**
 * Returns map of pool price history
 */
export function usePriceHistory(
  address: string | undefined,
  timeframes: [number, number],
  limit = 1000,
  startDate: number,
  block?: number
): [IPriceHistory[] | undefined, boolean, () => void] {
  const [history, setHistory] = useState<IPriceHistory[] | undefined>(undefined)
  const [pool, update] = useQuery<{
    traderPool: IPriceHistoryQuery
  }>({
    query: PriceHistoryQuery(startDate, block),
    variables: {
      address,
      minTimeframe: timeframes[0],
      maxTimeframe: timeframes[1],
      limit,
      startDate,
      block,
    },
    requestPolicy: "network-only",
    pause: !address || !startDate,
  })

  useEffect(() => {
    if (
      !pool ||
      !pool.data ||
      !pool.data.traderPool ||
      !pool.data.traderPool.priceHistory
    ) {
      return
    }

    setHistory(pool.data.traderPool.priceHistory)
  }, [pool])

  return [history, pool.fetching, update]
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
