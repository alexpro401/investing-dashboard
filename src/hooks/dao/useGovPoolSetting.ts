import { useCallback, useEffect, useState } from "react"

import { useGovSettingsContract } from "contracts"
import { IGovSettingsFromContract } from "types/dao.types"

interface IUseGovPoolSetting {
  daoAddress: string
  settingsId: number
}

const useGovPoolSetting = ({
  daoAddress,
  settingsId,
}: IUseGovPoolSetting): [
  IGovSettingsFromContract | undefined,
  boolean,
  boolean
] => {
  const daoSettingsContract = useGovSettingsContract(daoAddress)

  const [result, setResult] = useState<IGovSettingsFromContract | undefined>(
    undefined
  )
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)

  const getGovSettings = useCallback(async () => {
    if (!daoSettingsContract) return

    try {
      setLoading(true)
      setError(false)
      const _result = await daoSettingsContract.settings(settingsId)

      setResult(_result)
    } catch (error) {
      console.log(error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [daoSettingsContract, settingsId])

  useEffect(() => {
    getGovSettings()
  }, [getGovSettings])

  return [result, loading, error]
}

export default useGovPoolSetting
