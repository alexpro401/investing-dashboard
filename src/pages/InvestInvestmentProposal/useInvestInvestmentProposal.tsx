import { useState, useEffect, useCallback, useMemo } from "react"
import { format } from "date-fns"
import { useWeb3React } from "@web3-react/core"
import { BigNumber } from "@ethersproject/bignumber"

import Icon from "components/Icon"

import { useTransactionAdder } from "state/transactions/hooks"
import { TransactionType } from "state/transactions/types"
import {
  useInvestProposalMetadata,
  usePoolMetadata,
} from "state/ipfsMetadata/hooks"

import {
  useInvestTraderPoolContract,
  useTraderPoolInvestProposalContract,
  useTraderPoolContract,
} from "contracts"
import { usePoolContract } from "hooks/usePool"
import usePoolPrice from "hooks/usePoolPrice"
import { useInvestProposal } from "hooks/useInvestmentProposals"

import { RiskyForm } from "interfaces/exchange"
import { ZERO } from "consts"
import { SubmitState } from "consts/types"
import { DATE_TIME_FORMAT } from "consts/time"
import { IDivestAmountsAndCommissions } from "interfaces/contracts/ITraderPool"

import {
  expandTimestamp,
  isTxMined,
  normalizeBigNumber,
  parseTransactionError,
} from "utils"
import { divideBignumbers, multiplyBignumbers } from "utils/formulas"
import useError from "hooks/useError"
import usePayload from "hooks/usePayload"
import { useERC20Data } from "state/erc20/hooks"

interface Info {
  tvl: {
    base: string
    usd: string
    ticker: string
  }
  fullness: string
  avgPriceLP: string
  expirationDate: string
}

