import { useEffect, useState, useCallback } from "react"
import { useWeb3React } from "@web3-react/core"

import useDebounce from "hooks/useDebounce"
import useSWRImmutable from "swr/immutable"

export function useBlockNumber() {
  const { library } = useWeb3React()
  const [blockNumber, setBlockNumber] = useState(null)
  const debounced = useDebounce(blockNumber, 100)

  const blockNumberCallback = useCallback(
    (b) => {
      setBlockNumber(b)
    },
    [setBlockNumber]
  )

  useEffect(() => {
    if (!library) return undefined

    library.getBlockNumber().then(blockNumberCallback)

    library.on("block", blockNumberCallback)

    return () => {
      if (library) {
        library.removeListener("block", blockNumberCallback)
      }
    }
  }, [library, blockNumberCallback])

  return debounced
}

export const useCurrentBlock = (): number => {
  const { chainId } = useWeb3React()
  const { data: currentBlock = 0 } = useSWRImmutable(["blockNumber", chainId])
  return currentBlock
}
