import { useCallback, useMemo, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { parseUnits } from "@ethersproject/units"
import { BigNumberish } from "@ethersproject/bignumber"

import { useGovValidatorsContract } from "contracts"
import useError from "hooks/useError"
import usePayload from "hooks/usePayload"
import useGasTracker from "state/gas/hooks"
import { SubmitState } from "consts/types"
import { isTxMined, parseTransactionError } from "utils"
import { useTransactionAdder } from "state/transactions/hooks"
import { TransactionType } from "state/transactions/types"
import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"
import { useActiveWeb3React } from "hooks"
import { useGovPoolLatestProposalId } from "hooks/dao"
import { IpfsEntity } from "utils/ipfsEntity"

interface IProps {
  daoAddress: string
}

const useGovPoolCreateValidatorInternalProposal = ({ daoAddress }: IProps) => {
  const navigate = useNavigate()
  const { account } = useActiveWeb3React()
  const govValidatorsContract = useGovValidatorsContract(daoAddress)

  const [, setPayload] = usePayload()
  const [, setError] = useError()
  const [gasTrackerResponse] = useGasTracker()
  const addTransaction = useTransactionAdder()
  const { setSuccessModalState, closeSuccessModalState } = useContext(
    GovProposalCreatingContext
  )
  const { updateLatesProposalId } = useGovPoolLatestProposalId(daoAddress)

  const transactionOptions = useMemo(() => {
    if (!gasTrackerResponse) return

    return {
      gasPrice: parseUnits(gasTrackerResponse.ProposeGasPrice, "gwei"),
    }
  }, [gasTrackerResponse])

  const tryEstimateGas = useCallback(
    async (
      proposalType: number,
      daoProposalIPFSCode: string,
      values: BigNumberish[],
      users: string[]
    ) => {
      if (!govValidatorsContract) return

      try {
        const gas =
          await govValidatorsContract?.estimateGas.createInternalProposal(
            proposalType,
            daoProposalIPFSCode,
            values,
            users,
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
    [govValidatorsContract, transactionOptions]
  )

  const createFunction = useCallback(
    async ({
      internalProposalType,
      values,
      users,
      proposalName,
      proposalDescription,
    }: {
      internalProposalType: number
      values: BigNumberish[]
      users: string[]
      proposalName: string
      proposalDescription: string
    }) => {
      if (!govValidatorsContract || !account) return

      try {
        setPayload(SubmitState.SIGN)

        const daoProposalIpfsEntity = new IpfsEntity({
          data: JSON.stringify({
            proposalName,
            proposalDescription,
            timestamp: new Date().getTime() / 1000,
          }),
        })

        await daoProposalIpfsEntity.uploadSelf()

        const daoProposalIPFSCode = "ipfs://" + daoProposalIpfsEntity._path

        const gasLimit = await tryEstimateGas(
          internalProposalType,
          daoProposalIPFSCode,
          values,
          users
        )

        const resultTransaction =
          await govValidatorsContract.createInternalProposal(
            internalProposalType,
            daoProposalIPFSCode,
            values,
            users,
            { ...transactionOptions, gasLimit, from: account }
          )

        setPayload(SubmitState.WAIT_CONFIRM)

        const receipt = await addTransaction(resultTransaction, {
          type: TransactionType.GOV_POOL_CREATE_PROPOSAL,
        })

        if (isTxMined(receipt)) {
          const latestProposalId = await updateLatesProposalId()
          setPayload(SubmitState.SUCCESS)

          setSuccessModalState({
            opened: true,
            title: "Success",
            text: "Congrats! You just successfully created an internal proposal. Now you should vote for it",
            image: "",
            buttonText: "Vote",
            onClick: () => {
              navigate({
                pathname: `/dao/${daoAddress}/validators-vote/${latestProposalId}`,
                search: "?isInternal=true",
              })
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
      daoAddress,
      updateLatesProposalId,
      govValidatorsContract,
      setPayload,
      setError,
      transactionOptions,
      tryEstimateGas,
      navigate,
      addTransaction,
      closeSuccessModalState,
      setSuccessModalState,
      account,
    ]
  )

  return createFunction
}

export default useGovPoolCreateValidatorInternalProposal
