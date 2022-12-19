import { createReducer } from "@reduxjs/toolkit"
import { ChainMainTokenData } from "constants/chains"

import { Token } from "interfaces"
import { addToken, removeToken } from "state/erc20/actions"

export interface IERC20State {
  [chainId: number]: {
    [address: string]: Token
  }
}

export const initialState: IERC20State = {
  97: {
    [process.env.REACT_APP_MAIN_ASSET_ADDRESS as string]:
      ChainMainTokenData[97],
  },
  56: {
    [process.env.REACT_APP_MAIN_ASSET_ADDRESS as string]:
      ChainMainTokenData[56],
  },
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(addToken, (state, { payload: { params } }) => {
      const { chainId, ...token } = params

      if (!state[chainId]) {
        state[chainId] = {
          [token.address]: token,
        }
      } else if (!state[chainId][token.address]) {
        state[chainId][token.address] = token
      }
    })
    .addCase(removeToken, (state, { payload: { params } }) => {
      const { chainId, address } = params

      if (state[chainId] && state[chainId][address]) {
        delete state[chainId][address]
      }
    })
)
