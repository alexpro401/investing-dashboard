import { useCallback, useEffect, useState } from "react"

import { useGovSettingsContract } from "contracts"
import { IGovSettingsFromContract } from "types/dao.types"

const useGovPoolExecutorSettings = (
  govPoolAddress?: string,
  executorAddress?: string
): [IGovSettingsFromContract | undefined, boolean] => {
  const govSettingsContract = useGovSettingsContract(govPoolAddress)
  const [loading, setLoading] = useState<boolean>(false)
  const [executorSettings, setExecutorSettings] = useState<
    IGovSettingsFromContract | undefined
  >(undefined)

  const getExecutorSettings = useCallback(async () => {
    if (!govSettingsContract || !executorAddress) return

    try {
      setLoading(true)
      const _executorSettings = await govSettingsContract.getExecutorSettings(
        executorAddress
      )
      setExecutorSettings(_executorSettings)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [govSettingsContract, executorAddress])

  useEffect(() => {
    getExecutorSettings()
  }, [getExecutorSettings])

  return [executorSettings, loading]
}

export default useGovPoolExecutorSettings
