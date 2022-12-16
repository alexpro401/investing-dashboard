import { useEffect, useCallback, useState } from "react"
import { isEqual } from "lodash"

import useGovPoolExecutors from "./useGovPoolExecutors"
import { parseIpfsString } from "utils/ipfs"
import { IpfsEntity } from "utils/ipfsEntity"
import { IExecutor, IExecutorType } from "types"

interface ICustomExecutor extends IExecutor {
  proposalName: string
  proposalDescription: string
}

const useGovPoolCustomExecutors = (
  govPoolAddress?: string
): [ICustomExecutor[], boolean] => {
  const [executors] = useGovPoolExecutors(govPoolAddress)
  const [customExecutors, setCustomExecutors] = useState<ICustomExecutor[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [lastExecutorsSnapshot, setLastExecutorsSnapshot] = useState<
    (IExecutor & { type: IExecutorType })[] | undefined
  >(undefined)

  const handleSetupCustomExecutors = useCallback(async () => {
    if (!executors || executors.length === 0) return

    setLoading(true)
    setLastExecutorsSnapshot(executors)

    const _customExecutors: ICustomExecutor[] = []

    const executorsDescriptionHashes: {
      [key: string]: { proposalName: string; proposalDescription: string }
    } = {}

    const filteredExecutors = executors.filter(
      (executor) => executor.type === "custom"
    )

    for (const executor of filteredExecutors) {
      if (executor.settings.executorDescription.includes("ipfs://")) {
        const executorFromHash =
          executorsDescriptionHashes[executor.settings.executorDescription]

        if (executorFromHash) {
          _customExecutors.push({
            ...executor,
            proposalDescription: executorFromHash.proposalDescription,
            proposalName: executorFromHash.proposalName,
          })
        } else {
          try {
            const ipfsExecutorDescription = new IpfsEntity<{
              proposalName: string
              proposalDescription: string
            }>({
              path: parseIpfsString(executor.settings.executorDescription),
            })
            const { proposalDescription, proposalName } =
              await ipfsExecutorDescription.load()

            executorsDescriptionHashes[
              `${executor.settings.executorDescription}`
            ] = { proposalName, proposalDescription }

            _customExecutors.push({
              ...executor,
              proposalDescription,
              proposalName,
            })
          } catch (error) {
            console.log(error)
          }
        }
      }
    }

    setLoading(false)
    setCustomExecutors(_customExecutors)
  }, [executors])

  useEffect(() => {
    if (!isEqual(lastExecutorsSnapshot, executors)) {
      handleSetupCustomExecutors()
    }
  }, [handleSetupCustomExecutors, lastExecutorsSnapshot, executors])

  return [customExecutors, loading]
}

export default useGovPoolCustomExecutors
