import * as React from "react"
import { isEmpty } from "lodash"
import { graphClientBasicPools } from "utils/graphClient"
import { RiskyProposalsQuery } from "queries"
import { useQueryPagination } from "hooks/index"
import { InvestorRiskyProposal } from "interfaces/thegraphs/investors"
import { DEFAULT_PAGINATION_COUNT } from "consts"

function useRiskyProposalsListQuery(
  poolsUserInvestedIn: string[],
  _pause: boolean,
  _offset?: number,
  _limit?: number
): [InvestorRiskyProposal[], boolean, () => void] {
  const offset = React.useMemo(() => _offset || 0, [_offset])
  const limit = React.useMemo(
    () => _limit || DEFAULT_PAGINATION_COUNT,
    [_limit]
  )

  const variables = React.useMemo(
    () => ({ poolsUserInvestedIn }),
    [poolsUserInvestedIn]
  )

  const pause = React.useMemo(
    () => isEmpty(poolsUserInvestedIn) || _pause,
    [poolsUserInvestedIn, _pause]
  )

  const [{ data, loading }, fetchMore] =
    useQueryPagination<InvestorRiskyProposal>(
      {
        pause,
        variables,
        context: graphClientBasicPools,
        query: RiskyProposalsQuery,
        formatter: (d) => d?.proposals ?? [],
      },
      {
        limit: limit,
        initialOffset: offset,
      }
    )

  return [data, loading, fetchMore]
}

export default useRiskyProposalsListQuery
