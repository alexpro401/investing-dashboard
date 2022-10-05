import { useCallback, useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core"

import { BigNumber } from "@ethersproject/bignumber"
import { parseEther, parseUnits } from "@ethersproject/units"
import getTime from "date-fns/getTime"
import { addDays } from "date-fns/esm"

import useError from "hooks/useError"
import usePayload from "hooks/usePayload"
import { useTraderPool } from "hooks/usePool"
import { useBasicPoolContract } from "contracts"
import { useTraderPoolRiskyProposalContract } from "contracts"
import { useProposalAddress } from "hooks/useContract"

import { ZERO } from "constants/index"
import { IValidationError, SubmitState } from "constants/types"
import { useTransactionAdder } from "state/transactions/hooks"
import { TransactionType } from "state/transactions/types"

import { shortTimestamp, parseTransactionError, isTxMined } from "utils"

const useCreateRiskyProposal = (
  poolAddress?: string,
  tokenAddress?: string
): [
  {
    proposalCount: number
    positionPrice?: BigNumber
    lpAvailable?: BigNumber
    lpAmount: string
    timestampLimit: number
    investLPLimit: string
    maxTokenPriceLimit: string
    instantTradePercentage: number
    validationErrors: IValidationError[]
  },
  {
    setLpAmount: (value: string) => void
    setTimestampLimit: (timestamp: number) => void
    setInvestLPLimit: (value: string) => void
    setMaxTokenPriceLimit: (value: string) => void
    setInstantTradePercentage: (percent: number) => void
    handleSubmit: () => void
  }
] => {
  const addTransaction = useTransactionAdder()
  const { account } = useWeb3React()
  const initialTimeLimit = shortTimestamp(getTime(addDays(new Date(), 30)))
  const proposalAddress = useProposalAddress(poolAddress)
  const riskyProposal = useTraderPoolRiskyProposalContract(proposalAddress)

  const basicTraderPool = useBasicPoolContract(poolAddress)
  const traderPool = useTraderPool(poolAddress)
  const [, setError] = useError()
  const [isSubmiting, setSubmiting] = usePayload()

  const [totalProposals, setTotalProposals] = useState<number>(0)
  const [lpAmount, setLpAmount] = useState("")
  const [timestampLimit, setTimestampLimit] = useState(initialTimeLimit)
  const [investLPLimit, setInvestLPLimit] = useState("")
  const [maxTokenPriceLimit, setMaxTokenPriceLimit] = useState("")
  const [instantTradePercentage, setInstantTradePercentage] = useState(0)
  const [positionPrice, setPositionPrice] = useState<BigNumber | undefined>()
  const [lpAvailable, setLpAvailable] = useState<BigNumber | undefined>()

  const [validationErrors, setValidationErrors] = useState<IValidationError[]>(
    []
  )

  const updateTotalProposals = useCallback(async () => {
    if (!riskyProposal) return

    const total = await riskyProposal.proposalsTotalNum()
    setTotalProposals(total.toNumber())
  }, [riskyProposal])

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
        message: "LP allocated for RP must be greater than 0",
      })
    }

    // Max buying price
    if (maxTokenPriceLimit === "" || isNaN(parseFloat(maxTokenPriceLimit))) {
      errors.push({
        message: "Max buying price is required",
        field: "maxTokenPriceLimit",
      })
    } else if (parseEther(maxTokenPriceLimit).lte(positionPrice || ZERO)) {
      errors.push({
        field: "maxTokenPriceLimit",
        message: "Max buying price must be greater than current price",
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
  }, [investLPLimit, lpAmount, maxTokenPriceLimit, positionPrice])

  const handleSubmit = useCallback(() => {
    if (
      !basicTraderPool ||
      !traderPool ||
      !riskyProposal ||
      !account ||
      !tokenAddress
    )
      return

    if (!handleValidate()) return

    const createRiskyProposal = async () => {
      setSubmiting(SubmitState.SIGN)
      setError("")
      const amount = parseEther(lpAmount || "0").toHexString()
      const percentage = parseUnits(
        instantTradePercentage.toString(),
        25
      ).toHexString()

      const divests = await traderPool.getDivestAmountsAndCommissions(
        account,
        amount
      )

      const tokens = await riskyProposal.getCreationTokens(
        tokenAddress,
        divests.receptions.baseAmount,
        percentage,
        []
      )

      const createResponse = await basicTraderPool.createProposal(
        tokenAddress,
        amount,
        {
          timestampLimit,
          investLPLimit: parseUnits(investLPLimit, 18).toHexString(),
          maxTokenPriceLimit: parseUnits(maxTokenPriceLimit, 18).toHexString(),
        },
        percentage,
        divests.receptions.receivedAmounts,
        tokens[0],
        []
      )
      setSubmiting(SubmitState.WAIT_CONFIRM)

      const receipt = await addTransaction(createResponse, {
        type: TransactionType.RISKY_PROPOSAL_CREATE,
        pool: poolAddress,
        token: tokenAddress,
      })

      if (isTxMined(receipt)) {
        // TODO: show modal
        setSubmiting(SubmitState.SUCCESS)
      }
    }

    createRiskyProposal().catch((error) => {
      setSubmiting(SubmitState.IDLE)
      console.log(error)

      const errorMessage = parseTransactionError(error)
      !!errorMessage && setError(errorMessage)
    })
  }, [
    account,
    addTransaction,
    basicTraderPool,
    instantTradePercentage,
    investLPLimit,
    lpAmount,
    maxTokenPriceLimit,
    poolAddress,
    riskyProposal,
    timestampLimit,
    tokenAddress,
    traderPool,
    handleValidate,
    setError,
    setSubmiting,
  ])

  const getCreatingTokensInfo = useCallback(async () => {
    if (!riskyProposal || !tokenAddress) return

    const tokens = await riskyProposal.getCreationTokens(
      tokenAddress,
      parseEther("1").toHexString(),
      parseUnits("100", 27).toHexString(),
      []
    )
    setPositionPrice(tokens.positionTokenPrice)
  }, [riskyProposal, tokenAddress])

  // fetch base token price
  useEffect(() => {
    if (!riskyProposal || !tokenAddress || tokenAddress.length !== 42) return

    getCreatingTokensInfo().catch(() => {
      setError(
        "Token price is not available, please try again or select another token"
      )
    })
  }, [riskyProposal, tokenAddress, getCreatingTokensInfo, setError])

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

  // fetch LP balance
  useEffect(() => {
    if (!traderPool || !account) return

    const getBalance = async () => {
      const lpAvailable: BigNumber = await traderPool.balanceOf(account)
      setLpAvailable(lpAvailable)
    }

    getBalance().catch(console.error)
  }, [traderPool, account])

  return [
    {
      proposalCount: totalProposals,
      validationErrors,
      lpAmount,
      lpAvailable,
      positionPrice,
      timestampLimit,
      investLPLimit,
      maxTokenPriceLimit,
      instantTradePercentage,
    },
    {
      setLpAmount,
      setTimestampLimit,
      setInvestLPLimit,
      setMaxTokenPriceLimit,
      setInstantTradePercentage,
      handleSubmit,
    },
  ]
}

export default useCreateRiskyProposal
