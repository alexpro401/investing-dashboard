import { createAction } from "@reduxjs/toolkit"
import { GasPriceResponse } from "api/gas-price/types"

// Update gas data
export const updateGasData = createAction<{
  chainId: number
  response: GasPriceResponse
}>("gas/update-gas-data")
