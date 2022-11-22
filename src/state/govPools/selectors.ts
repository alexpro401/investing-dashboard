import { createSelector } from "@reduxjs/toolkit"
import { filter } from "lodash"

import { AppState } from "state"
import { IGovPoolQuery } from "interfaces/thegraphs/gov-pools"

const selectGovPoolsState = (state: AppState) => state.govPools

export const selectGovPools = createSelector(
  [selectGovPoolsState],
  (govPools) => (govPools.data || {}) as Record<string, IGovPoolQuery>
)

export const selectGovPoolsByNameSubstring = createSelector(
  [selectGovPools, (state, query: string) => query],
  (govPools, query) =>
    filter(
      govPools,
      (pool) =>
        String(pool.name)
          .toLocaleLowerCase()
          .includes(String(query).toLocaleLowerCase()) ||
        String(pool.id)
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
