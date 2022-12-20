import { isNil } from "lodash"
import { useMemo } from "react"
import { useQuery } from "urql"
import { getDaysToDate } from "utils"
import { TraderPoolHistoriesQuery } from "queries/investors"

export const usePoolInvestorsByDay = (date, pool) => {
  const pause = useMemo(() => isNil(date) || isNil(pool), [date, pool])

  const variables = useMemo(
    () => ({
      pool: pool,
      day: String(getDaysToDate(date)),
    }),
    [date, pool]
  )

  return useQuery<{
    traderPoolHistories: { investors: string[] }[]
  }>({
    query: TraderPoolHistoriesQuery,
    variables,
    pause,
  })
}

export default usePoolInvestorsByDay
