import { createReducer, nanoid } from "@reduxjs/toolkit"

import { DEFAULT_TXN_DISMISS_MS } from "consts/misc"
import { SubmitState } from "consts/types"
import {
  addToast,
  hideTapBar,
  hideToast,
  removeToast,
  showTabBar,
  updateError,
  updatePayload,
} from "./actions"
import { ToastContent } from "./types"

type ToastList = Array<{
  key: string
  show: boolean
  visible: boolean
  content: ToastContent
  removeAfterMs: number | null
}>

export interface ApplicationState {
  readonly toastList: ToastList
  readonly payload: SubmitState
  readonly error: string
  readonly isTabBarHidden: boolean
}

export const initialState: ApplicationState = {
  toastList: [],
  payload: SubmitState.IDLE,
  error: "",
  isTabBarHidden: false,
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(addToast, (state, { payload }) => {
      const {
        content,
        key,
        removeAfterMs = DEFAULT_TXN_DISMISS_MS,
      } = payload.params

      state.toastList = (
        key
          ? state.toastList.filter((toast) => toast.key !== key)
          : state.toastList
      ).concat([
        {
          key: content.wait ? `${key}-wait` || nanoid() : key || nanoid(),
          show: true,
          visible: true,
          content,
          removeAfterMs,
        },
      ])
    })
    .addCase(hideToast, (state, { payload }) => {
      const { key } = payload.params

      state.toastList.forEach((t) => {
        if (t.key === key) {
          t.visible = false
        }
      })
    })
    .addCase(removeToast, (state, { payload }) => {
      const { key } = payload.params

      state.toastList.forEach((t) => {
        if (t.key === key) {
          t.show = false
        }
      })
    })
    .addCase(updatePayload, (state, { payload }) => {
      state.payload = payload.params
    })
    .addCase(updateError, (state, { payload }) => {
      state.error = payload.params
    })
    .addCase(hideTapBar, (state, {}) => {
      state.isTabBarHidden = true
    })
    .addCase(showTabBar, (state, {}) => {
      state.isTabBarHidden = false
    })
)
