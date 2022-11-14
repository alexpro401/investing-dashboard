import { createAction } from "@reduxjs/toolkit"
import { IGovPoolQuery } from "interfaces/thegraphs/gov-pools"

export const addPools = createAction<{
  data: IGovPoolQuery[] | undefined
}>("gov-pools/add-pools")

export const setLoading = createAction<{ loading: boolean }>(
  "gov-pools/set-loading"
)
