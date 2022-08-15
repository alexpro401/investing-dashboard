import { useCallback, useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core"

import { BigNumber } from "@ethersproject/bignumber"
import { parseEther, parseUnits } from "@ethersproject/units"
import getTime from "date-fns/getTime"
import { addDays } from "date-fns/esm"

import { useTraderPool } from "hooks/usePool"
import {
  useBasicPoolContract,
  useRiskyProposalContract,
} from "hooks/useContract"

import { SubmitState } from "constants/types"
import { useTransactionAdder } from "state/transactions/hooks"
import { TransactionType } from "state/transactions/types"

import { shortTimestamp, parseTransactionError, isTxMined } from "utils"
import useRiskyProposals from "hooks/useRiskyProposals"

const useCreateRiskyProposal = (
  poolAddress?: string,
  tokenAddress?: string
): [
  {
    proposalCount: number
    error: string
    isSubmiting: SubmitState
    baseTokenPrice?: BigNumber
    lpAvailable?: BigNumber
    lpAmount: string
    timestampLimit: number
    investLPLimit: string
    maxTokenPriceLimit: string
    instantTradePercentage: number
  },
  {
    setSubmiting: (value: SubmitState) => void
    setError: (value: string) => void
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
  const [riskyProposal] = useRiskyProposalContract(poolAddress)
  const [{ data: proposals }, updateRiskyProposals] =
    useRiskyProposals(poolAddress)

  const basicTraderPool = useBasicPoolContract(poolAddress)
  const traderPool = useTraderPool(poolAddress)

  const [error, setError] = useState("")
  const [isSubmiting, setSubmiting] = useState(SubmitState.IDLE)
  const [lpAmount, setLpAmount] = useState("")
  const [timestampLimit, setTimestampLimit] = useState(initialTimeLimit)
  const [investLPLimit, setInvestLPLimit] = useState("")
  const [maxTokenPriceLimit, setMaxTokenPriceLimit] = useState("")
  const [instantTradePercentage, setInstantTradePercentage] = useState(0)
  const [baseTokenPrice, setBaseTokenPrice] = useState<BigNumber | undefined>()
  const [lpAvailable, setLpAvailable] = useState<BigNumber | undefined>()

  // fetch base token price
  useEffect(() => {
    if (!riskyProposal || !tokenAddress || tokenAddress.length !== 42) return

    const getCreatingTokensInfo = async () => {
      const tokens = await riskyProposal.getCreationTokens(
        tokenAddress,
        parseEther("1").toHexString(),
        parseUnits("100", 27).toHexString(),
        []
      )
      setBaseTokenPrice(tokens.positionTokenPrice)
    }

    getCreatingTokensInfo().catch(console.error)
  }, [riskyProposal, tokenAddress])

  // watch for transaction confirm
  useEffect(() => {
    if (isSubmiting === SubmitState.SUCESS) {
      updateRiskyProposals()
    }
  }, [isSubmiting, updateRiskyProposals])

  // watch for proposals length
  useEffect(() => {
    console.log(proposals.length)
  }, [proposals.length])

  // fetch LP balance
  useEffect(() => {
    if (!traderPool || !account) return

    const getBalance = async () => {
      const lpAvailable: BigNumber = await traderPool.balanceOf(account)
      setLpAvailable(lpAvailable)
    }

    getBalance().catch(console.error)
  }, [traderPool, account])

  const handleSubmit = useCallback(() => {
    if (!basicTraderPool || !traderPool || !riskyProposal || !account) return

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
        [
          timestampLimit,
          parseUnits(investLPLimit, 18).toHexString(),
          parseUnits(maxTokenPriceLimit, 18).toHexString(),
        ],
        percentage,
        divests.receptions.receivedAmounts,
        tokens[0],
        []
      )
      setSubmiting(SubmitState.WAIT_CONFIRM)

      const receipt = await addTransaction(createResponse, {
        type: TransactionType.RISKY_PROPOSAL_CREATE,
        poolId: poolAddress,
      })

      if (isTxMined(receipt)) {
        // TODO: show modal
        setSubmiting(SubmitState.SUCESS)
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
  ])

  return [
    {
      proposalCount: proposals.length,
      lpAmount,
      error,
      isSubmiting,
      lpAvailable,
      baseTokenPrice,
      timestampLimit,
      investLPLimit,
      maxTokenPriceLimit,
      instantTradePercentage,
    },
    {
      setError,
      setSubmiting,
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
