import { createSelector } from "@reduxjs/toolkit"
import { filter } from "lodash"

import { AppState } from "state"

const selectGovPoolsState = (state: AppState) => state.govPools

export const selectGovPools = createSelector(
  [selectGovPoolsState],
  (govPools) => govPools.data || {}
)

export const selectGovPoolsByNameSubstring = createSelector(
  [selectGovPools, (state, query: string) => query],
  (govPools, query) =>
    filter(
      govPools,
      (pool) =>
        String(pool.name).includes(query) ||
        String(pool.name).toLocaleLowerCase().includes(query) ||
        String(pool.name).includes(String(query).toLocaleLowerCase()) ||
        String(pool.name)
          .toLocaleLowerCase()
          .includes(String(query).toLocaleLowerCase())
    )
)

export const selectGovPoolByAddress = createSelector(
  [selectGovPools, (state, address: string | undefined) => address],
  (govPoolsData, address) =>
    govPoolsData[address?.toLowerCase() ?? ""] || undefined
)

export const selectPayload = createSelector(
  [selectGovPoolsState],
  (govPools) => govPools.payload
)
