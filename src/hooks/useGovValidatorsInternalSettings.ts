import { useCallback, useEffect, useState } from "react"
import { BigNumber } from "@ethersproject/bignumber"

import { useGovValidatorsContract } from "contracts"

interface IInternalSettings {
  duration: BigNumber
  quorum: BigNumber
}

const useGovValidatorsInternalSettings = (
  daoAddress: string
): [IInternalSettings | null, boolean, boolean] => {
  const govValidatorsContract = useGovValidatorsContract(daoAddress)
  const [result, setResult] = useState<IInternalSettings | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)

  const setupInternalSettings = useCallback(async () => {
    if (!govValidatorsContract) return

    try {
      setLoading(true)
      const { duration, quorum } =
        await govValidatorsContract.internalProposalSettings()
      setResult({ duration, quorum })
    } catch (error) {
      console.log(error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [govValidatorsContract])

  useEffect(() => {
    setupInternalSettings()
  }, [setupInternalSettings])

  return [result, loading, error]
}

export default useGovValidatorsInternalSettings
