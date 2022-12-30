import * as React from "react"
import { isNil } from "lodash"

import { ZERO } from "consts"
import { IGovPoolQuery } from "interfaces/thegraphs/gov-pools"

const useGovPoolStatistic = (data: IGovPoolQuery) => {
  const tvl = React.useMemo(() => {
    if (isNil(data)) {
      return { loading: true, value: ZERO }
    }
    return { loading: false, value: ZERO }
  }, [data])

  const mc_tvl = React.useMemo(() => {
    if (isNil(data)) {
      return { loading: true, value: ZERO }
    }
    return { loading: false, value: ZERO }
  }, [data])

  const members = React.useMemo(() => {
    if (isNil(data)) {
      return { loading: true, value: ZERO }
    }
    return { loading: false, value: data.votersCount }
  }, [data])

  const lau = React.useMemo(() => {
    if (isNil(data)) {
      return { loading: true, value: ZERO }
    }
    return { loading: false, value: ZERO }
  }, [data])

  return [{ tvl, mc_tvl, members, lau }]
}

export default useGovPoolStatistic
