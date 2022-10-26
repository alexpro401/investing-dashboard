import { createReducer } from "@reduxjs/toolkit"

import { IInvestProposalMetadata, IPoolMetadata, IUserMetadata } from "./types"
import {
  addPool,
  removePool,
  addUser,
  removeUser,
  addProposal,
  addInsuranceAccident,
} from "./actions"
import { InsuranceAccident } from "interfaces/insurance"

export interface IpfsMetadataState {
  user: Record<string, IUserMetadata | null>
  pools: Record<string, Record<string, IPoolMetadata>>
  proposals: Record<string, Record<string, IInvestProposalMetadata>>
  insuranceAccidents: Record<string, InsuranceAccident>
}

export const initialState: IpfsMetadataState = {
  user: {},
  pools: {},
  proposals: {},
  insuranceAccidents: {},
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(addPool, (state, { payload }) => {
      const {
        params: { poolId, hash, ...poolMeta },
      } = payload
      if (!state.pools[poolId] || !state.pools[poolId][hash]) {
        state.pools[poolId] = {
          [hash]: { ...poolMeta },
        }
      }
    })
    .addCase(removePool, (state, { payload: { params } }) => {
      const { poolId } = params

      if (state.pools[poolId]) {
        delete state.pools[poolId]
      }
    })
    .addCase(addUser, (state, { payload: { params } }) => {
      const { account } = params
      state.user = {
        ...state.user,
        [account]: {
          ...params,
        },
      }
    })
    .addCase(addProposal, (state, { payload: { params } }) => {
      const { hash, poolId, data } = params

      state.proposals = {
        ...state.proposals,
        [poolId]: {
          [hash]: data,
        },
      }
    })
    .addCase(removeUser, (state, { payload: { params } }) => {
      const { account } = params
      delete state.user[account]
    })
    .addCase(addInsuranceAccident, (state, { payload: { params } }) => {
      state.insuranceAccidents = {
        ...state.insuranceAccidents,
        [params.hash]: params.data,
      }
    })
)
