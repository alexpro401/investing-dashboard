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
  daoPool: { executors: IExecutor[] }
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
    variables: useMemo(() => ({ address: govPoolAddress }), [govPoolAddress]),
    context: daoGraphClient,
  })

  console.log("data: ", data)

  const executorTypes = useGovPoolExecutorType(
    govPoolAddress ?? "",
    !data ? [] : data.daoPool.executors.map((ex) => ex.executorAddress)
  )

  const executors = useMemo(() => {
    const searchedExecutors = !data ? [] : data.daoPool.executors

    return searchedExecutors.map((ex) => ({
      ...ex,
      type:
        executorTypes.find((el) => el.executorAddress === ex.executorAddress)
          ?.type ?? "custom",
    }))
  }, [data, executorTypes])

  return [executors, fetching]
}

export default useGovPoolExecutors
