import { useCallback, useContext } from "react"
import { generatePath, useNavigate } from "react-router-dom"

import { useTokenSaleProposalContract } from "contracts"
import { useActiveWeb3React } from "hooks"
import {
  useGovPoolLatestProposalId,
  useGovPoolCreateProposal,
  useGovTokenSaleContractAddress,
} from "hooks/dao"
import usePayload from "hooks/usePayload"
import useError from "hooks/useError"
import { isTxMined, parseTransactionError } from "utils"
import { encodeAbiMethod } from "utils/encodeAbi"
import { SubmitState } from "consts/types"
import { ROUTE_PATHS } from "consts"
import { TokenSaleProposal as TokenSaleProposalABI } from "abi"
import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"

interface ITier {
  metadata: {
    name: string
    description: string
  }
  totalTokenProvided: string
  saleStartTime: string
  saleEndTime: string
  saleTokenAddress: string
  purchaseTokenAddresses: string[]
  exchangeRates: string[]
  minAllocationPerUser: string
  maxAllocationPerUser: string
  vestingSettings: {
    vestingPercentage: string
    vestingDuration: string
    cliffPeriod: string
    unlockStep: string
  }
}

interface ICreateProposalArgs {
  tiers: ITier[]
  proposalName: string
  proposalDescription: string
}

const useGovPoolCreateTokenSaleProposal = ({
  govPoolAddress,
}: {
  govPoolAddress?: string | undefined
}) => {
  const navigate = useNavigate()
  const tokenSaleProposalContractAddress =
    useGovTokenSaleContractAddress(govPoolAddress)
  const tokenSaleProposalContract = useTokenSaleProposalContract(govPoolAddress)

  const { setSuccessModalState, closeSuccessModalState } = useContext(
    GovProposalCreatingContext
  )

  const { createGovProposal } = useGovPoolCreateProposal(govPoolAddress)
  const { updateLatesProposalId } = useGovPoolLatestProposalId(govPoolAddress)
  const { account } = useActiveWeb3React()
  const [, setPayload] = usePayload()
  const [, setError] = useError()

  const createProposal = useCallback(
    async ({
      tiers,
      proposalName,
      proposalDescription,
    }: ICreateProposalArgs) => {
      if (
        !tokenSaleProposalContract ||
        !account ||
        !govPoolAddress ||
        !tokenSaleProposalContractAddress
      )
        return

      try {
        setPayload(SubmitState.SIGN)

        const latestProposalId = await updateLatesProposalId()

        if (!latestProposalId) {
          throw new Error("invalid proposal id")
        }

        const encodedCreateTiersExecution = encodeAbiMethod(
          TokenSaleProposalABI,
          "createTiers",
          [JSON.parse(JSON.stringify(tiers))]
        )

        const receipt = await createGovProposal(
          { proposalName, proposalDescription },
          "",
          [tokenSaleProposalContractAddress],
          [0],
          [encodedCreateTiersExecution]
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
                  daoPoolAddress: govPoolAddress,
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
      tokenSaleProposalContract,
      navigate,
      setSuccessModalState,
      closeSuccessModalState,
      govPoolAddress,
      account,
      updateLatesProposalId,
      setPayload,
      createGovProposal,
      setError,
      tokenSaleProposalContractAddress,
    ]
  )

  return createProposal
}

export default useGovPoolCreateTokenSaleProposal
