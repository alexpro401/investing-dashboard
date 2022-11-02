import { createSelector } from "@reduxjs/toolkit"
import { AppState } from "state"

const selectLists = (state: AppState) => state.lists

export const selectListsByUrl = createSelector(
  [selectLists],
  (lists) => lists.byUrl
)
