import { useCallback, useState, useEffect, useMemo } from "react"
import { parseUnits } from "@ethersproject/units"

import { useGovPoolContract, useGovSettingsContract } from "contracts"
import { addDaoProposalTypeData } from "utils/ipfs"
import { EExecutor } from "interfaces/contracts/IGovPoolSettings"
import { encodeAbiMethod } from "utils/encodeAbi"
import { GovSettings } from "abi"
import useGasTracker from "state/gas/hooks"

interface ICreateDaoProposalTypeArgs {
  proposalInfo: {
    contractAddress: string
    proposalTypeName: string
    proposalName: string
    proposalDescription: string
    proposalTypeDescription: string
  }
  proposalSettings: {
    earlyCompletion: boolean
    delegatedVotingAllowed: boolean
    duration: number
    quorum: number
    minVotesForVoting: number
    minVotesForCreating: number
    rewardToken: string
    creationReward: number
    executionReward: number
    voteRewardsCoefficient: number
  }
}

interface IUseCreateDaoProposalTypeProps {
  daoPoolAddress: string
}

const useCreateDaoProposalType = ({
  daoPoolAddress,
}: IUseCreateDaoProposalTypeProps) => {
  const [govSettingsAddress, setGovSettingsAddress] = useState<string>("")

  const [gasTrackerResponse] = useGasTracker()
  const govPoolContract = useGovPoolContract(daoPoolAddress)
  const govSettingsContract = useGovSettingsContract(govSettingsAddress)

  const transactionOptions = useMemo(() => {
    if (!gasTrackerResponse) return

    return {
      gasPrice: parseUnits(gasTrackerResponse.ProposeGasPrice, "gwei"),
    }
  }, [gasTrackerResponse])

  const tryEstimateGas = useCallback(
    async (
      daoProposalTypeIPFSCode: string,
      govSettingsAddress: string,
      [encodedAddSettingsMethod, encodedChangeExecuterMethod]: any[]
    ) => {
      try {
        const gas = await govPoolContract?.estimateGas.createProposal(
          daoProposalTypeIPFSCode,
          [govSettingsAddress, govSettingsAddress],
          [0, 0],
          [encodedAddSettingsMethod, encodedChangeExecuterMethod],
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
    [govPoolContract, transactionOptions]
  )

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

  const createDaoProposalType = useCallback(
    async (args: ICreateDaoProposalTypeArgs) => {
      if (!govPoolContract || !govSettingsContract) return

      const {
        proposalInfo: {
          contractAddress,
          proposalDescription,
          proposalName,
          proposalTypeName,
          proposalTypeDescription,
        },
        proposalSettings: {
          earlyCompletion,
          delegatedVotingAllowed,
          duration,
          quorum,
          minVotesForVoting,
          minVotesForCreating,
          rewardToken,
          creationReward,
          executionReward,
          voteRewardsCoefficient,
        },
      } = args

      try {
        const { validatorsVote, durationValidators, quorumValidators } =
          await govSettingsContract.settings(EExecutor.DEFAULT)

        let { path: daoProposalTypeIPFSCode } = await addDaoProposalTypeData({
          proposalName: proposalTypeName,
          proposalDescription: proposalTypeDescription,
        })
        daoProposalTypeIPFSCode = "ipfs://" + daoProposalTypeIPFSCode

        const encodedAddSettingsMethod = encodeAbiMethod(
          GovSettings,
          "addSettings",
          [
            [
              {
                // TODO add real proposal data from form component
                earlyCompletion,
                delegatedVotingAllowed,
                validatorsVote,
                duration: 70,
                durationValidators,
                quorum: parseUnits("1", 25),
                quorumValidators,
                minVotesForVoting: 1,
                minVotesForCreating: 1,
                rewardToken: "0x0000000000000000000000000000000000000000",
                creationReward: 0,
                executionReward: 0,
                voteRewardsCoefficient: 1,
                executorDescription: daoProposalTypeIPFSCode,
              },
            ],
          ]
        )

        const newSettingsIdBN = await govSettingsContract.newSettingsId()

        const newSettings = newSettingsIdBN.toNumber()

        const encodedChangeExecuterMethod = encodeAbiMethod(
          GovSettings,
          "changeExecutors",
          [[contractAddress], [newSettings]]
        )

        let { path: daoProposalIPFSCode } = await addDaoProposalTypeData({
          proposalName: proposalName,
          proposalDescription: proposalDescription,
        })
        daoProposalIPFSCode = "ipfs://" + daoProposalIPFSCode

        const gasLimit = await tryEstimateGas(
          daoProposalIPFSCode,
          govSettingsAddress,
          [encodedAddSettingsMethod, encodedChangeExecuterMethod]
        )

        const resultTransaction = await govPoolContract.createProposal(
          daoProposalIPFSCode,
          [govSettingsAddress, govSettingsAddress],
          [0, 0],
          [encodedAddSettingsMethod, encodedChangeExecuterMethod],
          { ...transactionOptions, gasLimit }
        )

        console.log(resultTransaction)
      } catch (error) {
        console.log(error)
      }
    },
    [
      govPoolContract,
      govSettingsContract,
      govSettingsAddress,
      transactionOptions,
      tryEstimateGas,
    ]
  )

  return createDaoProposalType
}

export default useCreateDaoProposalType
