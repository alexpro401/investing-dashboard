import { createAction } from "@reduxjs/toolkit"

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

export const processedAgreement = createAction<{
  processed: boolean
}>("user/processed-terms-agreement-sign")
