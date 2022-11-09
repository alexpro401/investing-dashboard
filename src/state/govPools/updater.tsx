import * as React from "react"

import { useGovPoolsQuery } from "state/govPools/hooks"

export const GovPoolsUpdater: React.FC = () => {
  const updatePools = useGovPoolsQuery()

  React.useEffect(() => {
    const interval = setInterval(() => {
      updatePools()
    }, 30 * 1000)

    return () => clearInterval(interval)
  }, [])

  return null
}
