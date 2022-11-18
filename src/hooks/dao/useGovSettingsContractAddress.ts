import { useState, useEffect } from "react"

import { useGovPoolContract } from "contracts"

export const useGovSettingsContractAddress = (daoAddress: string) => {
  const govPoolContract = useGovPoolContract(daoAddress)

  const [govSettingsAddress, setGovSettingsAddress] = useState<string>("")

  useEffect(() => {
    const setupGovSettingsAddress = async () => {
      if (!govPoolContract) return

      try {
        const { settings } = await govPoolContract.getHelperContracts()
        setGovSettingsAddress(settings)
      } catch (error) {
        console.log(error)
      }
    }
    setupGovSettingsAddress()
  }, [govPoolContract])

  return govSettingsAddress
}
