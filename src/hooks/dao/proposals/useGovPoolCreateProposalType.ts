import { useCallback, useContext } from "react"
import { parseEther, parseUnits } from "@ethersproject/units"
import { generatePath, useNavigate } from "react-router-dom"

import { useGovPoolContract } from "contracts"
import { encodeAbiMethod } from "utils/encodeAbi"
import { GovSettings } from "abi"
import {
  useGovSettingsNewSettingId,
  useGovPoolHelperContracts,
  useGovPoolCreateProposal,
  useGovPoolLatestProposalId,
} from "hooks/dao"
import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"
import usePayload from "hooks/usePayload"
import { SubmitState } from "consts/types"
import { isTxMined } from "utils"
import { ROUTE_PATHS, ZERO_ADDR } from "consts"
import { IpfsEntity } from "utils/ipfsEntity"

interface ICreateDaoProposalTypeArgs {
  proposalInfo: {
    executors: string[]
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
  const { govSettingsAddress } = useGovPoolHelperContracts(daoPoolAddress)
  const { createGovProposal } = useGovPoolCreateProposal(daoPoolAddress)
  const { updateLatesProposalId } = useGovPoolLatestProposalId(daoPoolAddress)

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
          executors,
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

      const daoProposalIpfsEntity = new IpfsEntity({
        data: JSON.stringify({
          proposalName: proposalTypeName,
          proposalDescription: proposalTypeDescription,
          timestamp: new Date().getTime() / 1000,
        }),
      })

      await daoProposalIpfsEntity.uploadSelf()

      const daoProposalTypeIPFSCode = "ipfs://" + daoProposalIpfsEntity._path

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
        [executors, executors.map(() => newSettingId)]
      )

      const receipt = await createGovProposal(
        { proposalName, proposalDescription },
        "",
        [govSettingsAddress, govSettingsAddress],
        [0, 0],
        [encodedAddSettingsMethod, encodedChangeExecuterMethod]
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
                daoPoolAddress: daoPoolAddress,
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
      newSettingId,
      createGovProposal,
      updateLatesProposalId,
      daoPoolAddress,
    ]
  )

  return createDaoProposalType
}

export default useGovPoolCreateProposalType
