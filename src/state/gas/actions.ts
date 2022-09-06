import { createAction } from "@reduxjs/toolkit"
import { GasPriceResponse } from "interfaces/explorer"

// Update gas data
export const updateGasData = createAction<{
  chainId: number
  response: GasPriceResponse
}>("gas/update-gas-data")
