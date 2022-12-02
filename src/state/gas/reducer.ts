import { createReducer } from "@reduxjs/toolkit"
import { GasPriceResponse } from "api/gas-price/types"
import { updateGasData } from "./actions"

export interface GasState {
  [chainId: number]: GasPriceResponse
}

export const initialState: GasState = {}

export default createReducer(initialState, (builder) =>
  builder.addCase(updateGasData, (state, action) => {
    state[action.payload.chainId] = action.payload.response
  })
)
