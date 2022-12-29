import { useCallback, useContext } from "react"
import { generatePath, useNavigate } from "react-router-dom"

import { useGovPoolCreateProposal } from "./useGovPoolCreateProposal"
import useGovPoolLatestProposalId from "../useGovPoolLatestProposalId"
import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"
import usePayload from "hooks/usePayload"
import useError from "hooks/useError"
import { SubmitState } from "consts/types"
import { isTxMined, parseTransactionError } from "utils"
import { ROUTE_PATHS } from "consts"

interface ICreateProposalArgs {
  executors: string[]
  misc: string
  values: string[]
  data: string[]
  proposalName: string
  proposalDescription: string
}

const useGovPoolCreateCustomProposalManual = (
  govPoolAddress: string | undefined
) => {
  const navigate = useNavigate()
  const { createGovProposal } = useGovPoolCreateProposal(govPoolAddress)
  const { updateLatesProposalId } = useGovPoolLatestProposalId(govPoolAddress)
  const { setSuccessModalState, closeSuccessModalState } = useContext(
    GovProposalCreatingContext
  )

  const [, setPayload] = usePayload()
  const [, setError] = useError()

  const createProposal = useCallback(
    async ({
      data,
      misc,
      executors,
      proposalDescription,
      proposalName,
      values,
    }: ICreateProposalArgs) => {
      try {
        setPayload(SubmitState.SIGN)

        const latestProposalId = await updateLatesProposalId()

        if (!latestProposalId) {
          throw new Error("invalid proposal id")
        }

        const receipt = await createGovProposal(
          { proposalName, proposalDescription },
          misc,
          executors,
          values,
          data
        )

        if (isTxMined(receipt)) {
          setSuccessModalState({
            opened: true,
            title: "Success",
            text: "Congrats! You just successfully created a proposal. Now you should vote for it",
            image: "",
            buttonText: "Vote",
            onClick: () => {
              navigate(
                generatePath(ROUTE_PATHS.daoProposalVoting, {
                  daoProposal: govPoolAddress,
                  proposalId: String(latestProposalId.toNumber() + 1),
                })
              )
              closeSuccessModalState()
            },
          })
        }
      } catch (error: any) {
        console.log(error)
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
      createGovProposal,
      setSuccessModalState,
      closeSuccessModalState,
      navigate,
      govPoolAddress,
      setError,
      setPayload,
      updateLatesProposalId,
    ]
  )

  return createProposal
}

export default useGovPoolCreateCustomProposalManual
