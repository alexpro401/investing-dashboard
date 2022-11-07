import api from "api"
import { useMemo } from "react"

// API builder
export const useAPI = () => {
  // TODO: active nft API will be stored in the redux store "user"
  // TODO: create hook to get user active nft API
  const enabledNftApi = "Moralis"

  return useMemo(
    () => ({
      nft: new api.nft[enabledNftApi](),
    }),
    []
  )
}
