import { useCallback, useContext } from "react"
import { parseEther, parseUnits } from "@ethersproject/units"
import { generatePath, useNavigate } from "react-router-dom"

import { useGovPoolContract } from "contracts"
import { encodeAbiMethod } from "utils/encodeAbi"
import { GovSettings } from "abi"
import { useGovPoolHelperContracts } from "hooks/dao"
import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"
import usePayload from "hooks/usePayload"
import { useGovPoolCreateProposal, useGovPoolLatestProposalId } from "hooks/dao"
import { SubmitState } from "constants/types"
import { isTxMined } from "utils"
import { ROUTE_PATHS, ZERO_ADDR } from "constants/index"

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
  const { govSettingsAddress } = useGovPoolHelperContracts(daoPoolAddress)
  const { createGovProposal } = useGovPoolCreateProposal(daoPoolAddress)
  const { updateLatesProposalId } = useGovPoolLatestProposalId(daoPoolAddress)

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
        "",
        [govSettingsAddress],
        [0],
        [encodedChangeSettingsMethod]
      )

      if (isTxMined(receipt)) {
        const latestProposalId = await updateLatesProposalId()

        setSuccessModalState({
          opened: true,
          title: "Success",
          text: "Congrats! You just successfully created a proposal. Now you should vote for it",
          image: "",
          buttonText: "Vote",
          onClick: () => {
            navigate(
              generatePath(ROUTE_PATHS.daoProposalVoting, {
                daoProposal: daoPoolAddress,
                proposalId: String(latestProposalId),
              })
            )
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
      updateLatesProposalId,
      daoPoolAddress,
    ]
  )

  return createDaoProposalType
}

export default useGovPoolCreateProposalChangeSettings
