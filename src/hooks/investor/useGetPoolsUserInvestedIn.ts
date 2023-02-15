import * as React from "react"
import { isEmpty, isNil } from "lodash"
import { graphClientInvestors } from "utils/graphClient"
import { PoolsInvestorInvestedInQuery } from "queries"
import { MAX_PAGINATION_COUNT } from "consts"
import { useQueryPagination } from "hooks/index"

function useGetPoolsUserInvestedIn(
  account?: string | null,
  poolType?: "BASIC_POOL" | "INVEST_POOL"
): [string[], boolean] {
  const userAccount = React.useMemo(() => {
    if (isNil(account)) return ""
    return account.toLocaleLowerCase()
  }, [account])

  const [_loading, _setLoading] = React.useState(true)

  const variables = React.useMemo(
    () => ({ address: userAccount, poolType }),
    [userAccount, poolType]
  )

  const pause = React.useMemo(
    () => isEmpty(userAccount) || isNil(poolType),
    [userAccount, poolType]
  )

  const [{ data, loading, lastFetchLen }, fetchMore] =
    useQueryPagination<string>(
      {
        pause,
        variables,
        context: graphClientInvestors,
        query: PoolsInvestorInvestedInQuery,
        formatter: (d) => d.investor.activePools.map((pool) => pool.id),
      },
      {
        limit: MAX_PAGINATION_COUNT,
        initialOffset: 0,
      }
    )

  React.useEffect(() => {
    if (loading) {
      return
    } else if (lastFetchLen === MAX_PAGINATION_COUNT) {
      _setLoading(true)
      fetchMore()
    } else {
      _setLoading(false)
    }
  }, [loading, lastFetchLen])

  return [data, _loading || loading]
}

export default useGetPoolsUserInvestedIn
