import * as React from "react"
import { useQueryPagination } from "hooks"
import { isEmpty } from "lodash"
import { IInvestProposal } from "interfaces/thegraphs/invest-pools"
import { InvestorInvestProposalsQuery } from "queries"
import { graphClientInvestPools } from "utils/graphClient"

const useInvestorInvestProposalsListQuery = (
  activePools: string[],
  invested: boolean,
  pause: boolean
) => {
  return useQueryPagination<IInvestProposal>({
    query: InvestorInvestProposalsQuery(invested),
    variables: React.useMemo(() => ({ activePools }), [activePools]),
    pause: React.useMemo(
      () => isEmpty(activePools) || pause,
      [activePools, pause]
    ),
    context: graphClientInvestPools,
    formatter: (d) => d.proposals,
  })
}
export default useInvestorInvestProposalsListQuery
