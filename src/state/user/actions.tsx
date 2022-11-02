import { createAction } from "@reduxjs/toolkit"
import { SerializedToken } from "./types"

// export interface Iuser {}

// CUSTOM actions

export const updateUserProMode = createAction("user/update-pro-mode")
export const addOwnedPools = createAction<{
  basic: string[]
  invest: string[]
}>("user/add-owned-pools")

export const changeTermsAgreed = createAction<{
  agreed: boolean
}>("user/change-terms-agreed")

export const showAgreementModal = createAction<{
  show: boolean
}>("user/show-terms-agreement-modal")

export const addSerializedToken = createAction<{
  serializedToken: SerializedToken
}>("user/add-seralized-token")

export const removeSerializedToken = createAction<{
  address: string
  chainId: number
}>("user/remove-seralized-token")
