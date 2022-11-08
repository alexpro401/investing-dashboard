import { useCallback, useMemo } from "react"
import { parseUnits } from "@ethersproject/units"

import { useGovPoolContract } from "contracts"
import { useGovValidatorsContractAddress } from "./useGovValidatorsContractAddress"
import { addDaoProposalData } from "utils/ipfs"
import { encodeAbiMethod } from "utils/encodeAbi"
import { GovValidators } from "abi"
import useGasTracker from "state/gas/hooks"

interface ICreateProposalArgs {
  proposalName: string
  proposalDescription: string
  users: string[]
  balances: string[]
}

const useGovPoolCreateProposalValidators = (govPoolAddress: string) => {
  const govPoolContract = useGovPoolContract(govPoolAddress)
  const govValidatorsAddress = useGovValidatorsContractAddress(govPoolAddress)

  const [gasTrackerResponse] = useGasTracker()

  const transactionOptions = useMemo(() => {
    if (!gasTrackerResponse) return

    return {
      gasPrice: parseUnits(gasTrackerResponse.ProposeGasPrice, "gwei"),
    }
  }, [gasTrackerResponse])

  const tryEstimateGas = useCallback(
    async (
      daoProposalTypeIPFSCode: string,
      encodedChangeBalancesMethod: any
    ) => {
      try {
        const gas = await govPoolContract?.estimateGas.createProposal(
          daoProposalTypeIPFSCode,
          [govValidatorsAddress],
          [0],
          [encodedChangeBalancesMethod],
          transactionOptions
        )

        if (!gas?._isBigNumber) {
          return
        }

        return gas
      } catch {
        return
      }
    },
    [govPoolContract, transactionOptions, govValidatorsAddress]
  )

  const createProposal = useCallback(
    async (args: ICreateProposalArgs) => {
      if (!govPoolContract || !govValidatorsAddress) return

      const { proposalName, proposalDescription, users, balances } = args

      try {
        let { path: daoProposalIPFSCode } = await addDaoProposalData({
          proposalName,
          proposalDescription,
        })
        daoProposalIPFSCode = "ipfs://" + daoProposalIPFSCode

        const encodedChangeBalancesMethod = encodeAbiMethod(
          GovValidators,
          "changeBalances",
          [balances, users]
        )

        const gasLimit = await tryEstimateGas(
          daoProposalIPFSCode,
          encodedChangeBalancesMethod
        )

        const resultTransaction = await govPoolContract.createProposal(
          daoProposalIPFSCode,
          [govValidatorsAddress],
          [0],
          [encodedChangeBalancesMethod],
          { ...transactionOptions, gasLimit }
        )

        console.log("TODO")
      } catch (error) {
        console.log(error)
      }
    },
    [govPoolContract, govValidatorsAddress, transactionOptions, tryEstimateGas]
  )

  return createProposal
}

export default useGovPoolCreateProposalValidators
