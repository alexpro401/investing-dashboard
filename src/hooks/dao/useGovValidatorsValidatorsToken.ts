import { BigNumber } from "@ethersproject/bignumber"
import { useState, useCallback, useEffect } from "react"

import { useGovValidatorsContract } from "contracts"
import { useERC20 } from "hooks"
import { Token } from "interfaces"

const useGovValidatorsValidatorsToken = (
  govPoolAddress: string
): [string, Token | null, BigNumber] => {
  const validatorsContract = useGovValidatorsContract(govPoolAddress)
  const [validatorsTokenAddress, setValidatorsTokenAddress] =
    useState<string>("")
  const [, data, balance] = useERC20(validatorsTokenAddress)

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

  return [validatorsTokenAddress, data, balance]
}

export default useGovValidatorsValidatorsToken
