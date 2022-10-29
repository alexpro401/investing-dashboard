import { createSelector } from "@reduxjs/toolkit"
import { AppState } from "state"
import { filter, forEach, isEmpty, isNil } from "lodash"
import { addBignumbers, getLastInArray } from "utils/formulas"
import { ZERO } from "constants/index"
import { BigNumber } from "@ethersproject/bignumber"

const selectUser = (state: AppState) => state.user
const selectPools = (state: AppState) => state.pools

export const selectOwnedPools = createSelector(
  [selectUser],
  (user) => user.ownedPools
)

export const selectOwnedPoolsData = createSelector(
  [selectUser, selectPools],
  (user, pools) => {
    const ownedAddresses = [...user.ownedPools.invest, ...user.ownedPools.basic]

    if (isEmpty(ownedAddresses)) return []
    if (isEmpty(pools.ALL_POOL)) return []

    return filter(pools.ALL_POOL, function (pool) {
      return ownedAddresses.includes(pool.id)
    })
  }
)

export const selectTotalOwnedPoolsStatistic = createSelector(
  [selectUser, selectPools],
  (user, pools) => {
    const state = {
      usdTVL: ZERO,
      APY: 0,
      percPNL: 0,
      investorsCount: 0,
    }
    const ownedAddresses = [...user.ownedPools.invest, ...user.ownedPools.basic]
    if (isEmpty(ownedAddresses) || isEmpty(pools.ALL_POOL)) return state

    const ownedPools = filter(pools.ALL_POOL, function (pool) {
      return ownedAddresses.includes(pool.id)
    })

    forEach(ownedPools, function (pool) {
      const lastHistoryPoint = getLastInArray(pool.priceHistory)

      if (isNil(lastHistoryPoint)) return

      state.usdTVL = addBignumbers(
        [BigNumber.from(lastHistoryPoint.usdTVL), 18],
        [state.usdTVL, 18]
      )
      state.APY += Number(lastHistoryPoint.APY)
      state.percPNL += Number(lastHistoryPoint.percPNL)
      state.investorsCount += Number(pool.investorsCount)
    })

    return state
  }
)

export const selectInvolvedPoolsData = (account) =>
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
