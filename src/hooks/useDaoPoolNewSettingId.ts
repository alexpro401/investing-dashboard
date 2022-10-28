import { useCallback, useEffect, useState } from "react"

import useDaoSettingsContract from "./useDaoSettingsContract"

interface IUseDaoPoolNewSettingsId {
  daoAddress: string
}

const useDaoPoolNewSettingId = ({ daoAddress }: IUseDaoPoolNewSettingsId) => {
  const daoSettingsContract = useDaoSettingsContract(daoAddress)

  const [result, setResult] = useState<number>(0)
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

export default useDaoPoolNewSettingId
