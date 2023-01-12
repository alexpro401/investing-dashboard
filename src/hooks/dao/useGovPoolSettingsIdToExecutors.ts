import { useMemo } from "react"
import { useQuery } from "urql"

import { IExecutor, IExecutorType } from "types"
import { GovPoolExecutorsBySettingIdQuery } from "queries"
import { isAddress } from "utils"
import { useGovPoolExecutorType } from "hooks/dao"
import { graphClientDaoPools } from "utils/graphClient"

interface IExecutorExtended extends IExecutor {
  type: IExecutorType
}

interface IExecutorsQueryData {
  daoPool: { executors: IExecutor[] }
}

const useGovPoolSettingsIdToExecutors = (
  govPoolAddress: string | undefined,
  settingsId: string | undefined
): [IExecutorExtended[], boolean] => {
  const [{ data, fetching }] = useQuery<IExecutorsQueryData>({
    query: GovPoolExecutorsBySettingIdQuery,
    pause: !isAddress(govPoolAddress) || !settingsId,
    variables: useMemo(
      () => ({
        address: govPoolAddress?.toLowerCase(),
        settingsId: settingsId,
      }),
      [govPoolAddress, settingsId]
    ),
    context: graphClientDaoPools,
  })

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

export default useGovPoolSettingsIdToExecutors
