import * as React from "react"
import { isNil } from "lodash"
import { isAddress } from "@ethersproject/address"

import { useQueryPagination } from "hooks"
import { InvestorRiskyPosition } from "interfaces/thegraphs/investors"
import { InvestorProposalsPositionsQuery } from "queries"
import { graphClientInvestors } from "utils/graphClient"

type Response = [InvestorRiskyPosition[], boolean, () => void]

type Filters = {
  closed: boolean
  account: string
  type: string
}

const useInvestorRiskyPositionListData = (filters: Filters): Response => {
  const variables = React.useMemo(
    () => ({
      account: filters.account,
      type: filters.type ?? "RISKY_PROPOSAL",
      closed: filters.closed ?? false,
    }),
    [filters]
  )

  const pause = React.useMemo(
    () => isNil(filters) || !isAddress(filters.account),
    [filters]
  )

  const [{ data, loading }, fetchMore] =
    useQueryPagination<InvestorRiskyPosition>({
      query: InvestorProposalsPositionsQuery,
      variables,
      pause,
      context: graphClientInvestors,
      formatter: (d) => d.proposalPositions,
    })

  return React.useMemo(
    () => [data, loading, fetchMore],
    [data, loading, fetchMore]
  )
}

export default useInvestorRiskyPositionListData
