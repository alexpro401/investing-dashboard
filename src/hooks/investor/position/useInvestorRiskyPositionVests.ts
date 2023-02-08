import * as React from "react"
import { InvestorRiskyPositionVest } from "interfaces/thegraphs/investors"
import { MAX_PAGINATION_COUNT } from "consts"
import useQueryPagination, {
  QueryPaginationResult,
} from "hooks/useQueryPagination"
import { InvestorProposalPositionVestsQuery } from "queries"
import { graphClientInvestors } from "utils/graphClient"
import { isAddress } from "@ethersproject/address"
import { isNil } from "lodash"

interface IVariables {
  riskyPositionId: string
  investorAddress?: string | null
}

const useInvestorRiskyPositionVests = (
  variables: IVariables,
  pause: boolean
): QueryPaginationResult<InvestorRiskyPositionVest> => {
  return useQueryPagination<InvestorRiskyPositionVest>(
    {
      query: InvestorProposalPositionVestsQuery,
      variables: React.useMemo(
        () => ({
          proposalPositionId: String(variables.riskyPositionId).toLowerCase(),
          account: variables.investorAddress,
        }),
        [variables]
      ),
      pause: React.useMemo(
        () =>
          isNil(variables) ||
          isNil(variables.riskyPositionId) ||
          isNil(variables.investorAddress) ||
          !isAddress(variables.investorAddress) ||
          pause,
        [variables, pause]
      ),
      context: graphClientInvestors,
      formatter: (d) => d?.proposalPositions?.[0].vests,
    },
    {
      limit: MAX_PAGINATION_COUNT,
      initialOffset: 0,
    }
  )
}

export default useInvestorRiskyPositionVests
