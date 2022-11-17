import { useCallback, useContext } from "react"
import { parseEther, parseUnits } from "@ethersproject/units"
import { useNavigate } from "react-router-dom"

import { useGovPoolContract } from "contracts"
import { addDaoProposalData } from "utils/ipfs"
import { encodeAbiMethod } from "utils/encodeAbi"
import { GovSettings } from "abi"
import {
  useGovSettingsNewSettingId,
  useGovSettingsAddress,
  useGovPoolCreateProposal,
} from "hooks/dao"
import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"
import usePayload from "hooks/usePayload"
import { SubmitState } from "constants/types"
import { isTxMined } from "utils"
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
    validatorsVote: boolean
    duration: number
    durationValidators: number
    quorum: string
    quorumValidators: string
    minVotesForVoting: string
    minVotesForCreating: string
    rewardToken: string
    creationReward: string
    executionReward: string
    voteRewardsCoefficient: string
  }
}

interface IUseGovPoolCreateProposalTypeProps {
  daoPoolAddress: string
}

const useGovPoolCreateProposalType = ({
  daoPoolAddress,
}: IUseGovPoolCreateProposalTypeProps) => {
  const navigate = useNavigate()
  const govSettingsAddress = useGovSettingsAddress(daoPoolAddress)
  const { createGovProposal } = useGovPoolCreateProposal(daoPoolAddress)
  const { setSuccessModalState, closeSuccessModalState } = useContext(
    GovProposalCreatingContext
  )

  const [, setPayload] = usePayload()
  const [newSettingId] = useGovSettingsNewSettingId({
    daoAddress: daoPoolAddress,
  })

  const govPoolContract = useGovPoolContract(daoPoolAddress)

  const createDaoProposalType = useCallback(
    async (args: ICreateDaoProposalTypeArgs) => {
      if (!govPoolContract || !newSettingId) return

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
          validatorsVote,
          duration,
          durationValidators,
          quorum,
          quorumValidators,
          minVotesForVoting,
          minVotesForCreating,
          rewardToken,
          creationReward,
          executionReward,
          voteRewardsCoefficient,
        },
      } = args

      setPayload(SubmitState.SIGN)

      let { path: daoProposalTypeIPFSCode } = await addDaoProposalData({
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
              quorum: parseUnits(quorum, 25).toString(),
              quorumValidators: parseUnits(quorumValidators, 25).toString(),
              minVotesForVoting: parseEther(minVotesForVoting).toString(),
              minVotesForCreating: parseEther(minVotesForCreating).toString(),
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

      const receipt = await createGovProposal(
        { proposalName, proposalDescription },
        [govSettingsAddress, govSettingsAddress],
        [0, 0],
        [encodedAddSettingsMethod, encodedChangeExecuterMethod]
      )

      if (isTxMined(receipt)) {
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
    },
    [
      govPoolContract,
      govSettingsAddress,
      setPayload,
      closeSuccessModalState,
      setSuccessModalState,
      navigate,
      newSettingId,
      createGovProposal,
    ]
  )

  return createDaoProposalType
}

export default useGovPoolCreateProposalType
