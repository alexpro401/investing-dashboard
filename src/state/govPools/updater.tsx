import * as React from "react"

import { useGovPoolsQuery } from "state/govPools/hooks"

const INTERVAL_UPDATE_MS = 5 * 60 * 1000

export const GovPoolsUpdater: React.FC = () => {
  const updatePools = useGovPoolsQuery()

  React.useEffect(() => {
    const interval = setInterval(() => {
      updatePools()
    }, INTERVAL_UPDATE_MS)

    return () => clearInterval(interval)
  }, [])

  return null
}
