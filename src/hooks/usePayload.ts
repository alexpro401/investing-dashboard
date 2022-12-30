import { SubmitState } from "consts/types"
import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, AppState } from "state"
import { updatePayload } from "state/application/actions"
import { selectPayload } from "state/application/selectors"

export function usePayload(): [
  AppState["application"]["payload"],
  (params: SubmitState) => void
] {
  const dispatch = useDispatch<AppDispatch>()
  const payload = useSelector(selectPayload)

  const update = useCallback(
    (params: SubmitState) => {
      dispatch(updatePayload({ params }))
    },
    [dispatch]
  )

  return [payload, update]
}

export default usePayload
