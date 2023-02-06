import * as React from "react"
import { InvestorPositionVest } from "interfaces/thegraphs/invest-pools"
import { MAX_PAGINATION_COUNT } from "consts"
import useQueryPagination, {
  QueryPaginationResult,
} from "hooks/useQueryPagination"
import { InvestorPositionVestsQuery } from "queries"
import { graphClientInvestors } from "utils/graphClient"

const useInvestorPositionVests = (
  positionId: string,
  pause: boolean
): QueryPaginationResult<InvestorPositionVest> => {
  return useQueryPagination<InvestorPositionVest>(
    {
      query: InvestorPositionVestsQuery,
      variables: React.useMemo(
        () => ({ positionId: String(positionId).toLowerCase() }),
        [positionId]
      ),
      pause: React.useMemo(() => !positionId || pause, [positionId, pause]),
      context: graphClientInvestors,
      formatter: (d) => d.vests,
    },
    {
      limit: MAX_PAGINATION_COUNT,
      initialOffset: 0,
    }
  )
}

export default useInvestorPositionVests
