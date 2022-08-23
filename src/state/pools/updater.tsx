import { FC, useEffect } from "react"
import { usePools, usePoolsCounter } from "state/pools/hooks"
import { createClient, Provider as GraphProvider } from "urql"

// THE GRAPH CLIENT
const AllPoolsClient = createClient({
  url: process.env.REACT_APP_ALL_POOLS_API_URL || "",
  requestPolicy: "network-only",
})

const PoolListUpdaterPure: FC = () => {
  const updatePoolsCount = usePoolsCounter()
  const updatePools = usePools()

  useEffect(() => {
    const interval = setInterval(() => {
      updatePoolsCount()
      updatePools()
    }, 30 * 1000)

    return () => clearInterval(interval)
  }, [])

  return null
}

export const PoolListUpdater = () => {
  return (
    <GraphProvider value={AllPoolsClient}>
      <PoolListUpdaterPure />
    </GraphProvider>
  )
}
