import * as React from "react"
import { isNil } from "lodash"
import { isAddress } from "@ethersproject/address"

import { BasicPositionsQuery } from "queries"
import { graphClientAllPools } from "utils/graphClient"
import { IPosition } from "interfaces/thegraphs/all-pools"
import { QueryPaginationResult, useQueryPagination } from "hooks"

const usePoolPositionsList = (
  poolAddress: string,
  closed: boolean
): QueryPaginationResult<IPosition> => {
  return useQueryPagination<IPosition>({
    query: BasicPositionsQuery,
    variables: React.useMemo(
      () => ({ address: poolAddress, closed }),
      [closed, poolAddress]
    ),
    pause: React.useMemo(
      () => isNil(closed) || isNil(poolAddress) || !isAddress(poolAddress),
      [poolAddress, closed]
    ),
    context: graphClientAllPools,
    formatter: (d) => d.positions,
  })
}

export default usePoolPositionsList
