import { useCallback, useEffect, useState } from "react"

import { useGovSettingsContract } from "contracts"

const useGovPoolExecutorToSettings = (
  govPoolAddress?: string,
  executorAddress?: string
): [number | undefined, boolean] => {
  const govSettingsContract = useGovSettingsContract(govPoolAddress)
  const [loading, setLoading] = useState<boolean>(false)
  const [settingId, setSettingId] = useState<number | undefined>(undefined)

  const getSettingsIdFromExecutor = useCallback(async () => {
    if (!govSettingsContract || !executorAddress) return

    setLoading(true)

    try {
      const _settingId = await govSettingsContract.executorToSettings(
        executorAddress
      )
      setSettingId(_settingId.toNumber())
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [govSettingsContract, executorAddress])

  useEffect(() => {
    getSettingsIdFromExecutor()
  }, [getSettingsIdFromExecutor])

  return [settingId, loading]
}

export default useGovPoolExecutorToSettings
