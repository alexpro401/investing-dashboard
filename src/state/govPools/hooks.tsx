import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { createClient, useQuery } from "urql"

import { AppDispatch } from "state"
import { addPools, setLoading } from "state/govPools/actions"
import { IGovPoolQuery } from "interfaces/thegraphs/gov-pools"
import { GovPoolsQuery } from "queries/gov-pools"

const GovPoolsClient = createClient({
  url: process.env.REACT_APP_DAO_POOLS_API_URL || "",
  requestPolicy: "network-only",
})

export function useGovPoolsQuery() {
  const dispatch = useDispatch<AppDispatch>()

  const [response, handleMore] = useQuery<{
    daoPools: IGovPoolQuery[]
  }>({
    query: GovPoolsQuery,
    context: GovPoolsClient,
  })

  useEffect(() => {
    if (!dispatch) return
    dispatch(setLoading({ loading: response.fetching }))
  }, [response.fetching, dispatch])

  // Store pools to redux
  useEffect(() => {
    if (!dispatch || !response || !response.data || response.fetching) return

    dispatch(
      addPools({
        data: response.data.daoPools,
      })
    )
  }, [response, dispatch])

  return handleMore
}
