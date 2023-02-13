import * as React from "react"
import { isNil } from "lodash"

import { BasicPoolPositionExchangesQuery } from "queries"
import { graphClientAllPools } from "utils/graphClient"
import { IExchange } from "interfaces/thegraphs/all-pools"
import { QueryPaginationResult, useQueryPagination } from "hooks"

const usePoolPositionExchangesList = (
  positionId: string,
  pause: boolean
): QueryPaginationResult<IExchange> => {
  return useQueryPagination<IExchange>({
    query: BasicPoolPositionExchangesQuery,
    variables: React.useMemo(() => ({ positionId }), [positionId]),
    pause: React.useMemo(() => pause || isNil(positionId), [positionId, pause]),
    context: graphClientAllPools,
    formatter: (d) => d.exchanges,
  })
}

export default usePoolPositionExchangesList
