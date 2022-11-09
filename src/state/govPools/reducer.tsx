import { createReducer } from "@reduxjs/toolkit"
import { IGovPoolQuery } from "interfaces/thegraphs/gov-pools"
import { reduce } from "lodash"

import { IPayload } from "interfaces"

import { addPools, setLoading } from "./actions"

export interface poolsState {
  payload: IPayload
  data: Record<string, IGovPoolQuery>
}

export const initialState: poolsState = {
  payload: {
    loading: true,
    error: null,
    updatedAt: null,
  },
  data: {},
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(addPools, (state, action) => {
      state.data = reduce(
        action.payload.data,
        (acc, pool) => {
          acc[pool.id] = pool
          return acc
        },
        state.data
      )

      state.payload.updatedAt = new Date().getTime()
    })
    .addCase(setLoading, (state, action) => {
      state.payload.loading = action.payload.loading
    })
)
