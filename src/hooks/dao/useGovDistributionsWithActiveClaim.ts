import * as React from "react"
import { isEmpty, isNil } from "lodash"
import { useQuery } from "urql"
import { useWeb3React } from "@web3-react/core"

import { GovProposalsWithDistributionQuery, GovVoterInPoolQuery } from "queries"
import {
  IGovPoolVoterQuery,
  IGovProposalQuery,
} from "interfaces/thegraphs/gov-pools"
import useQueryPagination from "hooks/useQueryPagination"
import { ZERO_ADDR } from "consts"
import { graphClientDaoPools } from "utils/graphClient"

interface VoterInPoolResponse {
  voterInPools: IGovPoolVoterQuery[]
}

const useGovDistributionsWithActiveClaim = (daoPoolAddress?: string) => {
  const { account } = useWeb3React()

  const [{ data, fetching }] = useQuery<VoterInPoolResponse>({
    query: GovVoterInPoolQuery,
    variables: React.useMemo(
      () => ({
        pool: daoPoolAddress,
        voter: account,
      }),
      [daoPoolAddress, account]
    ),
    pause: isNil(account) || isNil(daoPoolAddress),
    context: graphClientDaoPools,
  })

  return useQueryPagination<IGovProposalQuery>({
    query: GovProposalsWithDistributionQuery,
    variables: React.useMemo(
      () => ({
        isDP: true,
        pool: daoPoolAddress,
        voters: [account],
        excludeIds:
          isNil(data) || isEmpty(data.voterInPools)
            ? []
            : data.voterInPools[0].claimedDPs,
        executorExclude: ZERO_ADDR,
      }),
      [daoPoolAddress, account, data]
    ),
    pause: React.useMemo(
      () =>
        isNil(account) ||
        isNil(daoPoolAddress) ||
        fetching ||
        isNil(data) ||
        isEmpty(data.voterInPools) ||
        isNil(data.voterInPools[0].claimedDPs),
      [daoPoolAddress, account, fetching, data]
    ),
    context: graphClientDaoPools,
    formatter: (d) => d.proposals,
  })
}

export default useGovDistributionsWithActiveClaim
