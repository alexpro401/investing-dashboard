import { useCallback, useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core"

import { BigNumber } from "@ethersproject/bignumber"
import { parseEther, parseUnits } from "@ethersproject/units"

import useError from "hooks/useError"
import usePayload from "hooks/usePayload"
import { useTraderPoolContract } from "contracts"
import { useBasicPoolContract } from "contracts"
import { useTraderPoolRiskyProposalContract } from "contracts"

import { SubmitState } from "consts/types"
import { useTransactionAdder } from "state/transactions/hooks"
import { TransactionType } from "state/transactions/types"

import { parseTransactionError, isTxMined } from "utils"
import { useCreateRiskyProposalContext } from "context/fund/CreateRiskyProposalContext"
import { useEffectOnce, useUnmount } from "react-use"
import { IpfsEntity } from "utils/ipfsEntity"

const useCreateRiskyProposal = (
  poolAddress?: string,
  tokenAddress?: string
): [
  {
    proposalCount: number
    positionPrice?: BigNumber
    lpAvailable?: BigNumber
  },
  {
    setPayload: (state: SubmitState) => void
    payload: SubmitState
    handleSubmit: () => void
  }
] => {
  const addTransaction = useTransactionAdder()
  const { account } = useWeb3React()
  const riskyProposal = useTraderPoolRiskyProposalContract(poolAddress)
  const {
    symbol,
    description,
    lpAmount,
    timestampLimit,
    investLPLimit,
    maxTokenPriceLimit,
    instantTradePercentage,
  } = useCreateRiskyProposalContext()

  const basicTraderPool = useBasicPoolContract(poolAddress)
  const traderPool = useTraderPoolContract(poolAddress)
  const [, setError] = useError()
  const [payload, setPayload] = usePayload()

  useEffectOnce(() => setPayload(SubmitState.IDLE))
  useUnmount(() => setPayload(SubmitState.IDLE))

  const [totalProposals, setTotalProposals] = useState<number>(0)
  const [positionPrice, setPositionPrice] = useState<BigNumber | undefined>()
  const [lpAvailable, setLpAvailable] = useState<BigNumber | undefined>()

  const updateTotalProposals = useCallback(async () => {
    if (!riskyProposal) return

    const total = await riskyProposal.proposalsTotalNum()
    setTotalProposals(total.toNumber())
  }, [riskyProposal])

  const handleSubmit = useCallback(async () => {
    if (
      !basicTraderPool ||
      !traderPool ||
      !riskyProposal ||
      !account ||
      !tokenAddress
    )
      return

    try {
      setPayload(SubmitState.SIGN)
      setError("")
      const amount = parseEther(lpAmount.get || "0").toHexString()
      const percentage = parseUnits(
        instantTradePercentage.get.toString(),
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

      const riskyProposalIpfsEntity = new IpfsEntity({
        data: JSON.stringify({
          ticker: symbol.get,
          account,
          description: description.get,
          timestamp: new Date().getTime() / 1000,
        }),
      })

      await riskyProposalIpfsEntity.uploadSelf()

      const createResponse = await basicTraderPool.createProposal(
        riskyProposalIpfsEntity._path as string,
        tokenAddress,
        amount,
        {
          timestampLimit: timestampLimit.get,
          investLPLimit: parseEther(investLPLimit.get).toHexString(),
          maxTokenPriceLimit: parseEther(maxTokenPriceLimit.get).toHexString(),
        },
        percentage,
        divests.receptions.receivedAmounts,
        tokens[0],
        []
      )
      setPayload(SubmitState.WAIT_CONFIRM)

      const receipt = await addTransaction(createResponse, {
        type: TransactionType.RISKY_PROPOSAL_CREATE,
        pool: poolAddress,
        token: tokenAddress,
      })

      if (isTxMined(receipt)) {
        setPayload(SubmitState.SUCCESS)
      }
    } catch (error: any) {
      setPayload(SubmitState.IDLE)
      console.log(error)

      const errorMessage = parseTransactionError(error)
      !!errorMessage && setError(errorMessage)
    }
  }, [
    account,
    symbol,
    description,
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
    setError,
    setPayload,
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
    if (payload === SubmitState.SUCCESS) {
      updateTotalProposals()
    }
  }, [payload, updateTotalProposals])

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
      lpAvailable,
      positionPrice,
    },
    {
      setPayload,
      payload,
      handleSubmit,
    },
  ]
}

export default useCreateRiskyProposal
