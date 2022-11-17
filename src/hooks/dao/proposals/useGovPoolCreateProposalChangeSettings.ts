import { useCallback, useContext } from "react"
import { parseEther, parseUnits } from "@ethersproject/units"
import { useNavigate } from "react-router-dom"

import { useGovPoolContract } from "contracts"
import { encodeAbiMethod } from "utils/encodeAbi"
import { GovSettings } from "abi"
import { useGovSettingsAddress } from "hooks/dao"
import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"
import usePayload from "hooks/usePayload"
import { useGovPoolCreateProposal } from "hooks/dao"
import { SubmitState } from "constants/types"
import { isTxMined } from "utils"
import { ZERO_ADDR } from "constants/index"

interface ICreateProposalChangeSettingsArgs {
  proposalInfo: {
    proposalName: string
    proposalDescription: string
  }
  settingId: number
  setting: {
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
    executorDescription: string
  }
}

interface IUseGovPoolCreateProposalChangeSettings {
  daoPoolAddress: string
}

const useGovPoolCreateProposalChangeSettings = ({
  daoPoolAddress,
}: IUseGovPoolCreateProposalChangeSettings) => {
  const navigate = useNavigate()
  const govSettingsAddress = useGovSettingsAddress(daoPoolAddress)
  const { createGovProposal } = useGovPoolCreateProposal(daoPoolAddress)
  const { setSuccessModalState, closeSuccessModalState } = useContext(
    GovProposalCreatingContext
  )

  const [, setPayload] = usePayload()

  const govPoolContract = useGovPoolContract(daoPoolAddress)

  const createDaoProposalType = useCallback(
    async (args: ICreateProposalChangeSettingsArgs) => {
      if (!govPoolContract) return

      const {
        proposalInfo: { proposalDescription, proposalName },
        settingId,
        setting: {
          earlyCompletion,
          delegatedVotingAllowed,
          validatorsVote,
          duration,
          quorum,
          minVotesForVoting,
          minVotesForCreating,
          rewardToken,
          creationReward,
          executionReward,
          voteRewardsCoefficient,
          executorDescription,
          durationValidators,
          quorumValidators,
        },
      } = args

      setPayload(SubmitState.SIGN)

      const encodedChangeSettingsMethod = encodeAbiMethod(
        GovSettings,
        "editSettings",
        [
          [settingId],
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
              executorDescription,
            },
          ],
        ]
      )

      const receipt = await createGovProposal(
        { proposalName, proposalDescription },
        [govSettingsAddress],
        [0],
        [encodedChangeSettingsMethod]
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
      createGovProposal,
    ]
  )

  return createDaoProposalType
}

export default useGovPoolCreateProposalChangeSettings
