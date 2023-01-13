import * as React from "react"
import { createClient } from "urql"

import { useQueryPagination } from "hooks"
import { MAX_PAGINATION_COUNT } from "consts"
import { InvestorVestsInPoolQuery } from "queries"
import { InvestorVest } from "interfaces/thegraphs/investors"

const investorsGraphClient = createClient({
  url: process.env.REACT_APP_INVESTORS_API_URL || "",
})

type Response = { data?: InvestorVest[]; loading: boolean }

const useInvestorAllVestsInPool = (
  account?: string | null,
  pool?: string
): Response => {
  const [_loading, _setLoading] = React.useState(true)

  const queryVariables = React.useMemo(
    () => ({
      pool: pool,
      investor: account,
    }),
    [pool, account]
  )
  const queryPause = React.useMemo(() => !pool || !account, [pool, account])

  const [{ data, loading, lastFetchLen }, fetchMore] =
    useQueryPagination<InvestorVest>(
      {
        query: InvestorVestsInPoolQuery,
        variables: queryVariables,
        pause: queryPause,
        context: investorsGraphClient,
        formatter: (response) => response?.vests,
      },
      {
        limit: MAX_PAGINATION_COUNT,
        initialOffset: 0,
      }
    )

  React.useEffect(() => {
    if (loading) return

    if (lastFetchLen === MAX_PAGINATION_COUNT) {
      _setLoading(true)
      fetchMore()
    } else {
      _setLoading(false)
    }
  }, [data, loading, lastFetchLen])

  return React.useMemo<Response>(
    () => ({ data, loading: _loading }),
    [data, _loading]
  )
}

export default useInvestorAllVestsInPool
