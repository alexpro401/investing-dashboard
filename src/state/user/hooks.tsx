import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"

import { AppDispatch, AppState } from "../index"
import { updateUserProMode, showAgreementModal } from "../user/actions"
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

export function useUserAgreement(): [IUserTerms, (s: boolean) => void] {
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

  return [userTermsAgreement, setShowAgreementModal]
}
