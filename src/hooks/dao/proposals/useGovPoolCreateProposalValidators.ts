import { useCallback, useContext } from "react"
import { useNavigate } from "react-router-dom"

import { useGovPoolContract } from "contracts"
import { useGovValidatorsContractAddress } from "../useGovValidatorsContractAddress"
import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"
import { encodeAbiMethod } from "utils/encodeAbi"
import { GovValidators } from "abi"
import usePayload from "hooks/usePayload"
import { useGovPoolCreateProposal } from "hooks/dao"
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
  const govValidatorsAddress = useGovValidatorsContractAddress(govPoolAddress)
  const { createGovProposal } = useGovPoolCreateProposal(govPoolAddress)

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
        setSuccessModalState({
          opened: true,
          title: "Success",
          text: "Congrats! You just successfully created a proposal and voted for it. Follow the proposal’s status at All proposals.",
          image: "",
          buttonText: "Proposals",
          onClick: () => {
            //TODO redirect to real validators proposals list
            navigate("/")
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
    ]
  )

  return createProposal
}

export default useGovPoolCreateProposalValidators
