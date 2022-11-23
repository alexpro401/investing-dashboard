import { useMemo } from "react"
import { useSelector } from "react-redux"
import { createClient, useQuery } from "urql"

import { GovPoolExecutorsQuery } from "queries/gov-pools"
import { isAddress } from "utils"
import { useGovPoolHelperContracts } from "hooks/dao"
import { selectInsuranceAddress } from "state/contracts/selectors"

interface IExecutorSettings {
  executorDescription: string
  id: string
  settingsId: string
  __typename: string
}

interface IExecutor {
  executorAddress: string
  id: string
  settings: IExecutorSettings
  __typename: string
}

type IExecutorType =
  | "profile"
  | "change-settings"
  | "change-validator-balances"
  | "distribution"
  | "add-token"
  | "custom"
  | "insurance"

interface IExecutorExtended extends IExecutor {
  type: IExecutorType
}

interface IExecutorsQueryData {
  daoPools: { executors: IExecutor[] }[]
}

const daoGraphClient = createClient({
  url: process.env.REACT_APP_DAO_POOLS_API_URL || "",
  requestPolicy: "network-only",
})

const useGovPoolExecutors = (
  govPoolAddress?: string
): [IExecutorExtended[], boolean] => {
  const [{ data, fetching }] = useQuery<IExecutorsQueryData>({
    query: GovPoolExecutorsQuery,
    pause: !isAddress(govPoolAddress),
    variables: {
      address: govPoolAddress,
    },
    context: daoGraphClient,
  })
  const {
    govSettingsAddress,
    govUserKeeperAddress,
    govValidatorsAddress,
    govDistributionProposalAddress,
  } = useGovPoolHelperContracts(govPoolAddress)
  const insuranceAddress = useSelector(selectInsuranceAddress)

  const executors = useMemo<IExecutorExtended[]>(() => {
    if (!data || !govPoolAddress) return []

    const daoPools = data.daoPools

    if (daoPools.length === 0) return []

    const searchedDaoPool = daoPools[0]

    return searchedDaoPool.executors.map((executor) => {
      let type: IExecutorType = "custom"

      if (govPoolAddress.toLowerCase() === executor.executorAddress) {
        type = "profile"
      }

      if (govSettingsAddress === executor.executorAddress) {
        type = "change-settings"
      }

      if (govDistributionProposalAddress === executor.executorAddress) {
        type = "distribution"
      }

      if (govValidatorsAddress === executor.executorAddress) {
        type = "change-validator-balances"
      }

      if (govUserKeeperAddress === executor.executorAddress) {
        type = "add-token"
      }

      if (
        insuranceAddress === executor.executorAddress &&
        govPoolAddress.toLowerCase() ===
          process.env.REACT_APP_DEXE_DAO_ADDRESS.toLowerCase()
      ) {
        type = "insurance"
      }

      return {
        ...executor,
        type,
      }
    })
  }, [
    data,
    govSettingsAddress,
    govValidatorsAddress,
    govUserKeeperAddress,
    govDistributionProposalAddress,
    insuranceAddress,
    govPoolAddress,
  ])

  console.log("executors: ", executors)

  return [executors, fetching]
}

export default useGovPoolExecutors
