import * as React from "react"
import { createClient } from "urql"
import { isEmpty, isNil } from "lodash"
import { useWeb3React } from "@web3-react/core"

import { ZERO_ADDR } from "consts"
import { GovPoolsQuery } from "queries"
import { IGovPoolQuery } from "interfaces/thegraphs/gov-pools"
import {
  useQueryPagination,
  useGovPoolHelperContractsMulticall,
  useGovPoolVotingPowerMulticall,
} from "hooks"
import { normalizeBigNumber } from "utils"

const govPoolsClient = createClient({
  url: process.env.REACT_APP_DAO_POOLS_API_URL || "",
  requestPolicy: "network-only",
})

const useGovPoolsList = () => {
  const { account } = useWeb3React()

  const [{ data, loading }, fetchMore] = useQueryPagination<IGovPoolQuery>({
    query: GovPoolsQuery,
    variables: React.useMemo(() => ({ excludeIds: [ZERO_ADDR] }), []),
    context: govPoolsClient,
    formatter: (d) => d.daoPools,
  })

  const [helperContracts, helperContractsLoading] =
    useGovPoolHelperContractsMulticall(
      isNil(data) || isEmpty(data) ? [] : data.map((pool) => pool.id)
    )

  // console.groupCollapsed("useGovPoolsList")
  // console.log("helperContracts", helperContracts)

  const votingPowerParams = React.useMemo(() => {
    if (!account || helperContractsLoading) return []

    return Object.values(helperContracts).map((helperContract) => ({
      userKeeperAddress: helperContract.userKeeper,
      address: account,
      isMicroPool: false,
      useDelegated: false,
    }))
  }, [account, helperContracts, helperContractsLoading])

  // console.log("votingPowerParams", votingPowerParams)

  const [votingPowerData, votingPowerDataLoading] =
    useGovPoolVotingPowerMulticall(votingPowerParams, true)

  // console.log([votingPowerData, votingPowerDataLoading])

  const _loading = React.useMemo(
    () => loading || helperContractsLoading || votingPowerDataLoading,
    [loading, helperContractsLoading, votingPowerDataLoading]
  )

  const votingPowers = React.useMemo(() => {
    if (votingPowerDataLoading) {
      return []
    }
    const userKeepers = Object.values(helperContracts).map(
      (hc) => hc.userKeeper
    )

    return userKeepers.map((userKeeperAddress) => {
      const currentPowers = votingPowerData?.default[userKeeperAddress]

      return normalizeBigNumber(currentPowers?.power)
    })
  }, [votingPowerData, votingPowerDataLoading])

  // console.log("votingPowers", votingPowers)
  // console.groupEnd()

  return {
    pools: data,
    votingPowers,
    loading: _loading,
    fetchMore,
  }
}

export default useGovPoolsList
