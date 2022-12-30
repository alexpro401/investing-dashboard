import { createAction } from "@reduxjs/toolkit"
import { PoolType } from "consts/types"
import { IPoolQuery } from "interfaces/thegraphs/all-pools"

export const setFilter = createAction<{ name: string; value: any }>(
  "pools/set-filter"
)

export const setPagination = createAction<{
  name: string
  type: PoolType
  value: any
}>("pools/set-pagination")

export const addPools = createAction<{
  data: IPoolQuery[] | undefined
  type: PoolType
}>("pools/add-pools")

export const setActivePoolType = createAction<{ type: PoolType }>(
  "pools/set-active-pool-type"
)

export const setLoading = createAction<{ loading: boolean }>(
  "pools/set-loading"
)
