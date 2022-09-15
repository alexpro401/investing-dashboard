import { createSelector } from "@reduxjs/toolkit"
import { AppState } from "state"

const selectERC20State = (state: AppState) => state.erc20

export const selectERC20Data = (chainId, ERC20Address) => {
  const address = String(ERC20Address).toLocaleLowerCase()

  return createSelector([selectERC20State], (metadata) => {
    if (!metadata[chainId] || !metadata[chainId][address]) {
      return null
    }
    return metadata[chainId][address]
  })
}
