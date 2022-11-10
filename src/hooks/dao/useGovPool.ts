import {
  useDistributionProposalContract,
  useGovPoolContract,
  useGovSettingsContract,
  useGovUserKeeperContract,
  useGovValidatorsContract,
} from "contracts"
import { useCallback, useEffect, useState } from "react"
import { parseUnits } from "@ethersproject/units"
import usePayload from "hooks/usePayload"
import useError from "hooks/useError"
import useGasTracker from "state/gas/hooks"
import { useTransactionAdder } from "state/transactions/hooks"
import { SubmitState } from "constants/types"
import { TransactionType } from "state/transactions/types"
import { isTxMined, parseTransactionError } from "utils"

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

  const [settings, setSettings] = useState("")
  const [userKeeper, setUserKeeper] = useState("")
  const [validators, setValidators] = useState("")
  const [distributionProposal, setDistributionProposal] = useState("")

  const govValidatorsContract = useGovValidatorsContract(validators)
  const govUserKeeperContract = useGovUserKeeperContract(userKeeper)
  const govSettingsContract = useGovSettingsContract(settings)
  const distributionProposalContract =
    useDistributionProposalContract(distributionProposal)

  const init = async () => {
    if (!govPoolContract) return

    const { settings, userKeeper, validators, distributionProposal } =
      await govPoolContract.getHelperContracts()

    setSettings(settings)
    setUserKeeper(userKeeper)
    setValidators(validators)
    setDistributionProposal(distributionProposal)
  }

  return {
    govPoolContract,

    settings,
    userKeeper,
    validators,
    distributionProposal,

    govValidatorsContract,
    govUserKeeperContract,
    govSettingsContract,
    distributionProposalContract,

    init,
  }
}
