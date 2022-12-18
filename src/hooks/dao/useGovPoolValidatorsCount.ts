import { useCallback, useEffect, useState } from "react"

import { useGovValidatorsContract } from "contracts"

const useGovPoolValidatorsCount = (
  govPoolAddress?: string
): [null | number, boolean] => {
  const [result, setResult] = useState<null | number>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const validatorsContract = useGovValidatorsContract(govPoolAddress)

  const handleGetValidatorsCount = useCallback(async () => {
    if (!validatorsContract) return

    setLoading(true)

    try {
      const _validatorsCount = (
        await validatorsContract.validatorsCount()
      ).toNumber()
      setResult(_validatorsCount)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [validatorsContract, setResult])

  useEffect(() => {
    handleGetValidatorsCount()
  }, [handleGetValidatorsCount])

  return [result, loading]
}

export default useGovPoolValidatorsCount
