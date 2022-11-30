import { useAPI } from "api"
import { useCallback, useEffect, useState } from "react"

const useABI = () => {
  const { ContractAPI } = useAPI()

  const fetch = useCallback(
    async (abi: string): Promise<JSON | null> => {
      try {
        const response = await ContractAPI.getContractABI(abi)

        return JSON.parse(response.result)
      } catch {
        return null
      }
    },
    [ContractAPI]
  )

  return fetch
}

export const useAbiList = (abis: string[]) => {
  const getABI = useABI()
  const [abi, setAbi] = useState<(any | null)[]>([])

  useEffect(() => {
    Promise.all(abis.map((abi) => getABI(abi)))
      .then((values) => {
        setAbi(values)
      })
      .catch(console.error)
  }, [abis, getABI])

  return abi
}

export default useABI
