import * as React from "react"
import { isNil, map } from "lodash"
import { isAddress } from "@ethersproject/address"

import { RiskyPositionsQuery } from "queries"
import { graphClientBasicPools } from "utils/graphClient"
import { QueryPaginationResult, useQueryPagination } from "hooks"
import {
  IRiskyPosition,
  WrappedPoolRiskyProposalPositionView,
} from "interfaces/thegraphs/basic-pools"

// function for generate wrapped view of risky positions
function generateWrappedPoolRiskyPositionsView(
  data: IRiskyPosition[]
): WrappedPoolRiskyProposalPositionView[] {
  return map(data, (position) => {
    const { proposal, ...restPosition } = position

    return {
      id: restPosition.id,
      position: restPosition,
      utilityIds: {
        proposalId: Number(proposal.proposalId) - 1,
        proposalEntityId: proposal.id,
        proposalTokenAddress: proposal.token,
        poolAddress: proposal.basicPool.id,
        poolBaseTokenAddress: proposal.basicPool.baseToken,
      },
    }
  })
}

const usePoolRiskyPositionsList = (
  poolAddress: string,
  closed: boolean
): QueryPaginationResult<WrappedPoolRiskyProposalPositionView> => {
  return useQueryPagination<WrappedPoolRiskyProposalPositionView>({
    query: RiskyPositionsQuery,
    variables: React.useMemo(
      () => ({ poolAddressList: [poolAddress], closed }),
      [closed, poolAddress]
    ),
    pause: React.useMemo(
      () => isNil(closed) || isNil(poolAddress) || !isAddress(poolAddress),
      [poolAddress, closed]
    ),
    context: graphClientBasicPools,
    formatter: (d) =>
      generateWrappedPoolRiskyPositionsView(d.proposalPositions),
  })
}

export default usePoolRiskyPositionsList
