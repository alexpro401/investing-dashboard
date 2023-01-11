import { isNil, isFunction } from "lodash"
import { useMemo } from "react"
import { useQuery } from "urql"
import { InvestorPoolPositionQuery } from "queries"
import { InvestorPoolPosition } from "interfaces/thegraphs/investors"
import { graphClientInvestors } from "../utils/graphClient"

interface Response {
  data: any
  fetching: boolean
  error: any
}

type Result = [Response, () => void]

export const useInvestorsLastPoolPosition = (
  pool,
  investors,
  prepare?: (d: InvestorPoolPosition[]) => void
): Result => {
  const pause = useMemo(
    () => isNil(pool) || isNil(investors),
    [pool, investors]
  )

  const variables = useMemo(
    () => ({
      pool,
      investors,
    }),
    [pool, investors]
  )

  const [{ data, ...restRes }, refetch] = useQuery<{
    investorPoolPositions: InvestorPoolPosition[]
  }>({
    query: InvestorPoolPositionQuery,
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
            : isFunction(prepare)
            ? prepare(data.investorPoolPositions)
            : data.investorPoolPositions,
          ...restRes,
        },
        refetch,
      ] as Result,
    [data, prepare, refetch, restRes]
  )
}

export default useInvestorsLastPoolPosition
