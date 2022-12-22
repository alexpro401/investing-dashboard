import { useState, useEffect, useCallback, useMemo } from "react"
import { isTxMined, parseTransactionError } from "utils"

import { useWeb3React } from "@web3-react/core"
import { BigNumber, FixedNumber } from "@ethersproject/bignumber"

import Icon from "components/Icon"

import { useTransactionAdder } from "state/transactions/hooks"
import { TransactionType } from "state/transactions/types"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import { SwapDirection } from "constants/types"

import {
  divideBignumbers,
  multiplyBignumbers,
  percentageOfBignumbers,
} from "utils/formulas"

import useAlert, { AlertType } from "hooks/useAlert"
import {
  useRiskyActiveInvestmentsInfo,
  useRiskyProposal,
} from "hooks/useRiskyProposals"
import { usePoolContract } from "hooks/usePool"
import {
  useBasicPoolContract,
  useTraderPoolRiskyProposalContract,
  usePriceFeedContract,
  useTraderPoolContract,
} from "contracts"

import { RiskyInvestInfo } from "interfaces/exchange"
import { RiskyForm } from "interfaces/exchange"
import usePoolPrice from "hooks/usePoolPrice"
import useRiskyPrice from "hooks/useRiskyPrice"
import useGasTracker from "state/gas/hooks"
import { parseEther, parseUnits } from "@ethersproject/units"
import { ZERO } from "constants/index"
import useRiskyPosition from "hooks/useRiskyPosition"
import { useERC20Data } from "state/erc20/hooks"
import useProposalAddress from "hooks/useProposalAddress"
import {
  IDivestAmountsAndCommissions,
  IInvestTokens,
} from "interfaces/contracts/ITraderPool"
import {
  IDivestAmounts,
  IRiskyProposalInvestTokens,
} from "interfaces/contracts/ITraderPoolRiskyProposal"

