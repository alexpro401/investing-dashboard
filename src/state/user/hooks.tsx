import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"

import { AppDispatch, AppState } from "state"
import {
  updateUserProMode,
  showAgreementModal,
  processedAgreement,
} from "state/user/actions"
import { IUserTerms } from "./types"

export function useUserProMode(): [boolean, () => void] {
  const dispatch = useDispatch<AppDispatch>()

  const userSlippageTolerance = useSelector<
    AppState,
    AppState["user"]["userProMode"]
  >((state) => {
    return state.user.userProMode
  })

  const setUserProMode = useCallback(() => {
    dispatch(updateUserProMode())
  }, [dispatch])

  return [userSlippageTolerance, setUserProMode]
}

interface IMethods {
  setShowAgreementModal: (s: boolean) => void
  setProcessed: (p: boolean) => void
}
export function useUserAgreement(): [IUserTerms, IMethods] {
  const dispatch = useDispatch<AppDispatch>()

  const userTermsAgreement = useSelector<AppState, AppState["user"]["terms"]>(
    (state) => state.user.terms
  )

  const setShowAgreementModal = useCallback(
    (show: boolean) => {
      dispatch(showAgreementModal({ show }))
    },
    [dispatch]
  )

  const setProcessed = useCallback(
    (processed: boolean) => {
      dispatch(processedAgreement({ processed }))
    },
    [dispatch]
  )

  return [userTermsAgreement, { setShowAgreementModal, setProcessed }]
}
