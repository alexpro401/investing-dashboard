import { useMemo } from "react"
import { createClient, useQuery } from "urql"

import { GovPoolExecutorsQuery } from "queries/gov-pools"
import { isAddress } from "utils"
import { useGovPoolExecutorType } from "hooks/dao"
import { IExecutor, IExecutorType } from "types/dao.types"

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

  const searchedExecutors = useMemo(() => {
    if (!data || !govPoolAddress) return []

    const daoPools = data.daoPools

    if (daoPools.length === 0) return []

    return daoPools[0].executors
  }, [data, govPoolAddress])

  const executorTypes = useGovPoolExecutorType(
    govPoolAddress ?? "",
    searchedExecutors.map((ex) => ex.executorAddress)
  )

  const executors = useMemo(() => {
    return searchedExecutors.map((ex) => ({
      ...ex,
      type:
        executorTypes.find((el) => el.executorAddress === ex.executorAddress)
          ?.type ?? "custom",
    }))
  }, [searchedExecutors, executorTypes])

  return [executors, fetching]
}

export default useGovPoolExecutors
