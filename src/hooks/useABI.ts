import { useAPI } from "api"
import { useCallback, useEffect, useState } from "react"
import { isAddress } from "utils"

const useABI = () => {
  const { ContractAPI } = useAPI()

  const fetch = useCallback(
    async (abi: string): Promise<JSON | null> => {
      console.log("abi", abi)
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
  const [abiList, setAbiList] = useState<(any | null)[]>([])

  useEffect(() => {
    Promise.all(
      abis.map(async (abi) => {
        if (isAddress(abi)) {
          return await getABI(abi)
        }

        return await ""
      })
    )
      .then((values) => {
        setAbiList(
          values.map((v) => {
            if (!v) {
              return ""
            }

            return JSON.stringify(v, undefined, 4)
          })
        )
      })
      .catch(console.error)
  }, [abis, getABI])

  return abiList
}

export default useABI
