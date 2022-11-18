import { useEffect, useState, useCallback } from "react"

import { useGovPoolContract } from "contracts"

export const useGovPoolHelperContracts = (daoAddress: string | undefined) => {
  const govPoolContract = useGovPoolContract(daoAddress)

  const [govValidatorsAddress, setGovValidatorsAddress] = useState<string>("")
  const [govUserKeeperAddress, setGovUserKeeperAddress] = useState<string>("")
  const [govSettingsAddress, setGovSettingsAddress] = useState<string>("")
  const [govDistributionProposalAddress, setGovDistributionProposalAddress] =
    useState<string>("")

  const setupGovHelperContracts = useCallback(async () => {
    if (!govPoolContract) return

    try {
      const { validators, userKeeper, settings, distributionProposal } =
        await govPoolContract.getHelperContracts()
      setGovValidatorsAddress(validators)
      setGovUserKeeperAddress(userKeeper)
      setGovSettingsAddress(settings)
      setGovDistributionProposalAddress(distributionProposal)
    } catch (error) {
      console.log(error)
    }
  }, [govPoolContract, setGovValidatorsAddress])

  useEffect(() => {
    setupGovHelperContracts()
  }, [setupGovHelperContracts])

  return {
    govValidatorsAddress,
    govUserKeeperAddress,
    govSettingsAddress,
    govDistributionProposalAddress,
  }
}
