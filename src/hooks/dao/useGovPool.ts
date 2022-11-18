import {
  useDistributionProposalContract,
  useGovPoolContract,
  useGovSettingsContract,
  useGovUserKeeperContract,
  useGovValidatorsContract,
} from "contracts"
import { useState } from "react"

export const useGovPool = (address?: string) => {
  const govPoolContract = useGovPoolContract(address)

  const [settingsAddress, setSettingsAddress] = useState("")
  const [userKeeperAddress, setUserKeeperAddress] = useState("")
  const [validatorsAddress, setValidatorsAddress] = useState("")
  const [distributionProposalAddress, setDistributionProposalAddress] =
    useState("")

  const govValidatorsContract = useGovValidatorsContract(address)
  const govUserKeeperContract = useGovUserKeeperContract(address)
  const govSettingsContract = useGovSettingsContract(address)
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
