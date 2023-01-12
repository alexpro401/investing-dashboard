import { FC, useEffect } from "react"
import { usePools, usePoolsCounter } from "state/pools/hooks"

export const PoolListUpdater: FC = () => {
  const updatePoolsCount = usePoolsCounter()
  const updatePools = usePools()

  useEffect(() => {
    const interval = setInterval(() => {
      updatePoolsCount()
      updatePools()
    }, 30 * 1000)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
