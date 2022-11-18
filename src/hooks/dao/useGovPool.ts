import {
  useDistributionProposalContract,
  useGovPoolContract,
  useGovSettingsContract,
  useGovUserKeeperContract,
  useGovValidatorsContract,
} from "contracts"
import { useGovPoolHelperContracts } from "./useGovPoolHelperContracts"

export const useGovPool = (address?: string) => {
  const govPoolContract = useGovPoolContract(address)
  const {
    govSettingsAddress: settingsAddress,
    govUserKeeperAddress: userKeeperAddress,
    govValidatorsAddress: validatorsAddress,
    govDistributionProposalAddress: distributionProposalAddress,
  } = useGovPoolHelperContracts(address)

  const govValidatorsContract = useGovValidatorsContract(address)
  const govUserKeeperContract = useGovUserKeeperContract(address)
  const govSettingsContract = useGovSettingsContract(address)
  const distributionProposalContract = useDistributionProposalContract(address)

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
  }
}
