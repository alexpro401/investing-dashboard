import { useState, useCallback, useEffect } from "react"

import { useGovValidatorsContract } from "contracts"
import { useERC20 } from "hooks/useERC20"

const useGovValidatorsValidatorsToken = (govPoolAddress: string) => {
  const validatorsContract = useGovValidatorsContract(govPoolAddress)
  const [validatorsTokenAddress, setValidatorsTokenAddress] =
    useState<string>("")
  const [, tokenData] = useERC20(validatorsTokenAddress)

  const setupValidatorsTokenAddress = useCallback(async () => {
    if (!validatorsContract) return

    try {
      const _validatorsTokenAddress =
        await validatorsContract.govValidatorsToken()
      setValidatorsTokenAddress(_validatorsTokenAddress)
    } catch (error) {
      console.log(error)
    }
  }, [validatorsContract])

  useEffect(() => {
    setupValidatorsTokenAddress()
  }, [setupValidatorsTokenAddress])

  return tokenData
}

export default useGovValidatorsValidatorsToken
