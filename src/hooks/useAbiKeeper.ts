import { useCallback, useMemo, useState } from "react"
import { useAbiList } from "hooks"

// *hint
// this hook created to help handle ABI data storing in custom ABI form
// it handles fetching the ABI from the API
// any abi value can be changes outside of the hook

export const useAbiKeeper = (addresses: string[], executors: string[]) => {
  const [storedAbi, setStoredAbi] = useState<Record<string, string>>({})

  const abis = useAbiList(addresses)
  const executorsAbis = useAbiList(executors)

  const handleCustomAbi = useCallback(
    (address: string, abi: string) => {
      setStoredAbi((prev) => ({ ...prev, [address]: abi }))
    },
    [setStoredAbi]
  )

  const abisWithCustom = useMemo(() => {
    return addresses.map((address, index) => {
      if (address in storedAbi) {
        return storedAbi[address]
      }

      return abis[index]
    })
  }, [abis, addresses, storedAbi])

  const executorsAbisWithCustom = useMemo(() => {
    return executors.map((address, index) => {
      if (address in storedAbi) {
        return storedAbi[address]
      }

      return executorsAbis[index]
    })
  }, [executors, executorsAbis, storedAbi])

  return {
    abis: abisWithCustom,
    executorsAbis: executorsAbisWithCustom,
    handleCustomAbi,
  }
}

export default useAbiKeeper
