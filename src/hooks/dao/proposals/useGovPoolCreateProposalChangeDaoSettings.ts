import { useCallback, useContext } from "react"
import { useNavigate } from "react-router-dom"

import { useGovPoolContract } from "contracts"
import { IpfsEntity } from "utils/ipfsEntity"
import { IGovPoolDescription } from "types/dao.types"
import { encodeAbiMethod } from "utils/encodeAbi"
import { GovPool } from "abi"
import usePayload from "hooks/usePayload"
import { useGovPoolCreateProposal } from "hooks/dao"
import { SubmitState } from "constants/types"
import { isTxMined } from "utils"
import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"

interface ICreateProposalChangeDaoSettingsArgs extends IGovPoolDescription {
  proposalName: string
  proposalDescription: string
}

const useGovPoolCreateProposalChangeDaoSettings = (govPoolAddress: string) => {
  const navigate = useNavigate()
  const { createGovProposal } = useGovPoolCreateProposal(govPoolAddress)
  const govPoolContract = useGovPoolContract(govPoolAddress)
  const { setSuccessModalState, closeSuccessModalState } = useContext(
    GovProposalCreatingContext
  )

  const [, setPayload] = usePayload()

  const createProposal = useCallback(
    async ({
      proposalName,
      proposalDescription,
      avatarUrl,
      daoName,
      websiteUrl,
      description,
      socialLinks,
      documents,
    }: ICreateProposalChangeDaoSettingsArgs) => {
      if (!govPoolContract) return

      setPayload(SubmitState.SIGN)

      const newGovPoolDescriptionIpfEntity = new IpfsEntity<string>({
        data: JSON.stringify({
          avatarUrl,
          daoName,
          websiteUrl,
          description,
          socialLinks,
          documents,
        }),
      })

      await newGovPoolDescriptionIpfEntity.uploadSelf()

      const newGovPoolDescription =
        "ipfs://" + newGovPoolDescriptionIpfEntity._path

      const encodedNewFovPoolDescription = encodeAbiMethod(
        GovPool,
        "editDescriptionURL",
        [newGovPoolDescription]
      )

      const receipt = await createGovProposal(
        { proposalName, proposalDescription },
        [govPoolAddress],
        [0],
        [encodedNewFovPoolDescription]
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
      govPoolAddress,
      closeSuccessModalState,
      navigate,
      setPayload,
      setSuccessModalState,
      createGovProposal,
    ]
  )

  return createProposal
}

export default useGovPoolCreateProposalChangeDaoSettings