const useInvestRiskyProposal = (
  poolAddress?: string,
  proposalId?: string
): [
  {
    info: RiskyInvestInfo
    formWithDirection: RiskyForm
    isSlippageOpen: boolean
    fromBalance: BigNumber
    toBalance: BigNumber
    inPrice: BigNumber
    outPrice: BigNumber
    oneTokenCost: BigNumber
    usdTokenCost: BigNumber
    gasPrice: string
    fromAmount: string
    toAmount: string
    slippage: string
    fromAddress: string
    toAddress: string
    toSelectorOpened: boolean
    fromSelectorOpened: boolean
    direction: SwapDirection
  },
  {
    setFromAmount: (amount: string) => void
    setSlippageOpen: (state: boolean) => void
    setToAmount: (amount: string) => void
    setToAddress: (address: string) => void
    setFromAddress: (address: string) => void
    setDirection: () => void
    setToSelector: (state: boolean) => void
    setFromSelector: (state: boolean) => void
    setSlippage: (slippage: string) => void
    handlePercentageChange: (percentage: BigNumber) => void
    handleFromChange: (amount: string) => void
    handleSubmit: () => void
  }
] => {
  const { account } = useWeb3React()
  const [showAlert] = useAlert()
  const [, getGasPrice] = useGasTracker()

  const [investorPnlUSD, setInvestorPnlUSD] = useState(ZERO)
  const [investorPnlLP, setInvestorPnlLP] = useState(ZERO)
  const [investorShare, setInvestorShare] = useState(ZERO)
  const [positionPnl, setPositionPnl] = useState(ZERO)
  const [positionTokenPrice, setPositionTokenPrice] = useState(ZERO)
  const [avgBuyingPrice, setAvgBuyingPrice] = useState(ZERO)
  const [avgSellingPrice, setAvgSellingPrice] = useState(ZERO)
  const [toBalance, setToBalance] = useState(ZERO)
  const [fromBalance, setFromBalance] = useState(ZERO)
  const [inPrice, setInPrice] = useState(ZERO)
  const [outPrice, setOutPrice] = useState(ZERO)
  const [fromAmount, setFromAmount] = useState("0")
  const [toAmount, setToAmount] = useState("0")
  const [slippage, setSlippage] = useState("0.10")
  const [isSlippageOpen, setSlippageOpen] = useState(false)
  const [toSelectorOpened, setToSelector] = useState(false)
  const [fromSelectorOpened, setFromSelector] = useState(false)
  const [direction, setDirection] = useState<SwapDirection>("deposit")
  const [oneTokenCost, setOneTokenCost] = useState(ZERO)
  const [usdTokenCost, setUSDTokenCost] = useState(ZERO)
  const [gasPrice, setGasPrice] = useState("0.00")

  const [baseAmountReceived, setBaseAmountReceived] = useState(ZERO)
  const [positionAmountReceived, setPositionAmountReceived] = useState(ZERO)

  const [toAddress, setToAddress] = useState("")
  const [fromAddress, setFromAddress] = useState("")

  const handleDirectionChange = useCallback(() => {
    setDirection(direction === "deposit" ? "withdraw" : "deposit")
  }, [direction])

  const traderPool = useTraderPoolContract(poolAddress)
  const basicPool = useBasicPoolContract(poolAddress)
  const proposalAddress = useProposalAddress(poolAddress)
  const proposalPool = useTraderPoolRiskyProposalContract(poolAddress)
  const [proposal] = useRiskyProposal(poolAddress, proposalId)
  const [, poolInfo] = usePoolContract(poolAddress)
  const priceFeed = usePriceFeedContract()
  const [{ poolMetadata }] = usePoolMetadata(
    poolAddress,
    poolInfo?.parameters.descriptionURL
  )

  const position = useRiskyPosition({
    proposalAddress,
    proposalId,
    closed: false,
  })

  const investmentsInfo = useRiskyActiveInvestmentsInfo(
    poolAddress,
    account,
    proposalId
  )

  const [fromData] = useERC20Data(poolInfo?.parameters.baseToken)
  const [toData] = useERC20Data(proposal?.proposalInfo.token)

  const [{ priceUSD: poolPriceUSD, priceBase: poolPriceBase }] =
    usePoolPrice(poolAddress)
  const { priceUSD: riskyPriceUSD, priceBase: riskyPriceBase } = useRiskyPrice(
    poolAddress,
    proposalId
  )

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
    return {
      stakeLimit: proposal?.proposalInfo.proposalLimits.investLPLimit,
      tokens: {
        base: fromData,
        position: toData,
      },
      amounts: [baseAmountReceived, positionAmountReceived],
      avgBuyingPrice,
      avgSellingPrice,
      positionPnl,
      investorPnlLP,
      investorPnlUSD,
    }
  }, [
    investorPnlUSD,
    avgBuyingPrice,
    avgSellingPrice,
    baseAmountReceived,
    fromData,
    investorPnlLP,
    positionAmountReceived,
    positionPnl,
    proposal,
    toData,
  ])

  const exchangeForm = useMemo(() => {
    return {
      deposit: {
        from: {
          address: undefined,
          amount: fromAmount,
          balance: fromBalance,
          price: inPrice,
          symbol: poolInfo?.ticker,
          decimals: 18,
          icon: poolIcon,
        },
        to: {
          address: proposal?.proposalInfo.token,
          amount: toAmount,
          balance: toBalance,
          price: outPrice,
          symbol: `${toData?.symbol}-LP`,
          decimals: toData?.decimals,
          icon: undefined,
        },
      },
      withdraw: {
        from: {
          address: proposal?.proposalInfo.token,
          amount: fromAmount,
          balance: fromBalance,
          price: inPrice,
          symbol: `${toData?.symbol}-LP`,
          decimals: toData?.decimals,
          icon: undefined,
        },
        to: {
          address: undefined,
          amount: toAmount,
          balance: toBalance,
          price: outPrice,
          symbol: poolInfo?.ticker,
          decimals: 18,
          icon: poolIcon,
        },
      },
    }
  }, [
    fromAmount,
    toAmount,
    fromBalance,
    toBalance,
    inPrice,
    outPrice,
    poolIcon,
    toData,
    poolInfo,
    proposal,
  ])

  const formWithDirection = exchangeForm[direction]

  useEffect(() => {
    if (!proposal) return

    try {
      const lpLocked = FixedNumber.fromValue(proposal.proposalInfo.lpLocked, 18)
      const share = FixedNumber.fromValue(investorShare, 18)
      const pnlPercent = FixedNumber.fromValue(positionPnl, 18)
      const oneHundredPercents = FixedNumber.from("100")
      const priceUSD = FixedNumber.fromValue(poolPriceUSD, 18)

      const shareLP = lpLocked.mulUnsafe(share)

      const pnlLP = shareLP.divUnsafe(oneHundredPercents).mulUnsafe(pnlPercent)
      const pnlUSD = pnlLP.mulUnsafe(priceUSD)

      setInvestorPnlLP(parseEther(pnlLP._value))
      setInvestorPnlUSD(parseEther(pnlUSD._value))
    } catch (e) {
      console.log(e)
    }
  }, [proposal, investorShare, positionPnl, poolPriceUSD])

  /**
   * calculate investor share percentage
   */
  useEffect(() => {
    if (!proposal || !investmentsInfo) return

    const share = divideBignumbers(
      [investmentsInfo.lp2Balance, 18],
      [proposal.lp2Supply, 18]
    )

    setInvestorShare(share)
  }, [investmentsInfo, proposal])

  /**
   * calculate average buying price
   */
  useEffect(() => {
    if (!position) return

    const openBaseVolume = BigNumber.from(position.totalBaseOpenVolume)
    const openPositionVolume = BigNumber.from(position.totalPositionOpenVolume)

    const price = divideBignumbers(
      [openBaseVolume, 18],
      [openPositionVolume, 18]
    )

    setAvgBuyingPrice(price)
  }, [position])

  /**
   * calculate average selling price
   */
  useEffect(() => {
    if (!position) return

    const closeBaseVolume = BigNumber.from(position.totalBaseCloseVolume)
    const closePositionVolume = BigNumber.from(
      position.totalPositionCloseVolume
    )

    if (closeBaseVolume.isZero() || closePositionVolume.isZero()) return

    const price = divideBignumbers(
      [closeBaseVolume, 18],
      [closePositionVolume, 18]
    )

    setAvgSellingPrice(price)
  }, [position])

  /**
   * get position token market price
   */
  useEffect(() => {
    if (!priceFeed || !proposal || !poolInfo) return
    ;(async () => {
      try {
        const amount = parseUnits("1", 18)

        // without extended
        const price = await priceFeed.getNormalizedExtendedPriceOut(
          proposal.proposalInfo.token,
          poolInfo.parameters.baseToken,
          amount,
          []
        )
        if (price && price.amountOut) {
          setPositionTokenPrice(price.amountOut)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [priceFeed, proposal, poolInfo])

  /**
   * calculate position pnl percentage
   */
  useEffect(() => {
    if (avgBuyingPrice.isZero() || positionTokenPrice.isZero()) return

    const percent = percentageOfBignumbers(positionTokenPrice, avgBuyingPrice)

    setPositionPnl(percent.sub(parseEther("100")))
  }, [avgBuyingPrice, positionTokenPrice])

  const getLPBalance = useCallback(async () => {
    if (!traderPool || !account) return

    const lpAvailable: BigNumber = await traderPool?.balanceOf(account)

    if (direction === "deposit") {
      setFromBalance(lpAvailable)
    } else {
      setToBalance(lpAvailable)
    }
  }, [account, direction, traderPool])

  const getLP2Balance = useCallback(async () => {
    const balance = !investmentsInfo ? ZERO : investmentsInfo.lp2Balance

    if (direction === "deposit") {
      setToBalance(balance)
    } else {
      setFromBalance(balance)
    }
  }, [direction, investmentsInfo])

  const getInvestTokens = useCallback(
    async (
      amount: BigNumber
    ): Promise<[IDivestAmountsAndCommissions, IRiskyProposalInvestTokens]> => {
      if (!account || !proposalPool || !traderPool)
        return new Promise((resolve, reject) => reject(null))

      const divests = await traderPool.getDivestAmountsAndCommissions(
        account,
        amount
      )

      const invests = await proposalPool.getInvestTokens(
        Number(proposalId) + 1,
        divests.receptions.baseAmount
      )
      return [divests, invests]
    },
    [account, proposalId, proposalPool, traderPool]
  )

  const getDivestTokens = useCallback(
    async (amount: BigNumber): Promise<[IDivestAmounts, IInvestTokens]> => {
      if (!proposalPool || !traderPool)
        return new Promise((resolve, reject) => reject(null))
      const divests = await proposalPool.getDivestAmounts(
        [Number(proposalId) + 1],
        [amount]
      )

      const invests = await traderPool.getInvestTokens(divests.baseAmount)

      return [divests, invests]
    },
    [proposalId, proposalPool, traderPool]
  )

  const estimateDepositGasPrice = useCallback(async () => {
    const amount = BigNumber.from(fromAmount)

    if (!basicPool || amount.isZero()) return

    const [divests, invests] = await getInvestTokens(amount)

    return await basicPool.estimateGas.investProposal(
      Number(proposalId) + 1,
      amount,
      divests.receptions.receivedAmounts,
      invests.positionAmount
    )
  }, [basicPool, fromAmount, getInvestTokens, proposalId])

  const estimateWithdrawGasPrice = useCallback(async () => {
    const amount = BigNumber.from(fromAmount)

    if (!basicPool || amount.isZero()) return

    const [divests, invests] = await getDivestTokens(amount)

    if (!divests || !invests) return

    return await basicPool.estimateGas.reinvestProposal(
      Number(proposalId) + 1,
      amount,
      invests.receivedAmounts,
      divests.receivedAmounts[0]
    )
  }, [basicPool, fromAmount, getDivestTokens, proposalId])

  const estimateGas = useCallback(async () => {
    if (direction === "deposit") {
      return await estimateDepositGasPrice()
    } else {
      return await estimateWithdrawGasPrice()
    }
  }, [direction, estimateDepositGasPrice, estimateWithdrawGasPrice])

  const handleDeposit = useCallback(async () => {
    const amount = BigNumber.from(fromAmount)
    const [divests, invests] = await getInvestTokens(amount)

    const investReceipt = await basicPool?.investProposal(
      Number(proposalId) + 1,
      amount,
      divests.receptions.receivedAmounts,
      invests.positionAmount
    )

    return await addTransaction(investReceipt, {
      type: TransactionType.RISKY_PROPOSAL_INVEST,
      inputCurrencyAmountRaw: invests.lp2Amount.toString(),
      inputCurrencySymbol: exchangeForm.deposit.to.symbol,
      expectedOutputCurrencyAmountRaw: amount.toString(),
      expectedOutputCurrencySymbol: exchangeForm.deposit.from.symbol,
    })
  }, [
    addTransaction,
    basicPool,
    exchangeForm.deposit.from.symbol,
    exchangeForm.deposit.to.symbol,
    fromAmount,
    getInvestTokens,
    proposalId,
  ])

  const handleWithdraw = useCallback(async () => {
    const amount = BigNumber.from(fromAmount)

    const [divests, invests] = await getDivestTokens(amount)

    if (!divests || !invests) return

    const withdrawResponse = await basicPool?.reinvestProposal(
      Number(proposalId) + 1,
      amount,
      invests.receivedAmounts,
      divests.receivedAmounts[0]
    )

    return await addTransaction(withdrawResponse, {
      type: TransactionType.RISKY_PROPOSAL_DIVEST,
      outputCurrencyAmountRaw: amount.toString(),
      outputCurrencySymbol: exchangeForm.withdraw.from.symbol,
      expectedInputCurrencyAmountRaw: invests.lpAmount.toString(),
      expectedInputCurrencySymbol: exchangeForm.withdraw.to.symbol,
    })
  }, [
    addTransaction,
    basicPool,
    exchangeForm.withdraw.from.symbol,
    exchangeForm.withdraw.to.symbol,
    fromAmount,
    getDivestTokens,
    proposalId,
  ])

  const handleSubmit = useCallback(async () => {
    try {
      const sendTransaction =
        direction === "deposit" ? handleDeposit : handleWithdraw

      const receipt = await sendTransaction()

      if (isTxMined(receipt)) {
        // TODO: run update
      }
    } catch (error: any) {
      const errorMessage = parseTransactionError(error)
      showAlert({
        content: errorMessage,
        type: AlertType.warning,
        hideDuration: 10000,
      })
    }
  }, [direction, handleDeposit, handleWithdraw, showAlert])

  const getLpPrice = useCallback(
    (amount: BigNumber) => {
      return multiplyBignumbers([amount, 18], [poolPriceUSD, 18])
    },
    [poolPriceUSD]
  )

  const getLp2Price = useCallback(
    (amount: BigNumber) => {
      return multiplyBignumbers([amount, 18], [riskyPriceUSD, 18])
    },
    [riskyPriceUSD]
  )

  const handleFromChange = useCallback(
    async (v: string) => {
      setFromAmount(v)
      const amount = BigNumber.from(v)

      try {
        if (direction === "deposit") {
          const [, invests] = await getInvestTokens(amount)
          const lpPrice = getLpPrice(amount)
          const lp2Price = getLp2Price(invests.lp2Amount)

          setPositionAmountReceived(invests.positionAmount)
          setBaseAmountReceived(invests.baseAmount)
          setToAmount(invests.lp2Amount.toString())
          setInPrice(lpPrice)
          setOutPrice(lp2Price)
        }
        if (direction === "withdraw") {
          const [, invests] = await getDivestTokens(amount)
          const lpPrice = getLpPrice(invests.lpAmount)
          const lp2Price = getLp2Price(amount)

          setToAmount(invests.lpAmount.toString())
          setInPrice(lp2Price)
          setOutPrice(lpPrice)
        }
      } catch (e) {
        console.log(e)
      }
    },
    [direction, getDivestTokens, getInvestTokens, getLp2Price, getLpPrice]
  )

  const handlePercentageChange = useCallback(
    (percent: BigNumber) => {
      const from = multiplyBignumbers([fromBalance, 18], [percent, 18])
      handleFromChange(from.toString())
    },
    [fromBalance, handleFromChange]
  )

  const handleFromOnDirectionChange = useCallback(() => {
    handleFromChange(fromAmount)
  }, [handleFromChange, fromAmount])

  // estimate gas price
  useEffect(() => {
    ;(async () => {
      try {
        const gasPrice = await estimateGas()
        if (!gasPrice) return

        const gas = getGasPrice(gasPrice.toNumber())
        setGasPrice(gas)
      } catch (e) {}
    })()
  }, [estimateGas, getGasPrice])

  // update "from" input on direction change
  useEffect(() => {
    handleFromOnDirectionChange()
  }, [direction, handleFromOnDirectionChange])

  useEffect(() => {
    if (direction === "deposit") {
      setUSDTokenCost(riskyPriceUSD)
      setOneTokenCost(
        divideBignumbers([riskyPriceBase, 18], [poolPriceBase, 18])
      )
    }
    if (direction === "withdraw") {
      setUSDTokenCost(poolPriceUSD)
      setOneTokenCost(
        divideBignumbers([poolPriceBase, 18], [riskyPriceBase, 18])
      )
    }
  }, [direction, poolPriceBase, poolPriceUSD, riskyPriceBase, riskyPriceUSD])

  const runUpdate = useCallback(async () => {
    getLPBalance().catch(console.error)
    getLP2Balance().catch(console.error)
  }, [getLP2Balance, getLPBalance])

  // get LP balance
  // get LP2 balance
  // update amounts
  useEffect(() => {
    runUpdate()
  }, [runUpdate])

  // balance updater for both LP and LP2
  useEffect(() => {
    const interval = setInterval(() => {
      runUpdate()
    }, Number(process.env.REACT_APP_UPDATE_INTERVAL))

    return () => clearInterval(interval)
  }, [runUpdate])

  return [
    {
      info,
      formWithDirection,
      isSlippageOpen,
      fromBalance,
      toBalance,
      oneTokenCost,
      usdTokenCost,
      gasPrice,
      inPrice,
      outPrice,
      fromAmount,
      toAmount,
      fromAddress,
      toAddress,
      toSelectorOpened,
      fromSelectorOpened,
      direction,
      slippage,
    },
    {
      setSlippageOpen,
      setFromAmount,
      setToAmount,
      setToAddress,
      setFromAddress,
      setDirection: handleDirectionChange,
      setToSelector,
      setFromSelector,
      setSlippage,
      handlePercentageChange,
      handleFromChange,
      handleSubmit,
    },
  ]
}

export default useInvestRiskyProposal
