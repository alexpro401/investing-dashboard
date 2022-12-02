import { useMemo } from "react"
import { createClient, useQuery } from "urql"

import { IExecutor, IExecutorType } from "types/dao.types"
import { GovPoolExecutorsBySettingIdQuery } from "queries/gov-pools"
import { isAddress } from "utils"
import { useGovPoolExecutorType } from "hooks/dao"

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
    context: daoGraphClient,
  })

  const executorTypes = useGovPoolExecutorType(
    govPoolAddress ?? "",
    !data ? [] : data.daoPools[0].executors.map((ex) => ex.executorAddress)
  )

  const executors = useMemo(() => {
    const searchedExecutors = !data ? [] : data.daoPools[0].executors

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
