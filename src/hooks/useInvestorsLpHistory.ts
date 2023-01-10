import { isNil, isFunction } from "lodash"
import { useMemo } from "react"
import { useQuery } from "urql"
import { getDaysToDate } from "utils"
import { InvestorsPoolsLpHistoryQuery } from "queries/investors"
import { InvestorPoolPositionWithHistory } from "interfaces/thegraphs/investors"
import { graphClientInvestors } from "../utils/graphClient"

interface Response {
  data: any
  fetching: boolean
  error: any
}

type Result = [Response, () => void]

export const useInvestorsLpHistory = (
  date,
  pools,
  investors,
  normalizeData
): Result => {
  const pause = useMemo(
    () => isNil(date) || isNil(pools) || isNil(investors),
    [date, pools, investors]
  )

  const variables = useMemo(
    () => ({
      pools: pools,
      investors: investors,
      day: String(getDaysToDate(date)),
    }),
    [date, pools, investors]
  )

  const [{ data, ...restRes }, refetch] = useQuery<{
    investorPoolPositions: InvestorPoolPositionWithHistory[]
  }>({
    query: InvestorsPoolsLpHistoryQuery,
    variables,
    pause,
    context: graphClientInvestors,
  })

  return useMemo(
    () =>
      [
        {
          data: isNil(data)
            ? undefined
            : isFunction(normalizeData)
            ? normalizeData(data.investorPoolPositions)
            : data.investorPoolPositions,
          ...restRes,
        },
        refetch,
      ] as Result,
    [data, normalizeData, restRes, refetch]
  )
}

export default useInvestorsLpHistory

// InvestorPoolPositionQuery
