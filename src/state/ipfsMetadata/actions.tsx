import { createAction } from "@reduxjs/toolkit"

import { IInvestProposalMetadata, IPoolMetadata, IUserMetadata } from "./types"
import { InsuranceAccident } from "interfaces/insurance"

interface IAddPool extends IPoolMetadata {
  poolId: string
  hash: string
}
// Add pools data
export const addPool = createAction<{ params: IAddPool }>("ipfs/add-pool")

interface IRemovePool {
  poolId: string
}
// Update pool data
export const removePool = createAction<{ params: IRemovePool }>(
  "ipfs/remove-pool"
)

// Add user data
export const addUser = createAction<{ params: IUserMetadata }>("ipfs/add-user")

// Update user data
export const removeUser = createAction<{ params: { account: string } }>(
  "ipfs/remove-user"
)

// Add proposal data
export const addProposal = createAction<{
  params: { hash: string; poolId: string; data: IInvestProposalMetadata }
}>("ipfs/add-proposal")

// Add insurance accident data
export const addInsuranceAccident = createAction<{
  params: { hash: string; data: InsuranceAccident }
}>("ipfs/add-insurance-accident")
