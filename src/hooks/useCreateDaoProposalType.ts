import { useCallback, useMemo, useContext } from "react"
import { parseEther, parseUnits } from "@ethersproject/units"
import { useNavigate } from "react-router-dom"

import { useGovPoolContract } from "contracts"
import { addDaoProposalTypeData } from "utils/ipfs"
import { EExecutor } from "interfaces/contracts/IGovPoolSettings"
import { encodeAbiMethod } from "utils/encodeAbi"
import { GovSettings } from "abi"
import useGasTracker from "state/gas/hooks"
import useDaoPoolSetting, { useGovSettingsAddress } from "./useDaoPoolSetting"
import useDaoPoolNewSettingId from "./useDaoPoolNewSettingId"
import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"
import useError from "hooks/useError"
import usePayload from "./usePayload"
import { useTransactionAdder } from "state/transactions/hooks"
import { SubmitState } from "constants/types"
import { TransactionType } from "state/transactions/types"
import { isTxMined, parseTransactionError } from "utils"
import { ZERO_ADDR } from "constants/index"

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
    creationReward: string
    executionReward: string
    voteRewardsCoefficient: string
  }
}

interface IUseCreateDaoProposalTypeProps {
  daoPoolAddress: string
}

const useCreateDaoProposalType = ({
  daoPoolAddress,
}: IUseCreateDaoProposalTypeProps) => {
  const navigate = useNavigate()
  const govSettingsAddress = useGovSettingsAddress(daoPoolAddress)
  const { setSuccessModalState, closeSuccessModalState } = useContext(
    GovProposalCreatingContext
  )

  const addTransaction = useTransactionAdder()
  const [, setPayload] = usePayload()
  const [, setError] = useError()
  const [gasTrackerResponse] = useGasTracker()
  const [newSettingId, newSettingIdLoading, newSettingIdError] =
    useDaoPoolNewSettingId({ daoAddress: daoPoolAddress })
  const [daoDefaultSettings, settingsLoading, settingsError] =
    useDaoPoolSetting({
      daoAddress: daoPoolAddress,
      settingsId: EExecutor.DEFAULT,
    })

  const govPoolContract = useGovPoolContract(daoPoolAddress)

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

  const createDaoProposalType = useCallback(
    async (args: ICreateDaoProposalTypeArgs) => {
      if (
        !govPoolContract ||
        newSettingIdLoading ||
        newSettingIdError ||
        settingsLoading ||
        settingsError ||
        !daoDefaultSettings
      )
        return

      const { validatorsVote, durationValidators, quorumValidators } =
        daoDefaultSettings

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
                earlyCompletion,
                delegatedVotingAllowed,
                validatorsVote,
                duration,
                durationValidators,
                quorum: parseUnits(String(quorum), 25).toString(),
                quorumValidators,
                minVotesForVoting: parseEther(
                  String(minVotesForVoting)
                ).toString(),
                minVotesForCreating: parseEther(
                  String(minVotesForCreating)
                ).toString(),
                rewardToken: rewardToken || ZERO_ADDR,
                creationReward: parseUnits(creationReward, 18).toString(),
                executionReward: parseUnits(executionReward, 18).toString(),
                voteRewardsCoefficient: parseUnits(
                  voteRewardsCoefficient,
                  18
                ).toString(),
                executorDescription: daoProposalTypeIPFSCode,
              },
            ],
          ]
        )

        const encodedChangeExecuterMethod = encodeAbiMethod(
          GovSettings,
          "changeExecutors",
          [[contractAddress], [newSettingId]]
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
      govSettingsAddress,
      transactionOptions,
      tryEstimateGas,
      addTransaction,
      setPayload,
      setError,
      closeSuccessModalState,
      setSuccessModalState,
      navigate,
      daoDefaultSettings,
      newSettingId,
      newSettingIdLoading,
      newSettingIdError,
      settingsLoading,
      settingsError,
    ]
  )

  return createDaoProposalType
}

export default useCreateDaoProposalType
