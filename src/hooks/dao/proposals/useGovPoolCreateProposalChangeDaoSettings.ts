import { useCallback, useMemo, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { parseUnits } from "@ethersproject/units"

import { useGovPoolContract } from "contracts"
import { addDaoProposalData } from "utils/ipfs"
import { IpfsEntity } from "utils/ipfsEntity"
import { IGovPoolDescription } from "types/dao.types"
import { encodeAbiMethod } from "utils/encodeAbi"
import { GovPool } from "abi"
import useError from "hooks/useError"
import usePayload from "hooks/usePayload"
import useGasTracker from "state/gas/hooks"
import { useTransactionAdder } from "state/transactions/hooks"
import { SubmitState } from "constants/types"
import { TransactionType } from "state/transactions/types"
import { isTxMined, parseTransactionError } from "utils"
import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"

interface ICreateProposalChangeDaoSettingsArgs extends IGovPoolDescription {
  proposalName: string
  proposalDescription: string
}

const useGovPoolCreateProposalChangeDaoSettings = (govPoolAddress: string) => {
  const navigate = useNavigate()
  const govPoolContract = useGovPoolContract(govPoolAddress)
  const { setSuccessModalState, closeSuccessModalState } = useContext(
    GovProposalCreatingContext
  )

  const [, setPayload] = usePayload()
  const [, setError] = useError()
  const addTransaction = useTransactionAdder()
  const [gasTrackerResponse] = useGasTracker()

  const transactionOptions = useMemo(() => {
    if (!gasTrackerResponse) return

    return {
      gasPrice: parseUnits(gasTrackerResponse.ProposeGasPrice, "gwei"),
    }
  }, [gasTrackerResponse])

  const tryEstimateGas = useCallback(
    async (daoProposalIPFSCode: string, encodedNewFovPoolDescription: any) => {
      try {
        const gas = await govPoolContract?.estimateGas.createProposal(
          daoProposalIPFSCode,
          [govPoolAddress],
          [0],
          [encodedNewFovPoolDescription],
          transactionOptions
        )

        if (!gas?._isBigNumber) {
          return
        }

        return gas
      } catch {
        return
      }
    },
    [govPoolContract, transactionOptions, govPoolAddress]
  )

  const createProposal = useCallback(
    async (args: ICreateProposalChangeDaoSettingsArgs) => {
      if (!govPoolContract) return

      const {
        proposalName,
        proposalDescription,
        avatarUrl,
        daoName,
        websiteUrl,
        description,
        socialLinks,
        documents,
      } = args

      try {
        setPayload(SubmitState.SIGN)

        let { path: daoProposalIPFSCode } = await addDaoProposalData({
          proposalName,
          proposalDescription,
        })
        daoProposalIPFSCode = "ipfs://" + daoProposalIPFSCode

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

        const gasLimit = await tryEstimateGas(
          daoProposalIPFSCode,
          encodedNewFovPoolDescription
        )

        const resultTransaction = await govPoolContract.createProposal(
          daoProposalIPFSCode,
          [govPoolAddress],
          [0],
          [encodedNewFovPoolDescription],
          { ...transactionOptions, gasLimit }
        )

        setPayload(SubmitState.WAIT_CONFIRM)
        const receipt = await addTransaction(resultTransaction, {
          type: TransactionType.GOV_POOL_CREATE_CHANGE_DAO_SETTINGS_PROPOSAL,
          title: proposalName,
        })

        if (isTxMined(receipt)) {
          setPayload(SubmitState.SUCCESS)
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
      govPoolContract,
      govPoolAddress,
      transactionOptions,
      tryEstimateGas,
      addTransaction,
      closeSuccessModalState,
      navigate,
      setPayload,
      setError,
      setSuccessModalState,
    ]
  )

  return createProposal
}

export default useGovPoolCreateProposalChangeDaoSettings
