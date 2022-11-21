import { useCallback, useContext } from "react"
import { useNavigate } from "react-router-dom"

import { useGovPoolContract } from "contracts"
import { useGovPoolHelperContracts } from ".."
import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"
import { encodeAbiMethod } from "utils/encodeAbi"
import { GovValidators } from "abi"
import usePayload from "hooks/usePayload"
import { useGovPoolCreateProposal, useGovPoolLatestProposalId } from "hooks/dao"
import { SubmitState } from "constants/types"
import { isTxMined } from "utils"

interface ICreateProposalArgs {
  proposalName: string
  proposalDescription: string
  users: string[]
  balances: string[]
}

const useGovPoolCreateProposalValidators = (govPoolAddress: string) => {
  const navigate = useNavigate()
  const govPoolContract = useGovPoolContract(govPoolAddress)
  const { govValidatorsAddress } = useGovPoolHelperContracts(govPoolAddress)
  const { createGovProposal } = useGovPoolCreateProposal(govPoolAddress)
  const { updateLatesProposalId } = useGovPoolLatestProposalId(govPoolAddress)

  const [, setPayload] = usePayload()
  const { setSuccessModalState, closeSuccessModalState } = useContext(
    GovProposalCreatingContext
  )

  const createProposal = useCallback(
    async (args: ICreateProposalArgs) => {
      if (!govPoolContract || !govValidatorsAddress) return

      const { proposalName, proposalDescription, users, balances } = args

      setPayload(SubmitState.SIGN)

      const encodedChangeBalancesMethod = encodeAbiMethod(
        GovValidators,
        "changeBalances",
        [balances, users]
      )

      const receipt = await createGovProposal(
        { proposalName, proposalDescription },
        [govValidatorsAddress],
        [0],
        [encodedChangeBalancesMethod]
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
            navigate(`/dao/${govPoolAddress}/vote/${latestProposalId}`)
            closeSuccessModalState()
          },
        })
      }
    },
    [
      govPoolContract,
      govValidatorsAddress,
      setPayload,
      closeSuccessModalState,
      navigate,
      setSuccessModalState,
      createGovProposal,
      updateLatesProposalId,
      govPoolAddress,
    ]
  )

  return createProposal
}

export default useGovPoolCreateProposalValidators
