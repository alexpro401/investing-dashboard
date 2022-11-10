import {
  useDistributionProposalContract,
  useGovPoolContract,
  useGovSettingsContract,
  useGovUserKeeperContract,
  useGovValidatorsContract,
} from "contracts"
import { useCallback, useEffect, useState } from "react"

export const useGovUserKeeperAddress = (daoPoolAddress?: string) => {
  const [userKeeperAddress, setUserKeeperAddress] = useState("")
  const govPoolContract = useGovPoolContract(daoPoolAddress)

  const updateUserKeeperContract = useCallback(async () => {
    try {
      const { userKeeper } = await govPoolContract!.getHelperContracts()
      setUserKeeperAddress(userKeeper)
    } catch (error) {
      console.log("updateUserKeeperContract error: ", error)
    }
  }, [govPoolContract])

  useEffect(() => {
    if (!govPoolContract) return

    updateUserKeeperContract()
  }, [govPoolContract, updateUserKeeperContract])

  return userKeeperAddress
}

export const useGovPool = (address?: string) => {
  const govPoolContract = useGovPoolContract(address)

  const [settingsAddress, setSettingsAddress] = useState("")
  const [userKeeperAddress, setUserKeeperAddress] = useState("")
  const [validatorsAddress, setValidatorsAddress] = useState("")
  const [distributionProposalAddress, setDistributionProposalAddress] =
    useState("")

  const govValidatorsContract = useGovValidatorsContract(validatorsAddress)
  const govUserKeeperContract = useGovUserKeeperContract(userKeeperAddress)
  const govSettingsContract = useGovSettingsContract(settingsAddress)
  const distributionProposalContract = useDistributionProposalContract(
    distributionProposalAddress
  )

  const init = async () => {
    if (!govPoolContract) return

    const { settings, userKeeper, validators, distributionProposal } =
      await govPoolContract.getHelperContracts()

    setSettingsAddress(settings)
    setUserKeeperAddress(userKeeper)
    setValidatorsAddress(validators)
    setDistributionProposalAddress(distributionProposal)
  }

  return {
    govPoolContract,

    settingsAddress,
    userKeeperAddress,
    validatorsAddress,
    distributionProposalAddress,

    govValidatorsContract,
    govUserKeeperContract,
    govSettingsContract,
    distributionProposalContract,

    init,
  }
}
