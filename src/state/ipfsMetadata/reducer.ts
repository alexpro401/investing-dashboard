import { createReducer } from "@reduxjs/toolkit"

import {
  IInvestProposalMetadata,
  InsuranceAccidentMetadata,
  IPoolMetadata,
  IUserMetadata,
} from "./types"
import {
  addPool,
  removePool,
  addUser,
  removeUser,
  addProposal,
  addInsuranceAccident,
} from "./actions"

export interface IpfsMetadataState {
  user: IUserMetadata | null
  pools: {
    [poolId: string]: {
      [hash: string]: IPoolMetadata
    }
  }
  proposals: {
    [poolId: string]: {
      [hash: string]: IInvestProposalMetadata
    }
  }
  insuranceAccidents: {
    [hash: string]: InsuranceAccidentMetadata
  }
}

export const initialState: IpfsMetadataState = {
  user: null,
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
      const { hash, ...userMeta } = params

      if (!state.user || state.user?.hash !== hash) {
        state.user = {
          ...userMeta,
          hash,
        }
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
    .addCase(removeUser, (state) => {
      state.user = null
    })
    .addCase(addInsuranceAccident, (state, { payload: { params } }) => {
      state.insuranceAccidents = {
        ...state.insuranceAccidents,
        [params.hash]: params,
      }
    })
)
