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
import { addBignumbers } from "utils/formulas"

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

  const votingPowerParams = React.useMemo(() => {
    if (!account || helperContractsLoading)
      return {
        userKeeperAddresses: [],
        params: {
          address: [undefined],
        },
      }

    return {
      userKeeperAddresses: Object.values(helperContracts).map(
        (hc) => hc.userKeeper
      ) as string[],
      params: {
        address: [account],
        isMicroPool: [false],
        useDelegated: [true],
      },
    }
  }, [account, helperContracts, helperContractsLoading])

  const [votingPowerData, votingPowerDataLoading] =
    useGovPoolVotingPowerMulticall(votingPowerParams)

  const anyLoading = React.useMemo(
    () => loading || helperContractsLoading || votingPowerDataLoading,
    [loading, helperContractsLoading, votingPowerDataLoading]
  )

  const votingPowers = React.useMemo(() => {
    if (anyLoading && !votingPowerData) {
      return {}
    }

    const result = {}

    for (const [key, value] of Object.entries(helperContracts)) {
      const poolVotingPowers = votingPowerData?.default[value.userKeeper]

      if (!poolVotingPowers) {
        continue
      }

      result[key] = addBignumbers(
        [poolVotingPowers.power, 18],
        [poolVotingPowers.nftPower, 18]
      )
    }

    return result
  }, [anyLoading, helperContracts, votingPowerData])

  return {
    pools: data,
    votingPowers,
    loading: anyLoading,
    fetchMore,
  }
}

export default useGovPoolsList
