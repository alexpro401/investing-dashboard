import { createSelector } from "@reduxjs/toolkit"
import { AppState } from "state"

const selectUser = (state: AppState) => state.user

export const selectOwnedPools = createSelector(
  [selectUser],
  (user) => user.ownedPools
)

export const selectLoadingState = createSelector(
  [selectUser],
  (user) => user.loading
)

export const selectTermsState = createSelector(
  [selectUser],
  (user) => user.terms
)

export const selectUserTokens = createSelector(
  [selectUser],
  (user) => user.tokens
)
