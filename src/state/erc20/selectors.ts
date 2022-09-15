import { createSelector } from "@reduxjs/toolkit"
import { AppState } from "state"

const selectERC20State = (state: AppState) => state.erc20

export const selectERC20Data = (chainId, ERC20Address) =>
  createSelector([selectERC20State], (metadata) => {
    if (!metadata[chainId] || !metadata[chainId][ERC20Address]) {
      return null
    }
    return metadata[chainId][ERC20Address]
  })
