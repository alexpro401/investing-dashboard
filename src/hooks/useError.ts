import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, AppState } from "state"
import { updateError } from "state/application/actions"
import { selectError } from "state/application/selectors"

export function useError(): [
  AppState["application"]["error"],
  (params: string) => void
] {
  const dispatch = useDispatch<AppDispatch>()
  const error = useSelector(selectError)

  const update = useCallback(
    (params: string) => {
      dispatch(updateError({ params }))
    },
    [dispatch]
  )

  return [error, update]
}

export default useError
