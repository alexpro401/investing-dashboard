import { NavigateOptions, useLocation, useNavigate } from "react-router-dom"

// this hook is used to get the state from the previous route
// basic idea is to use the location state to pass data between routes
// this is useful for advanced routing, like handling back button

interface routerStateType {
  from?: { pathname?: string }
  initialDirection?: "deposit" | "withdraw"
}

export const useRouteState = () => {
  const location = useLocation()
  const state = location.state as routerStateType

  return state
}

export const useNavigateWithState = () => {
  const navigate = useNavigate()
  const state = useRouteState()

  return (path: string, options?: NavigateOptions) =>
    navigate(path, {
      ...options,
      state: {
        ...(options?.state || {}),
        ...state,
      },
    })
}
