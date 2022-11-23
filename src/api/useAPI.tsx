import api from "api"
import { useMemo } from "react"

// API builder
export const useAPI = () => {
  // TODO: active nft API will be stored in the redux store "user"
  // TODO: create hook to get user active nft API
  // TODO: useUserActiveAPI()
  const enabledNftApi = "Moralis"
  const enabledTokenApi = "Kattana"

  return useMemo(
    () => ({
      NFTAPI: api.nft[enabledNftApi],
      TokenAPI: api.token[enabledTokenApi],
    }),
    []
  )
}
