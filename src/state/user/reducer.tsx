/* eslint-disable @typescript-eslint/no-unused-vars */
import { createReducer } from "@reduxjs/toolkit"

import {
  addOwnedPools,
  updateUserProMode,
  changeTermsAgreed,
  showAgreementModal,
  addSerializedToken,
  removeSerializedToken,
} from "./actions"
import { IUserState } from "./types"

export const initialState: IUserState = {
  data: null,

  userProMode: false,
  loading: true,
  ownedPools: {
    basic: [],
    invest: [],
  },
  terms: {
    agreed: false,
    showAgreement: false,
  },
  tokens: {},
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateUserProMode, (state) => {
      state.userProMode = !state.userProMode
    })
    .addCase(addOwnedPools, (state, action) => {
      state.ownedPools.basic = action.payload.basic.map((v) =>
        v.toLocaleLowerCase()
      )
      state.ownedPools.invest = action.payload.invest.map((v) =>
        v.toLocaleLowerCase()
      )
      state.loading = false
    })
    .addCase(changeTermsAgreed, (state, action) => {
      state.terms.agreed = action.payload.agreed
    })
    .addCase(showAgreementModal, (state, action) => {
      state.terms.showAgreement = action.payload.show
    })
    .addCase(addSerializedToken, (state, { payload: { serializedToken } }) => {
      if (!state.tokens) {
        state.tokens = {}
      }
      state.tokens[serializedToken.chainId] =
        state.tokens[serializedToken.chainId] || {}
      state.tokens[serializedToken.chainId][serializedToken.address] =
        serializedToken
    })
    .addCase(
      removeSerializedToken,
      (state, { payload: { address, chainId } }) => {
        if (!state.tokens) {
          state.tokens = {}
        }
        state.tokens[chainId] = state.tokens[chainId] || {}
        delete state.tokens[chainId][address]
      }
    )
)
