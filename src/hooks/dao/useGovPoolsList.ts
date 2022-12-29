import * as React from "react"
import { createClient } from "urql"
import { GovPoolsQuery } from "queries"
import { ZERO_ADDR } from "consts/index"
import useQueryPagination from "hooks/useQueryPagination"
import { IGovPoolQuery } from "interfaces/thegraphs/gov-pools"

const govPoolsClient = createClient({
  url: process.env.REACT_APP_DAO_POOLS_API_URL || "",
  requestPolicy: "network-only",
})

const useGovPoolsList = () => {
  const [{ data, loading }, fetchMore] = useQueryPagination<IGovPoolQuery>({
    query: GovPoolsQuery,
    variables: React.useMemo(() => ({ excludeIds: [ZERO_ADDR] }), []),
    context: govPoolsClient,
    formatter: (d) => d.daoPools,
  })

  return {
    data,
    loading,
    fetchMore,
  }
}

export default useGovPoolsList
