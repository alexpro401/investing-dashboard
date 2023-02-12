import * as React from "react"
import { QueryPaginationResult, useQueryPagination } from "hooks"
import { IInvestProposal } from "interfaces/thegraphs/invest-pools"
import { graphClientInvestPools } from "utils/graphClient"
import { PoolInvestProposalsQuery } from "queries"
import { isAddress } from "@ethersproject/address"

const usePoolInvestProposalsListQuery = (
  poolAddress: string
): QueryPaginationResult<IInvestProposal> => {
  return useQueryPagination({
    query: PoolInvestProposalsQuery,
    variables: React.useMemo(() => ({ poolAddress }), [poolAddress]),
    pause: React.useMemo(
      () => !poolAddress || !isAddress(poolAddress),
      [poolAddress]
    ),
    context: graphClientInvestPools,
    formatter: (d) => d.proposals,
  })
}

export default usePoolInvestProposalsListQuery
