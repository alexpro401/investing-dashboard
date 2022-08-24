import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react"
import { parseUnits, parseEther } from "@ethersproject/units"
import { usePoolContract, useTraderPool } from "hooks/usePool"
import { useWeb3React } from "@web3-react/core"
import getTime from "date-fns/getTime"
import { addDays } from "date-fns/esm"
import { TransactionType } from "state/transactions/types"
import { useTransactionAdder } from "state/transactions/hooks"
import { addInvestProposalMetadata } from "utils/ipfs"
import { shortTimestamp } from "utils"
import {
  useInvestPoolContract,
  useInvestProposalContract,
} from "hooks/useContract"
import { parseTransactionError, isTxMined } from "utils"
import { BigNumber } from "@ethersproject/bignumber"
import { IValidationError, SubmitState } from "constants/types"
import { ZERO } from "constants/index"

const useCreateInvestmentProposal = (
  poolAddress: string | undefined
): [
  {
    lpAmount: string
    lpAvailable: BigNumber | undefined
    ticker: string
    description: string
    timestampLimit: number
    investLPLimit: string
    isDateOpen: boolean
    error: string
    isSubmiting: SubmitState
    validationErrors: IValidationError[]
    totalProposals: number
    poolSymbol: string | undefined
  },
  {
    setLpAmount: (value: string) => void
    setTicker: (value: string) => void
    setDescription: (value: string) => void
    setTimestampLimit: (value: number) => void
    setInvestLPLimit: (value: string) => void
    setSubmiting: Dispatch<SetStateAction<SubmitState>>
    setDateOpen: Dispatch<SetStateAction<boolean>>
    setError: Dispatch<SetStateAction<string>>
    handleSubmit: () => void
  }
] => {
  const { account } = useWeb3React()
  const initialTimeLimit = shortTimestamp(getTime(addDays(new Date(), 30)))

  const [lpAvailable, setLpAvailable] = useState<BigNumber | undefined>()
  const [isDateOpen, setDateOpen] = useState(false)
  const [error, setError] = useState("")
  const [isSubmiting, setSubmiting] = useState(SubmitState.IDLE)
  const [lpAmount, setLpAmount] = useState("")
  const [ticker, setTicker] = useState("")
  const [description, setDescription] = useState("")
  const [timestampLimit, setTimestampLimit] = useState(initialTimeLimit)
  const [investLPLimit, setInvestLPLimit] = useState("")
  const [totalProposals, setTotalProposals] = useState<number>(0)

  const [validationErrors, setValidationErrors] = useState<IValidationError[]>(
    []
  )

  const traderPool = useTraderPool(poolAddress)
  const investTraderPool = useInvestPoolContract(poolAddress)
  const addTransaction = useTransactionAdder()
  const [, poolInfo] = usePoolContract(poolAddress)
  const [investProposal] = useInvestProposalContract(poolAddress)

  const updateTotalProposals = useCallback(async () => {
    if (!investProposal) return

    const total = await investProposal.proposalsTotalNum()
    setTotalProposals(total.toNumber())
  }, [investProposal])

  const handleValidate = useCallback(() => {
    const errors: IValidationError[] = []

    // LP allocated for RP
    if (investLPLimit === "" || isNaN(parseFloat(investLPLimit))) {
      errors.push({
        message: "LP amount is required",
        field: "investLPLimit",
      })
    } else if (parseEther(investLPLimit).lte(ZERO)) {
      errors.push({
        field: "investLPLimit",
        message: "LP allocated for Invest proposal must be greater than 0",
      })
    }

    // deposit LP amount
    if (lpAmount === "" || isNaN(parseFloat(lpAmount))) {
      errors.push({
        message: "LP amount is required",
        field: "lpAmount",
      })
    } else if (parseEther(lpAmount).lte(ZERO)) {
      errors.push({
        field: "lpAmount",
        message: "LP allocation amount must be greater than 0",
      })
    }

    setValidationErrors(errors)

    return !errors.length
  }, [investLPLimit, lpAmount])

  const handleSubmit = () => {
    if (!investTraderPool || !traderPool) return

    if (!handleValidate()) return

    const createInvestProposal = async () => {
      setSubmiting(SubmitState.SIGN)
      setError("")
      const amount = parseEther(lpAmount).toHexString()

      const divests = await traderPool.getDivestAmountsAndCommissions(
        account,
        amount
      )

      const ipfsReceipt = await addInvestProposalMetadata(
        ticker,
        description,
        account
      )

      const investLPLimitHex = parseUnits(investLPLimit, 18).toHexString()

      const createReceipt = await investTraderPool.createProposal(
        ipfsReceipt.path,
        amount,
        [timestampLimit, investLPLimitHex],
        divests.receptions.receivedAmounts
      )

      setSubmiting(SubmitState.WAIT_CONFIRM)

      const receipt = await addTransaction(createReceipt, {
        type: TransactionType.INVEST_PROPOSAL_CREATE,
        amount,
        ipfsPath: ipfsReceipt.path,
        investLpAmountRaw: investLPLimitHex,
      })

      if (isTxMined(receipt)) {
        setSubmiting(SubmitState.SUCCESS)
      }
    }

    createInvestProposal().catch((error) => {
      setSubmiting(SubmitState.IDLE)

      if (!!error && !!error.data && !!error.data.message) {
        setError(error.data.message)
      } else {
        const errorMessage = parseTransactionError(error.toString())
        !!errorMessage && setError(errorMessage)
      }
    })
  }

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
    if (isSubmiting === SubmitState.SUCCESS) {
      updateTotalProposals()
    }
  }, [isSubmiting, updateTotalProposals])

  // watch for proposals length
  useEffect(() => {
    updateTotalProposals()
  }, [updateTotalProposals])

  return [
    {
      lpAmount,
      lpAvailable,
      ticker,
      description,
      timestampLimit,
      investLPLimit,
      isSubmiting,
      isDateOpen,
      error,
      validationErrors,
      totalProposals,
      poolSymbol: poolInfo?.ticker,
    },
    {
      setLpAmount,
      setTicker,
      setDescription,
      setTimestampLimit,
      setInvestLPLimit,
      setSubmiting,
      setDateOpen,
      handleSubmit,
      setError,
    },
  ]
}

export default useCreateInvestmentProposal
