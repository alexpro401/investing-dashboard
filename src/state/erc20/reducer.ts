import { createReducer } from "@reduxjs/toolkit"

import { Token } from "interfaces"
import { addToken, removeToken } from "state/erc20/actions"

export interface IERC20State {
  [chainId: number]: {
    [address: string]: Token
  }
}

export const initialState: IERC20State = {}

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
