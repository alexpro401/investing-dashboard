import { useGovSettingsContract } from "contracts"
import { useCallback, useEffect, useState } from "react"

interface IUseGovSettingsNewSettingId {
  daoAddress: string
}

const useGovSettingsNewSettingId = ({
  daoAddress,
}: IUseGovSettingsNewSettingId): [number | null, boolean, boolean] => {
  const daoSettingsContract = useGovSettingsContract(daoAddress)

  const [result, setResult] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)

  const getGovSettings = useCallback(async () => {
    if (!daoSettingsContract) return

    try {
      setLoading(true)
      setError(false)
      const _resultBN = await daoSettingsContract.newSettingsId()

      const _result = _resultBN.toNumber()
      setResult(_result)
    } catch (error) {
      console.log(error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [daoSettingsContract])

  useEffect(() => {
    getGovSettings()
  }, [getGovSettings])

  return [result, loading, error]
}

export default useGovSettingsNewSettingId
