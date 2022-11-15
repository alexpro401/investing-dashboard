import { useCallback, useEffect, useState } from "react"

import { useGovValidatorsContract } from "contracts"

const useGovPoolValidatorsCount = (govPoolAddress?: string): null | number => {
  const [result, setResult] = useState<null | number>(null)

  const validatorsContract = useGovValidatorsContract(govPoolAddress)

  const handleGetValidatorsCount = useCallback(async () => {
    if (!validatorsContract) return

    try {
      const _validatorsCount = (
        await validatorsContract.validatorsCount()
      ).toNumber()
      setResult(_validatorsCount)
    } catch (error) {
      console.log(error)
    }
  }, [validatorsContract, setResult])

  useEffect(() => {
    handleGetValidatorsCount()
  }, [handleGetValidatorsCount])

  return result
}

export default useGovPoolValidatorsCount
