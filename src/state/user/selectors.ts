import { createSelector } from "@reduxjs/toolkit"
import { AppState } from "state"
import { filter, isEmpty, isNil } from "lodash"

const selectUser = (state: AppState) => state.user
const selectPools = (state: AppState) => state.pools

export const selectOwnedPools = createSelector(
  [selectUser],
  (user) => user.ownedPools
)

export const selectInvolvedPools = (account) =>
  createSelector([selectUser, selectPools], (user, pools) => {
    const ownedAddresses = [...user.ownedPools.invest, ...user.ownedPools.basic]

    if (isNil(account)) return { owned: [], managed: [] }
    if (isEmpty(ownedAddresses)) return { owned: [], managed: [] }
    if (isEmpty(pools.ALL_POOL)) return { owned: [], managed: [] }

    const owned = filter(pools.ALL_POOL, function (pool) {
      return ownedAddresses.includes(pool.id)
    })

    const managed = filter(pools.ALL_POOL, function (pool) {
      return pool.admins.includes(account)
    })

    return { owned, managed }
  })

export const selectLoadingState = createSelector(
  [selectUser],
  (user) => user.loading
)

export const selectTermsState = createSelector(
  [selectUser],
  (user) => user.terms
)
