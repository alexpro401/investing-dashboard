import { useAPI } from "api"
import { useCallback } from "react"

const useABI = () => {
  const { ContractAPI } = useAPI()

  const fetch = useCallback(
    async (abi: string) => {
      const response = await ContractAPI.getContractABI(abi)
      return JSON.parse(response.result)
    },
    [ContractAPI]
  )

  return fetch
}

export default useABI
