import { useMemo } from "react"
import { useQuery } from "urql"

import { GovPoolExecutorsQuery } from "queries"
import { isAddress } from "utils"
import { useGovPoolExecutorType } from "hooks/dao"
import { IExecutor, IExecutorType } from "types"
import { graphClientDaoPools } from "utils/graphClient"

interface IExecutorExtended extends IExecutor {
  type: IExecutorType
}

interface IExecutorsQueryData {
  daoPool: { executors: IExecutor[] }
}

const useGovPoolExecutors = (
  govPoolAddress?: string
): [IExecutorExtended[], boolean] => {
  const [{ data, fetching }] = useQuery<IExecutorsQueryData>({
    query: GovPoolExecutorsQuery,
    pause: !isAddress(govPoolAddress),
    variables: useMemo(() => ({ address: govPoolAddress }), [govPoolAddress]),
    context: graphClientDaoPools,
  })

  const executorTypes = useGovPoolExecutorType(
    govPoolAddress ?? "",
    !data ? [] : data?.daoPool?.executors?.map((ex) => ex.executorAddress)
  )

  const executors = useMemo(() => {
    const searchedExecutors = !data ? [] : data?.daoPool?.executors

    return (
      searchedExecutors?.map((ex) => ({
        ...ex,
        type:
          executorTypes.find((el) => el.executorAddress === ex.executorAddress)
            ?.type ?? "custom",
      })) || []
    )
  }, [data, executorTypes])

  return [executors, fetching]
}

export default useGovPoolExecutors
