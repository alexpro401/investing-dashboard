import { useCallback, useState, useEffect, useMemo, useContext } from "react"
import { parseUnits } from "@ethersproject/units"
import { useNavigate } from "react-router-dom"

import { useGovPoolContract, useGovSettingsContract } from "contracts"
import { addDaoProposalTypeData } from "utils/ipfs"
import { EExecutor } from "interfaces/contracts/IGovPoolSettings"
import { encodeAbiMethod } from "utils/encodeAbi"
import { GovSettings } from "abi"
import useGasTracker from "state/gas/hooks"
import { DaoProposalCreatingContext } from "context/DaoProposalCreatingContext"
import useError from "hooks/useError"
import usePayload from "./usePayload"
import { useTransactionAdder } from "state/transactions/hooks"
import { SubmitState } from "constants/types"
import { TransactionType } from "state/transactions/types"
import { isTxMined, parseTransactionError } from "utils"

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
  const navigate = useNavigate()
  const [govSettingsAddress, setGovSettingsAddress] = useState<string>("")
  const { setSuccessModalState, closeSuccessModalState } = useContext(
    DaoProposalCreatingContext
  )

  const addTransaction = useTransactionAdder()
  const [, setPayload] = usePayload()
  const [, setError] = useError()
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
        setPayload(SubmitState.SIGN)

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

        setPayload(SubmitState.WAIT_CONFIRM)
        const receipt = await addTransaction(resultTransaction, {
          type: TransactionType.GOV_POOL_CREATE_PROPOSAL_TYPE,
          title: proposalName,
        })

        if (isTxMined(receipt)) {
          setPayload(SubmitState.SUCCESS)
          setSuccessModalState({
            opened: true,
            title: "Success",
            text: "Congrats! You just successfully created a proposal and voted for it. Follow the proposal’s status at All proposals.",
            image: "",
            buttonText: "All proposals",
            onClick: () => {
              //TODO redirect to real proposals list
              navigate("/")
              closeSuccessModalState()
            },
          })
        }
      } catch (error: any) {
        setPayload(SubmitState.IDLE)
        if (!!error && !!error.data && !!error.data.message) {
          setError(error.data.message)
        } else {
          const errorMessage = parseTransactionError(error.toString())
          !!errorMessage && setError(errorMessage)
        }
      }
    },
    [
      govPoolContract,
      govSettingsContract,
      govSettingsAddress,
      transactionOptions,
      tryEstimateGas,
      addTransaction,
      setPayload,
      setError,
      closeSuccessModalState,
      setSuccessModalState,
      navigate,
    ]
  )

  return createDaoProposalType
}

export default useCreateDaoProposalType
