import { useMemo } from "react"
import { isEmpty, isNil } from "lodash"

import { useActiveWeb3React } from "hooks"
import { useOwnedPools } from "state/pools/hooks"
import { usePoolsByInvestors } from "hooks/usePool"
import { IPoolQuery } from "interfaces/thegraphs/all-pools"

interface Response {
  data: IPoolQuery[]
  total: number
  fetching: boolean
}

const useOwnedAndInvestedPools = (): [Response] => {
  const { account } = useActiveWeb3React()

  const investors = useMemo<string[]>(
    () => (isNil(account) ? [] : [String(account).toLocaleLowerCase()]),
    [account]
  )

  const [ownedPools, ownedPoolsFetching] = useOwnedPools(
    String(account).toLocaleLowerCase()
  )
  const [response] = usePoolsByInvestors(investors)

  const fetching = useMemo(
    () => ownedPoolsFetching || response.fetching,
    [ownedPoolsFetching, response]
  )

  const data = useMemo(() => {
    if (fetching) return []

    return [
      ...(!isEmpty(ownedPools) ? ownedPools : []),
      ...(!isEmpty(response.data) ? response.data.traderPools : []),
    ]
  }, [fetching, ownedPools, ownedPoolsFetching, response])

  const total = useMemo<number>(() => {
    if (fetching || (!fetching && isEmpty(data))) {
      return 0
    }

    return data.length
  }, [fetching, data])

  return [{ data, total, fetching }]
}

export default useOwnedAndInvestedPools
