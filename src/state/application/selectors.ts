import { createSelector } from "@reduxjs/toolkit"
import { AppState } from "state"

const selectApplication = (state: AppState) => state.application

export const selectPayload = createSelector(
  [selectApplication],
  (app) => app.payload
)

export const selectError = createSelector(
  [selectApplication],
  (app) => app.error
)

export const selectIsTabBarHidden = createSelector(
  [selectApplication],
  (app) => app.isTabBarHidden
)
