import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react"
import { parseUnits, parseEther } from "@ethersproject/units"
import { usePoolContract } from "hooks/usePool"
import { useTraderPoolContract } from "contracts"
import { useWeb3React } from "@web3-react/core"
import { TransactionType } from "state/transactions/types"
import { useTransactionAdder } from "state/transactions/hooks"
import {
  useInvestTraderPoolContract,
  useTraderPoolInvestProposalContract,
} from "contracts"
import { parseTransactionError, isTxMined } from "utils"
import { BigNumber } from "@ethersproject/bignumber"
import { SubmitState } from "consts/types"
import useError from "hooks/useError"
import usePayload from "hooks/usePayload"
import { IpfsEntity } from "utils/ipfsEntity"
import { useCreateInvestProposalContext } from "context/fund/CreateInvestProposalContext"
import { useEffectOnce, useUnmount } from "react-use"

const useCreateInvestmentProposal = (
  poolAddress: string | undefined
): [
  {
    lpAvailable: BigNumber | undefined
    isDateOpen: boolean
    error: string
    payload: SubmitState
    totalProposals: number
    poolSymbol: string | undefined
  },
  {
    setPayload: (params: SubmitState) => void
    setDateOpen: Dispatch<SetStateAction<boolean>>
    handleSubmit: () => void
  }
] => {
  const { account } = useWeb3React()

  const { symbol, description, lpAmount, timestampLimit, investLPLimit } =
    useCreateInvestProposalContext()

  const [lpAvailable, setLpAvailable] = useState<BigNumber | undefined>()
  const [isDateOpen, setDateOpen] = useState(false)
  const [error, setError] = useError()
  const [payload, setPayload] = usePayload()
  const [totalProposals, setTotalProposals] = useState<number>(0)

  const traderPool = useTraderPoolContract(poolAddress)
  const investTraderPool = useInvestTraderPoolContract(poolAddress)
  const addTransaction = useTransactionAdder()
  const [, poolInfo] = usePoolContract(poolAddress)
  const investProposal = useTraderPoolInvestProposalContract(poolAddress)

  useEffectOnce(() => setPayload(SubmitState.IDLE))
  useUnmount(() => setPayload(SubmitState.IDLE))

  const updateTotalProposals = useCallback(async () => {
    if (!investProposal) return

    try {
      const total = await investProposal.proposalsTotalNum()

      setTotalProposals(total.toNumber())
    } catch (e) {
      console.error(e)
    }
  }, [investProposal])

  const handleSubmit = useCallback(async () => {
    if (!investTraderPool || !traderPool || !account) return

    try {
      setPayload(SubmitState.SIGN)
      setError("")
      const amount = parseEther(lpAmount.get).toHexString()

      const divests = await traderPool.getDivestAmountsAndCommissions(
        account,
        amount
      )

      const investProposalIpfsEntity = new IpfsEntity({
        data: JSON.stringify({
          ticker: symbol.get,
          account,
          description: description.get,
          timestamp: new Date().getTime() / 1000,
        }),
      })

      await investProposalIpfsEntity.uploadSelf()

      const investLPLimitHex = parseUnits(investLPLimit.get, 18).toHexString()

      const createReceipt = await investTraderPool.createProposal(
        investProposalIpfsEntity._path as string,
        amount,
        { timestampLimit: timestampLimit.get, investLPLimit: investLPLimitHex },
        divests.receptions.receivedAmounts
      )

      setPayload(SubmitState.WAIT_CONFIRM)

      const receipt = await addTransaction(createReceipt, {
        type: TransactionType.INVEST_PROPOSAL_CREATE,
        amount,
        ipfsPath: investProposalIpfsEntity._path,
        investLpAmountRaw: investLPLimitHex,
      })

      if (isTxMined(receipt)) {
        setPayload(SubmitState.SUCCESS)
      }
    } catch (error: any) {
      setPayload(SubmitState.IDLE)

      if (!!error && !!error.data && !!error.data.message) {
        setError(error.data.message)
      } else {
        const errorMessage = parseTransactionError(error.toString())
        !!errorMessage && setError(errorMessage)
      }
    }
  }, [
    account,
    addTransaction,
    description.get,
    investLPLimit.get,
    investTraderPool,
    lpAmount.get,
    setError,
    setPayload,
    symbol.get,
    timestampLimit,
    traderPool,
  ])

  // update balance
  useEffect(() => {
    if (!traderPool || !account) return

    const getBalance = async () => {
      const lpAvailable: BigNumber = await traderPool.balanceOf(account)
      setLpAvailable(lpAvailable)
    }

    getBalance().catch(console.error)
  }, [traderPool, account])

  // watch for transaction confirm & check proposals count
  useEffect(() => {
    if (payload === SubmitState.SUCCESS) {
      updateTotalProposals()
    }
  }, [payload, updateTotalProposals])

  // watch for proposals length
  useEffect(() => {
    updateTotalProposals()
  }, [updateTotalProposals])

  return [
    {
      lpAvailable,
      payload,
      isDateOpen,
      error,
      totalProposals,
      poolSymbol: poolInfo?.ticker,
    },
    {
      setDateOpen,
      setPayload,
      handleSubmit,
    },
  ]
}

export default useCreateInvestmentProposal
