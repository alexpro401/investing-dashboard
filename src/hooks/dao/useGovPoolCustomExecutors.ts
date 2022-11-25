import { useEffect, useCallback, useState } from "react"

import useGovPoolExecutors from "./useGovPoolExecutors"
import { parseIpfsString } from "utils/ipfs"
import { IpfsEntity } from "utils/ipfsEntity"
import { IExecutor } from "types/dao.types"

interface ICustomExecutor extends IExecutor {
  proposalName: string
  proposalDescription: string
}

const useGovPoolCustomExecutors = (
  govPoolAddress?: string
): [ICustomExecutor[], boolean] => {
  const [executors, executorsLoading] = useGovPoolExecutors(govPoolAddress)
  const [customExecutors, setCustomExecutors] = useState<ICustomExecutor[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const handleSetupCustomExecutors = useCallback(async () => {
    if (executorsLoading) return

    setLoading(true)

    const _customExecutors: ICustomExecutor[] = []

    const filteredExecutors = executors.filter(
      (executor) => executor.type === "custom"
    )

    for (const executor of filteredExecutors) {
      try {
        const ipfsExecutorDescription = new IpfsEntity<{
          proposalName: string
          proposalDescription: string
        }>({
          path: parseIpfsString(executor.settings.executorDescription),
        })
        const { proposalDescription, proposalName } =
          await ipfsExecutorDescription.load()

        _customExecutors.push({
          ...executor,
          proposalDescription,
          proposalName,
        })
      } catch (error) {}
    }

    setLoading(false)
    setCustomExecutors(_customExecutors)
  }, [executors, executorsLoading])

  useEffect(() => {
    handleSetupCustomExecutors()
  }, [handleSetupCustomExecutors])

  return [customExecutors, executorsLoading || loading || false]
}

export default useGovPoolCustomExecutors
