import { useAPI } from "api"
import { isEqual } from "lodash"
import { useCallback, useEffect, useState } from "react"
import { isAddress } from "utils"

export const useABI = () => {
  const { ContractAPI } = useAPI()

  const fetch = useCallback(
    async (abi: string): Promise<JSON | null> => {
      try {
        const response = await ContractAPI.getContractABI(abi)

        if (response.status === "1") {
          return JSON.parse(response.result)
        }

        return null
      } catch (error) {
        console.error(error)
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
        const formated = values.map((v) => {
          if (!v) {
            return ""
          }
          return JSON.stringify(v, undefined, 4)
        })

        // *hint
        // if the values are the same, don't update the state
        // this will prevent the infinite loop
        if (isEqual(formated, abiList)) return

        setAbiList(formated)
      })
      .catch(console.error)
  }, [abiList, abis, getABI])

  return abiList
}
