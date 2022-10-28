import { useEffect, useState } from "react"

import { useGovPoolContract, useGovSettingsContract } from "contracts"

const useDaoSettingsContract = (daoAddress: string) => {
  const govPoolContract = useGovPoolContract(daoAddress)

  const [govSettingsAddress, setGovSettingsAddress] = useState<string>("")
  const govSettingsContract = useGovSettingsContract(govSettingsAddress)

  useEffect(() => {
    const setupGovSettingsAddress = async () => {
      if (!govPoolContract) return

      try {
        const _govSettingsAddress = await govPoolContract.govSetting()
        setGovSettingsAddress(_govSettingsAddress)
      } catch (error) {
        console.log(error)
      }
    }
    setupGovSettingsAddress()
  }, [govPoolContract])

  return govSettingsContract
}

export default useDaoSettingsContract
