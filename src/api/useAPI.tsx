import api from "api"
import { useMemo } from "react"

// TODO: active nft API will be stored in the redux store "user"
// TODO: create hook to get user active nft API
// TODO: useUserActiveAPI()
// API builder
export const useAPI = () => {
  const enabledNftApi = "Moralis"
  const enabledTokenApi = "Kattana"
  const enabledGasPriceApi = "BscScan"
  const enabledContractApi = "BscScan"

  return useMemo(
    () => ({
      NFTAPI: api.nft[enabledNftApi],
      TokenAPI: api.token[enabledTokenApi],
      GasPriceAPI: api.gasPrice[enabledGasPriceApi],
      ContractAPI: api.contract[enabledContractApi],
    }),
    []
  )
}