const useInvestInvestmentProposal = (
  poolAddress?: string,
  proposalId?: string
): [
  {
    info: Info
    formData: RiskyForm
    inPrice: BigNumber
    outPrice: BigNumber
    fromAmount: BigNumber
    toAmount: BigNumber
    slippage: string
    fromAddress: string
    toAddress: string
    toSelectorOpened: boolean
    fromSelectorOpened: boolean
  },
  {
    setToAddress: (address: string) => void
    setFromAddress: (address: string) => void
    setToSelector: (state: boolean) => void
    setFromSelector: (state: boolean) => void
    setSlippage: (slippage: string) => void
    handlePercentageChange: (percentage: BigNumber) => void
    handleFromChange: (amount: string) => void
    handleSubmit: () => void
  }
] => {
  const { account } = useWeb3React()

  const [lpBalance, setLPBalance] = useState(ZERO)
  const [lp2Balance, setLP2Balance] = useState(ZERO)
  const [inPrice, setInPrice] = useState(ZERO)
  const [outPrice, setOutPrice] = useState(ZERO)
  const [fromAmount, setFromAmount] = useState(ZERO)
  const [toAmount, setToAmount] = useState(ZERO)
  const [slippage, setSlippage] = useState("0.10")
  const [toSelectorOpened, setToSelector] = useState(false)
  const [fromSelectorOpened, setFromSelector] = useState(false)
  const [, setWalletPrompting] = usePayload()
  const [, setError] = useError()

  const [toAddress, setToAddress] = useState("")
  const [fromAddress, setFromAddress] = useState("")

  const traderPool = useTraderPoolContract(poolAddress)
  const investPool = useInvestTraderPoolContract(poolAddress)
  const proposalPool = useTraderPoolInvestProposalContract(poolAddress)
  const [proposal, updateProposal] = useInvestProposal(poolAddress, proposalId)

  const [, poolInfo] = usePoolContract(poolAddress)
  const [baseData] = useERC20Data(poolInfo?.parameters.baseToken)
  const [{ poolMetadata }] = usePoolMetadata(
    poolAddress,
    poolInfo?.parameters.descriptionURL
  )

  const [{ investProposalMetadata }] = useInvestProposalMetadata(
    poolAddress,
    proposal?.proposalInfo.descriptionURL
  )

  const [poolPrice, updatePoolPrice] = usePoolPrice(poolAddress)
  const { priceUSD: poolPriceUSD, priceBase: poolPriceBase } = poolPrice

  const addTransaction = useTransactionAdder()

  const poolIcon = useMemo(
    () => (
      <Icon
        size={27}
        source={poolMetadata?.assets[poolMetadata?.assets.length - 1]}
        address={poolAddress}
      />
    ),
    [poolMetadata, poolAddress]
  )

  const info = useMemo(() => {
    const expandedTimestampLimit = expandTimestamp(
      Number(proposal?.proposalInfo.proposalLimits.timestampLimit.toString())
    )
    return {
      tvl: {
        base: proposal
          ? normalizeBigNumber(
              multiplyBignumbers(
                [proposal.proposalInfo.lpLocked, 18],
                [poolPriceBase, 18]
              )
            )
          : "-",
        usd: proposal
          ? normalizeBigNumber(
              multiplyBignumbers(
                [proposal?.proposalInfo.lpLocked || ZERO, 18],
                [poolPriceUSD, 18]
              ),
              18,
              2
            )
          : "-",
        ticker: baseData?.symbol || "",
      },
      fullness: proposal
        ? normalizeBigNumber(
            divideBignumbers(
              [proposal.proposalInfo.lpLocked, 18],
              [proposal.proposalInfo.proposalLimits.investLPLimit, 18]
            ).mul(BigNumber.from("100"))
          )
        : "-",
      avgPriceLP: normalizeBigNumber(poolPriceUSD, 18, 2),
      expirationDate: proposal
        ? format(expandedTimestampLimit, DATE_TIME_FORMAT)
        : "-",
    }
  }, [poolPriceBase, poolPriceUSD, proposal, baseData])

  const formData = useMemo(() => {
    return {
      from: {
        address: undefined,
        amount: fromAmount.toString(),
        balance: lpBalance,
        price: inPrice,
        symbol: poolInfo?.ticker,
        decimals: 18,
        icon: poolIcon,
      },
      to: {
        address: undefined,
        amount: toAmount.toString(),
        balance: lp2Balance,
        price: outPrice,
        symbol: investProposalMetadata?.ticker,
        decimals: 18,
        icon: poolIcon,
        info: {},
      },
    }
  }, [
    fromAmount,
    toAmount,
    lpBalance,
    lp2Balance,
    inPrice,
    outPrice,
    poolIcon,
    poolInfo,
    investProposalMetadata,
  ])

  const getLPBalance = useCallback(async () => {
    if (!traderPool || !account) return

    try {
      const lpAvailable = await traderPool.balanceOf(account)

      setLPBalance(lpAvailable)
    } catch (e) {
      console.error(e)
    }
  }, [account, traderPool])

  const getLP2Balance = useCallback(async () => {
    if (!proposalPool || !account) return

    try {
      const balance = await proposalPool.balanceOf(
        account,
        Number(proposalId) + 1
      )

      setLP2Balance(balance)
    } catch (e) {
      console.error(e)
    }
  }, [account, proposalId, proposalPool])

  const runUpdate = useCallback(() => {
    updatePoolPrice()
    updateProposal()
    getLPBalance().catch(console.error)
    getLP2Balance().catch(console.error)
  }, [getLP2Balance, getLPBalance, updateProposal, updatePoolPrice])

  const getDivestTokens = useCallback(
    async (amount: BigNumber): Promise<IDivestAmountsAndCommissions> => {
      if (!account || !traderPool)
        return new Promise((resolve, reject) => reject(null))

      try {
        const divests = await traderPool.getDivestAmountsAndCommissions(
          account,
          amount
        )
        return divests
      } catch (e) {
        return new Promise((resolve, reject) => reject(null))
        console.error(e)
      }
    },
    [account, traderPool]
  )

  const handleSubmit = useCallback(async () => {
    if (!traderPool || !account || !proposalId || !investPool) return

    setWalletPrompting(SubmitState.SIGN)

    try {
      const divests = await getDivestTokens(fromAmount)

      const investResponse = await investPool.investProposal(
        Number(proposalId) + 1,
        fromAmount,
        divests.receptions.receivedAmounts
      )

      setWalletPrompting(SubmitState.WAIT_CONFIRM)

      const receipt = await addTransaction(investResponse, {
        type: TransactionType.INVEST_PROPOSAL_INVEST,
        investLpAmountRaw: fromAmount.toString(),
      })

      if (isTxMined(receipt)) {
        runUpdate()
        setWalletPrompting(SubmitState.SUCCESS)
      }
    } catch (error: any) {
      setWalletPrompting(SubmitState.IDLE)
      if (!!error && !!error.data && !!error.data.message) {
        setError(error.data.message)
      } else {
        const errorMessage = parseTransactionError(error.toString())
        !!errorMessage && setError(errorMessage)
      }
    } finally {
      setWalletPrompting(SubmitState.IDLE)
    }
  }, [
    traderPool,
    account,
    proposalId,
    investPool,
    getDivestTokens,
    fromAmount,
    addTransaction,
    runUpdate,
    setError,
    setWalletPrompting,
  ])

  const getPriceUSD = useCallback(
    (amount: BigNumber) => {
      return multiplyBignumbers([amount, 18], [poolPriceUSD, 18])
    },
    [poolPriceUSD]
  )

  const handleFromChange = useCallback(
    async (v: string) => {
      const amount = BigNumber.from(v)
      const priceUSD = getPriceUSD(amount)
      setFromAmount(amount)
      setToAmount(multiplyBignumbers([amount, 18], [poolPriceBase, 18]))
      setInPrice(priceUSD)
      setOutPrice(priceUSD)
      try {
      } catch (e) {
        console.log(e)
      }
    },
    [getPriceUSD, poolPriceBase]
  )

  const handlePercentageChange = useCallback(
    (percent: BigNumber) => {
      const from = multiplyBignumbers([lpBalance, 18], [percent, 18])
      handleFromChange(from.toString())
    },
    [lpBalance, handleFromChange]
  )

  // balance updater interval for both LP and LP2
  useEffect(() => {
    runUpdate()

    const interval = setInterval(() => {
      runUpdate()
    }, Number(process.env.REACT_APP_UPDATE_INTERVAL))

    return () => clearInterval(interval)
  }, [runUpdate])

  return [
    {
      info,
      formData,
      inPrice,
      outPrice,
      fromAmount,
      toAmount,
      fromAddress,
      toAddress,
      toSelectorOpened,
      fromSelectorOpened,
      slippage,
    },
    {
      setToAddress,
      setFromAddress,
      setToSelector,
      setFromSelector,
      setSlippage,
      handlePercentageChange,
      handleFromChange,
      handleSubmit,
    },
  ]
}

export default useInvestInvestmentProposal
