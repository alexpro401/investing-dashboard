import * as React from "react"
import { isEmpty, isNil, map } from "lodash"

import { MAX_PAGINATION_COUNT } from "consts"
import { graphClientBasicPools } from "utils/graphClient"
import { RiskyProposalPositionExchangesQuery } from "queries"
import { QueryPaginationResult, useQueryPagination } from "hooks"
import { IRiskyPositionExchange } from "interfaces/thegraphs/basic-pools"

const usePoolRiskyPositionsExchangesList = (
  positionId: string,
  pause: boolean
): QueryPaginationResult<IRiskyPositionExchange> => {
  return useQueryPagination<IRiskyPositionExchange>(
    {
      query: RiskyProposalPositionExchangesQuery,
      variables: React.useMemo(
        () => ({ positionId: positionId }),
        [positionId]
      ),
      pause: React.useMemo(
        () => pause || isNil(positionId),
        [pause, positionId]
      ),
      context: graphClientBasicPools,
      formatter: (d) => {
        const { exchanges } = d.proposalPosition.proposal

        if (isEmpty(exchanges)) return []

        return exchanges.reduce((acc, exchange) => {
          return [...acc, ...map(exchange.exchanges, (e) => e)]
        }, [])
      },
    },
    {
      limit: MAX_PAGINATION_COUNT,
      initialOffset: 0,
    }
  )
}

export default usePoolRiskyPositionsExchangesList
