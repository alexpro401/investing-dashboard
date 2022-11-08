import { useActiveWeb3React } from "hooks"
import {
  useDistributionProposalContract,
  useGovPoolContract,
  useGovSettingsContract,
  useGovUserKeeperContract,
  useGovValidatorsContract,
} from "contracts"
import usePayload from "hooks/usePayload"
import useError from "hooks/useError"
import useGasTracker from "state/gas/hooks"
import { useTransactionAdder } from "state/transactions/hooks"
import { useMemo, useState } from "react"
import { parseUnits } from "@ethersproject/units"
import { useNavigate } from "react-router-dom"

export const useGovPoolCreateProposal = (
  daoPoolAddress: string | undefined
) => {
  const [_descriptionURL, _setDescriptionURL] = useState<string>("")
  const [_executors, _setExecutors] = useState<string[]>([])
  const [_values, _setValues] = useState<number[]>([])
  const [_data, _setData] = useState<string[]>([])

  const navigate = useNavigate()
  const { account } = useActiveWeb3React()

  const govPoolContract = useGovPoolContract(daoPoolAddress)

  /**
   * keep here a contract helpers
   */
  const govValidatorsContract = useGovValidatorsContract(daoPoolAddress)
  const govUserKeeperContract = useGovUserKeeperContract(daoPoolAddress)
  const govSettingsContract = useGovSettingsContract(daoPoolAddress)
  const distributionProposalContract =
    useDistributionProposalContract(daoPoolAddress)

  const [, setPayload] = usePayload()
  const [, setError] = useError()
  const [gasTrackerResponse] = useGasTracker()
  const addTransaction = useTransactionAdder()

  const transactionOptions = useMemo(() => {
    if (!gasTrackerResponse) return

    return {
      gasPrice: parseUnits(gasTrackerResponse.ProposeGasPrice, "gwei"),
    }
  }, [gasTrackerResponse])

  const createNewDaoProposalType = async () => {}

  const createInternalValidatorProposal = async () => {}

  const createInsuranceProposal = async () => {}

  const createInternalProposal = async () => {}

  const createDistributionProposal = async () => {}

  const createValidatorProposal = async () => {}

  const createCustomProposal = async () => {}

  return {
    descriptionURL: { get: _descriptionURL, set: _setDescriptionURL },
    executors: { get: _executors, set: _setExecutors },
    values: { get: _values, set: _setValues },
    data: { get: _data, set: _setData },

    createNewDaoProposalType,
    createInternalValidatorProposal,
    createInsuranceProposal,
    createInternalProposal,
    createDistributionProposal,
    createValidatorProposal,
    createCustomProposal,
  }
}
