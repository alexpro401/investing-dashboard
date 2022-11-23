import { useCallback, useContext } from "react"
import { useNavigate } from "react-router-dom"

import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"
import {
  useGovPoolCreateProposal,
  useGovPoolHelperContracts,
  useGovPoolLatestProposalId,
} from "hooks/dao"
import { DistributionProposal } from "abi"
import { encodeAbiMethod } from "utils/encodeAbi"
import { parseUnits } from "@ethersproject/units"
import { isTxMined, parseTransactionError } from "utils"
import usePayload from "hooks/usePayload"
import useError from "hooks/useError"
import { SubmitState } from "constants/types"

interface ICreateProposalDistributionArgs {
  proposalName: string
  proposalDescription: string
  tokenAddress: string
  tokenAmount: string
  tokenDecimals: number
}

const useGovPoolCreateDistributionProposal = (govPoolAddress: string) => {
  const navigate = useNavigate()
  const { createGovProposal } = useGovPoolCreateProposal(govPoolAddress)
  const { updateLatesProposalId } = useGovPoolLatestProposalId(govPoolAddress)
  const { govDistributionProposalAddress } =
    useGovPoolHelperContracts(govPoolAddress)
  const { setSuccessModalState, closeSuccessModalState } = useContext(
    GovProposalCreatingContext
  )

  const [, setPayload] = usePayload()
  const [, setError] = useError()

  const createProposal = useCallback(
    async ({
      proposalName,
      proposalDescription,
      tokenAddress,
      tokenAmount,
      tokenDecimals,
    }: ICreateProposalDistributionArgs) => {
      try {
        setPayload(SubmitState.SIGN)

        const latestProposalId = await updateLatesProposalId()

        if (!latestProposalId) {
          throw new Error("invalid proposal id")
        }

        const encodedExecute = encodeAbiMethod(
          DistributionProposal,
          "execute",
          [
            latestProposalId.toNumber() + 1,
            tokenAddress,
            parseUnits(tokenAmount, tokenDecimals).toString(),
          ]
        )

        const receipt = await createGovProposal(
          { proposalName, proposalDescription },
          [govDistributionProposalAddress],
          [0],
          [encodedExecute]
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
                `/dao/${govPoolAddress}/vote/${latestProposalId.toNumber() + 1}`
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
      govDistributionProposalAddress,
      updateLatesProposalId,
      navigate,
      closeSuccessModalState,
      createGovProposal,
      govPoolAddress,
      setSuccessModalState,
      setPayload,
      setError,
    ]
  )

  return createProposal
}

export default useGovPoolCreateDistributionProposal
