import { useEffect, useState, useCallback } from "react"

import { useGovPoolContract } from "contracts"

export const useGovValidatorsContractAddress = (daoAddress: string) => {
  const govPoolContract = useGovPoolContract(daoAddress)

  const [govValidatorsAddress, setGovValidatorsAddress] = useState<string>("")

  const setupGovValidatorsAddress = useCallback(async () => {
    if (!govPoolContract) return

    try {
      const _govValidatorsAddress = await govPoolContract.govValidators()
      setGovValidatorsAddress(_govValidatorsAddress)
    } catch (error) {
      console.log(error)
    }
  }, [govPoolContract, setGovValidatorsAddress])

  useEffect(() => {
    setupGovValidatorsAddress()
  }, [setupGovValidatorsAddress])

  return govValidatorsAddress
}
