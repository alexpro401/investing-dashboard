import { useCallback, useEffect, useState } from "react"

import { useGovPoolContract, useGovSettingsContract } from "contracts"

interface IUseDaoPoolNewSettingsId {
  daoAddress: string
}

const useDaoPoolNewSettingId = ({ daoAddress }: IUseDaoPoolNewSettingsId) => {
  const govPoolContract = useGovPoolContract(daoAddress)

  const [govSettingsAddress, setGovSettingsAddress] = useState<string>("")
  const govSettingsContract = useGovSettingsContract(govSettingsAddress)

  const [result, setResult] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)

  const getGovSettings = useCallback(async () => {
    if (!govPoolContract || !govSettingsContract) return

    try {
      setLoading(true)
      setError(false)
      const _resultBN = await govSettingsContract.newSettingsId()

      const _result = _resultBN.toNumber()
      setResult(_result)
    } catch (error) {
      console.log(error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [govPoolContract, govSettingsContract])

  useEffect(() => {
    const setupGovSettingsAddress = async () => {
      if (!govPoolContract) return

      try {
        setLoading(true)
        setError(false)
        const _govSettingsAddress = await govPoolContract.govSetting()
        setGovSettingsAddress(_govSettingsAddress)
      } catch (error) {
        console.log(error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    setupGovSettingsAddress()
  }, [govPoolContract])

  useEffect(() => {
    getGovSettings()
  }, [getGovSettings])

  return [result, loading, error]
}

export default useDaoPoolNewSettingId
