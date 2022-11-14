import * as React from "react"
import { isNil } from "lodash"

import { useSelector } from "react-redux"
import { selectGovPoolByAddress } from "state/govPools/selectors"
import { ZERO } from "constants/index"

const useGovPoolStatistic = (govPoolAddress: string) => {
  const poolQuery = useSelector((s) =>
    selectGovPoolByAddress(s, govPoolAddress)
  )

  const tvl = React.useMemo(() => {
    if (isNil(poolQuery)) {
      return { loading: true, value: ZERO }
    }
    return { loading: false, value: ZERO }
  }, [poolQuery])

  const mc_tvl = React.useMemo(() => {
    if (isNil(poolQuery)) {
      return { loading: true, value: ZERO }
    }
    return { loading: false, value: ZERO }
  }, [poolQuery])

  const members = React.useMemo(() => {
    if (isNil(poolQuery)) {
      return { loading: true, value: ZERO }
    }
    return { loading: false, value: poolQuery.votersCount }
  }, [poolQuery])

  const lau = React.useMemo(() => {
    if (isNil(poolQuery)) {
      return { loading: true, value: ZERO }
    }
    return { loading: false, value: ZERO }
  }, [poolQuery])

  return [{ tvl, mc_tvl, members, lau }]
}

export default useGovPoolStatistic
