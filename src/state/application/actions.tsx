import { createAction } from "@reduxjs/toolkit"
import { SubmitState } from "constants/types"

export const addToast = createAction<{ params: any }>("application/add-toast")

export const hideToast = createAction<{ params: any }>("application/hide-toast")

export const removeToast = createAction<{ params: any }>(
  "application/remove-toast"
)

export const updatePayload = createAction<{ params: SubmitState }>(
  "application/update-payload"
)

export const updateError = createAction<{ params: string }>(
  "application/update-error"
)

export const hideTapBar = createAction("application/hide-tap-bar")

export const showTabBar = createAction("application/show-tap-bar")
