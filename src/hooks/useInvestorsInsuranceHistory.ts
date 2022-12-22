import { isNil } from "lodash"
import { useMemo } from "react"
import { useQuery } from "urql"
import { getDaysToDate } from "utils"
import { InvestorsInsuranceHistoriesQuery } from "queries/investors"
import { Insurance } from "interfaces/thegraphs/investors"

interface Response {
  data: Insurance[]
  fetching: boolean
  error: any
}

type Result = [Response, () => void]

export const useInvestorsInsuranceHistory = (date, investors): Result => {
  const pause = useMemo(
    () => isNil(date) || isNil(investors),
    [date, investors]
  )

  const variables = useMemo(
    () => ({
      day: String(getDaysToDate(date)),
      investors,
    }),
    [date, investors]
  )

  const [{ data, ...restRes }, refetch] = useQuery<{
    investors: { insuranceHistory: Insurance[] }[]
  }>({
    query: InvestorsInsuranceHistoriesQuery,
    variables,
    pause,
  })

  return useMemo<Result>(
    () =>
      [
        {
          data: isNil(data)
            ? undefined
            : data.investors.reduce(
                (acc, i) => [...acc, ...i.insuranceHistory],
                [] as Insurance[]
              ),
          ...restRes,
        },
        refetch,
      ] as Result,
    [data, restRes, refetch]
  )
}

export default useInvestorsInsuranceHistory
