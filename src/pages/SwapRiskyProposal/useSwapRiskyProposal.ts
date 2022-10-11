import {
  useCallback,
  useMemo,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react"
import { ExchangeType } from "interfaces/exchange"
import { ExchangeForm } from "interfaces/exchange"
import { SubmitState, SwapDirection, TradeType } from "constants/types"
import { DATE_TIME_FORMAT } from "constants/time"
import { BigNumber, FixedNumber } from "@ethersproject/bignumber"
import { parseEther, parseUnits } from "@ethersproject/units"
import {
  useActiveInvestmentsInfo,
  useRiskyProposal,
} from "hooks/useRiskyProposals"
import { usePoolContract } from "hooks/usePool"
import { usePriceFeedContract } from "contracts"
import {
  divideBignumbers,
  multiplyBignumbers,
  percentageOfBignumbers,
} from "utils/formulas"
import useGasTracker from "state/gas/hooks"
import { useWeb3React } from "@web3-react/core"
import {
  calcSlippage,
  isTxMined,
  normalizeBigNumber,
  parseTransactionError,
} from "utils"
import { useTransactionAdder } from "state/transactions/hooks"
import { TransactionType } from "state/transactions/types"
import { format } from "date-fns"
import usePoolPrice from "hooks/usePoolPrice"
import { ZERO } from "constants/index"
import useRiskyPosition from "hooks/useRiskyPosition"
import useError from "hooks/useError"
import usePayload from "hooks/usePayload"
import { useERC20Data } from "state/erc20/hooks"
import { IRiskyProposalExchangeAmount } from "interfaces/contracts/ITraderPoolRiskyProposal"

export interface UseSwapRiskyParams {
  poolAddress?: string
  proposalId?: string
  direction?: SwapDirection
}

interface UseSwapRiskyResponse {
  info: any
  gasPrice: string
  lpBalance: BigNumber
  oneTokenCost: BigNumber
  oneUSDCost: BigNumber
  slippage: string
  isSlippageOpen: boolean
  setSlippage: Dispatch<SetStateAction<string>>
  setSlippageOpen: Dispatch<SetStateAction<boolean>>
  handleFromChange: (v: string) => void
  handleToChange: (v: string) => void
  handleSubmit: () => void
  handlePercentageChange: (p: BigNumber) => void
}

const useSwapRiskyProposal = ({
  poolAddress,
  proposalId,
  direction,
}: UseSwapRiskyParams): [ExchangeForm, UseSwapRiskyResponse] => {
  const { account } = useWeb3React()

  const [gasPrice, setGasPrice] = useState("0.00")
  const [, setError] = useError()
  const [slippage, setSlippage] = useState("0.10")
  const [isSlippageOpen, setSlippageOpen] = useState(false)
  const [, setWalletPrompting] = usePayload()

  const [positionPnlLP, setPositionPnlLP] = useState(ZERO)
  const [positionPnlUSD, setPositionPnlUSD] = useState(ZERO)
  const [traderPnlLP, setTraderPnlLP] = useState(ZERO)
  const [traderPnlUSD, setTraderPnlUSD] = useState(ZERO)
  const [traderShare, setTraderShare] = useState(ZERO)
  const [positionPnl, setPositionPnl] = useState(ZERO)
  const [positionTokenPrice, setPositionTokenPrice] = useState(ZERO)
  const [avgBuyingPrice, setAvgBuyingPrice] = useState(ZERO)
  const [positionAmountLP, setPositionAmountLP] = useState(ZERO)
  const [lpBalance, setLpBalance] = useState(ZERO)
  const [fromAmount, setFromAmount] = useState("0")
  const [toAmount, setToAmount] = useState("0")
  const [toBalance, setToBalance] = useState(ZERO)
  const [fromBalance, setFromBalance] = useState(ZERO)
  const [fromPrice, setFromPrice] = useState(ZERO)
  const [toPrice, setToPrice] = useState(ZERO)
  const [oneTokenCost, setTokenCost] = useState(ZERO)
  const [oneUSDCost, setUSDCost] = useState(ZERO)
  const [lastChangedField, setLastChangedField] = useState<"from" | "to">(
    "from"
  )

  const [proposalInfo, proposalPool, proposalAddress, updateProposalData] =
    useRiskyProposal(poolAddress, proposalId)

  const [{ priceUSD: poolPriceUSD, priceBase: poolPriceBase }] =
    usePoolPrice(poolAddress)

  const addTransaction = useTransactionAdder()
  const [, poolInfo] = usePoolContract(poolAddress)
  const priceFeed = usePriceFeedContract()

  const [baseToken] = useERC20Data(poolInfo?.parameters.baseToken)
  const [positionToken] = useERC20Data(proposalInfo?.proposalInfo.token)

  const [, getGasPrice] = useGasTracker()

  const position = useRiskyPosition({
    proposalAddress,
    proposalId,
    closed: false,
  })

  const investmentsInfo = useActiveInvestmentsInfo(
    poolAddress,
    account,
    proposalId
  )

  const info = useMemo(() => {
    const TIMESTAMP_LIMIT =
      (proposalInfo?.proposalInfo.proposalLimits.timestampLimit.toNumber() ||
        0) * 1000

    return {
      positionPnl,
      positionPnlLP,
      positionPnlUSD,
      traderPnlLP,
      traderPnlUSD,
      pool: {
        symbol: poolInfo?.ticker,
      },
      positionToken: {
        symbol: positionToken?.symbol,
      },
      baseToken: {
        symbol: baseToken?.symbol,
      },
      lpInPosition: normalizeBigNumber(positionAmountLP || ZERO),
      lpComplete: normalizeBigNumber(proposalInfo?.lp2Supply || ZERO),
      maxLPLimit: normalizeBigNumber(
        proposalInfo?.proposalInfo.proposalLimits.investLPLimit || ZERO
      ),
      avgBuyingPrice,
      expirationDate: {
        amount: format(TIMESTAMP_LIMIT, DATE_TIME_FORMAT),
        label: format(TIMESTAMP_LIMIT, "O"),
      },
      maxPrice: normalizeBigNumber(
        proposalInfo?.proposalInfo.proposalLimits.maxTokenPriceLimit || ZERO
      ),
    }
  }, [
    positionPnl,
    positionPnlLP,
    positionPnlUSD,
    traderPnlLP,
    traderPnlUSD,
    baseToken,
    positionToken,
    proposalInfo,
    poolInfo,
    positionAmountLP,
    avgBuyingPrice,
  ])

  const form = useMemo(() => {
    if (direction === "withdraw") {
      return {
        from: {
          address: positionToken?.address,
          amount: fromAmount,
          balance: fromBalance,
          symbol: positionToken?.symbol,
          decimals: positionToken?.decimals,
          price: fromPrice,
        },
        to: {
          address: baseToken?.address,
          amount: toAmount,
          balance: toBalance,
          symbol: baseToken?.symbol,
          decimals: baseToken?.decimals,
          price: toPrice,
        },
      }
    }
    return {
      from: {
        address: baseToken?.address,
        amount: fromAmount,
        balance: fromBalance,
        symbol: baseToken?.symbol,
        decimals: baseToken?.decimals,
        price: fromPrice,
      },
      to: {
        address: positionToken?.address,
        amount: toAmount,
        balance: toBalance,
        symbol: positionToken?.symbol,
        decimals: positionToken?.decimals,
        price: toPrice,
      },
    }
  }, [
    baseToken,
    direction,
    fromAmount,
    fromBalance,
    fromPrice,
    positionToken,
    toAmount,
    toBalance,
    toPrice,
  ])

  const getExchangeAmount = useCallback(
    async (
      from,
      amount,
      field
    ): Promise<[IRiskyProposalExchangeAmount, BigNumber]> => {
      if (!proposalPool || !from)
        return new Promise((resolve, reject) => reject(null))
      const exchange = await proposalPool.getExchangeAmount(
        Number(proposalId) + 1,
        from,
        amount,
        [],
        field
      )

      const exchangeWithSlippage = calcSlippage(
        [exchange[0], 18],
        slippage,
        field
      )
      return [exchange, exchangeWithSlippage]
    },
    [proposalPool, proposalId, slippage]
  )

  const exchange = useCallback(
    async (from, amount, field) => {
      const [, amountWithSlippage] = await getExchangeAmount(
        from,
        amount,
        field
      )

      return proposalPool?.exchange(
        Number(proposalId) + 1,
        from,
        amount,
        amountWithSlippage,
        [],
        field
      )
    },
    [getExchangeAmount, proposalId, proposalPool]
  )

  const handleFromChange = useCallback(
    async (v: string) => {
      if (!proposalPool || !priceFeed) return

      const amount = BigNumber.from(v)
      setLastChangedField("from")
      setFromAmount(v)
      try {
        const [exchange] = await getExchangeAmount(
          form.from.address,
          amount,
          ExchangeType.FROM_EXACT
        )

        if (!form.from.address || !form.to.address) return

        const fromPrice = await priceFeed.getNormalizedPriceOutUSD(
          form.from.address,
          amount
        )
        const toPrice = await priceFeed.getNormalizedPriceOutUSD(
          form.to.address,
          exchange[0]
        )

        setToAmount(exchange[0].toString())
        setFromPrice(fromPrice[0])
        setToPrice(toPrice[0])
      } catch (e) {
        console.log(e)
      }
    },
    [
      proposalPool,
      priceFeed,
      getExchangeAmount,
      form.from.address,
      form.to.address,
    ]
  )

  const handleToChange = useCallback(
    async (v: string) => {
      if (!proposalPool || !priceFeed) return

      const amount = BigNumber.from(v)
      setLastChangedField("to")
      setToAmount(v)
      try {
        const [exchange] = await getExchangeAmount(
          form.from.address,
          amount,
          ExchangeType.TO_EXACT
        )

        if (!form.from.address || !form.to.address) return

        const fromPrice = await priceFeed.getNormalizedPriceOutUSD(
          form.from.address,
          exchange[0]
        )
        console.log(fromPrice[0].toString())
        const toPrice = await priceFeed.getNormalizedPriceOutUSD(
          form.to.address,
          amount
        )

        setFromAmount(exchange[0].toString())
        setFromPrice(fromPrice[0])
        setToPrice(toPrice[0])
      } catch (e) {
        console.log(e)
      }
    },
    [
      form.from.address,
      form.to.address,
      getExchangeAmount,
      priceFeed,
      proposalPool,
    ]
  )

  const handlePercentageChange = useCallback(
    (percent: BigNumber) => {
      if (!form.from.decimals) return

      const from = multiplyBignumbers(
        [fromBalance, form.from.decimals],
        [percent, 18]
      )
      handleFromChange(from.toString())
    },
    [form.from.decimals, fromBalance, handleFromChange]
  )

  const estimateGas = useCallback(async () => {
    if (!proposalPool || !form.from.address) return

    if (lastChangedField === "from") {
      const amount = BigNumber.from(fromAmount)
      const [exchange] = await getExchangeAmount(
        form.from.address,
        amount,
        ExchangeType.FROM_EXACT
      )
      return proposalPool.estimateGas.exchange(
        Number(proposalId) + 1,
        form.from.address,
        amount,
        exchange[0],
        [],
        ExchangeType.FROM_EXACT
      )
    }

    const amount = BigNumber.from(toAmount)
    const [, exchangeWithSlippage] = await getExchangeAmount(
      form.from.address,
      amount,
      ExchangeType.TO_EXACT
    )
    return proposalPool.estimateGas.exchange(
      Number(proposalId) + 1,
      form.from.address,
      amount,
      exchangeWithSlippage,
      [],
      ExchangeType.TO_EXACT
    )
  }, [
    form.from.address,
    fromAmount,
    getExchangeAmount,
    lastChangedField,
    proposalId,
    proposalPool,
    toAmount,
  ])

  const updateSwapPrice = useCallback(
    async (address, amount) => {
      const [exchange] = await getExchangeAmount(
        address,
        amount,
        ExchangeType.FROM_EXACT
      )

      setTokenCost(exchange[0])

      if (!priceFeed) return

      const fromPrice = await priceFeed.getNormalizedPriceOutUSD(
        address,
        amount
      )
      setUSDCost(fromPrice[0])
    },
    [getExchangeAmount, priceFeed]
  )

  const updatePositionAmountLP = useCallback(async () => {
    if (!proposalInfo || !baseToken) return

    try {
      const [exchange] = await getExchangeAmount(
        baseToken.address,
        proposalInfo.proposalInfo.balancePosition,
        ExchangeType.TO_EXACT
      )

      const lpAmount = divideBignumbers([exchange[0], 18], [poolPriceBase, 18])

      setPositionAmountLP(lpAmount)
    } catch (e) {
      console.log(e)
    }
  }, [proposalInfo, baseToken, getExchangeAmount, poolPriceBase])

  const runUpdate = useCallback(async () => {
    updateProposalData()
    await updateSwapPrice(form.to.address, parseEther("1"))
    await updatePositionAmountLP()
  }, [
    form.to.address,
    updateProposalData,
    updateSwapPrice,
    updatePositionAmountLP,
  ])

  const handleSubmit = useCallback(async () => {
    if (!proposalPool || !direction) return
    setWalletPrompting(SubmitState.IDLE)

    const params = {
      from: {
        amount: BigNumber.from(fromAmount),
        type: ExchangeType.FROM_EXACT,
      },
      to: {
        amount: BigNumber.from(toAmount),
        type: ExchangeType.TO_EXACT,
      },
    }

    try {
      const transactionResponse = await exchange(
        form.from.address,
        params[lastChangedField].amount,
        params[lastChangedField].type
      )

      setWalletPrompting(SubmitState.WAIT_CONFIRM)

      const tradeType = {
        deposit: TradeType.EXACT_INPUT,
        withdraw: TradeType.EXACT_OUTPUT,
      }

      const tx = await addTransaction(transactionResponse, {
        type: TransactionType.RISKY_PROPOSAL_SWAP,
        tradeType: tradeType[direction],
        inputCurrencyId: form.from.address,
        inputCurrencyAmountRaw: form.from.amount,
        outputCurrencyId: form.to.address,
        expectedOutputCurrencyAmountRaw: form.to.amount,
        // TODO: add slippage amount
        minimumOutputCurrencyAmountRaw: ZERO.toHexString(),
      })

      if (isTxMined(tx)) {
        runUpdate()
        setWalletPrompting(SubmitState.SUCCESS)
      }
    } catch (error: any) {
      setWalletPrompting(SubmitState.IDLE)
      const errorMessage = parseTransactionError(error.toString())
      !!errorMessage && setError(errorMessage)
    }
  }, [
    addTransaction,
    direction,
    exchange,
    form,
    fromAmount,
    lastChangedField,
    proposalPool,
    runUpdate,
    toAmount,
    setError,
    setWalletPrompting,
  ])

  // set balances
  useEffect(() => {
    if (!proposalInfo) return

    if (direction === "deposit") {
      setFromBalance(proposalInfo.proposalInfo.balanceBase)
      setToBalance(proposalInfo.proposalInfo.balancePosition)
    }

    if (direction === "withdraw") {
      setFromBalance(proposalInfo.proposalInfo.balancePosition)
      setToBalance(proposalInfo.proposalInfo.balanceBase)
    }
  }, [proposalInfo, direction])

  // set your share
  useEffect(() => {
    if (!investmentsInfo) return
    setLpBalance(investmentsInfo.lpInvested)
  }, [investmentsInfo])

  useEffect(() => {
    if (!proposalInfo) return

    try {
      const lpLocked = FixedNumber.fromValue(
        proposalInfo.proposalInfo.lpLocked,
        18
      )
      const share = FixedNumber.fromValue(traderShare, 18)
      const pnlPercent = FixedNumber.fromValue(positionPnl, 18)
      const oneHundredPercents = FixedNumber.from("100")
      const priceUSD = FixedNumber.fromValue(poolPriceUSD, 18)

      const shareLP = lpLocked.mulUnsafe(share)

      const sharePnlLP = shareLP
        .divUnsafe(oneHundredPercents)
        .mulUnsafe(pnlPercent)
      const sharePnlUSD = sharePnlLP.mulUnsafe(priceUSD)

      const proposalPnlLP = lpLocked
        .divUnsafe(oneHundredPercents)
        .mulUnsafe(pnlPercent)
      const proposalPnlUSD = proposalPnlLP.mulUnsafe(priceUSD)

      setPositionPnlLP(parseEther(proposalPnlLP._value))
      setPositionPnlUSD(parseEther(proposalPnlUSD._value))

      setTraderPnlLP(parseEther(sharePnlLP._value))
      setTraderPnlUSD(parseEther(sharePnlUSD._value))
    } catch (e) {
      console.log(e)
    }
  }, [proposalInfo, traderShare, positionPnl, poolPriceUSD])

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
   * calculate investor share percentage
   */
  useEffect(() => {
    if (!proposalInfo || !investmentsInfo) return

    const share = divideBignumbers(
      [investmentsInfo.lp2Balance, 18],
      [proposalInfo.lp2Supply, 18]
    )

    setTraderShare(share)
  }, [investmentsInfo, proposalInfo])

  /**
   * get position token market price
   */
  useEffect(() => {
    if (!priceFeed || !proposalInfo || !poolInfo) return
    ;(async () => {
      try {
        const amount = parseUnits("1", 18)

        // without extended
        const price = await priceFeed.getNormalizedExtendedPriceOut(
          proposalInfo.proposalInfo.token,
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
  }, [priceFeed, proposalInfo, poolInfo])

  /**
   * calculate position pnl percentage
   */
  useEffect(() => {
    if (avgBuyingPrice.isZero() || positionTokenPrice.isZero()) return

    const percent = percentageOfBignumbers(positionTokenPrice, avgBuyingPrice)

    setPositionPnl(percent.sub(parseEther("100")))
  }, [avgBuyingPrice, positionTokenPrice])

  // fetch swap price
  useEffect(() => {
    if (!form.to.address) return

    updateSwapPrice(form.to.address, parseEther("1")).catch(console.log)
  }, [form.from.address, form.to.address, updateSwapPrice])

  // estimate gas price
  useEffect(() => {
    const amount = BigNumber.from(fromAmount)
    if (amount.isZero()) return
    ;(async () => {
      try {
        const gasPrice = await estimateGas()

        if (!gasPrice) return

        const gas = getGasPrice(gasPrice.toNumber())
        setGasPrice(gas)
      } catch (e) {}
    })()
  }, [estimateGas, fromAmount, getGasPrice])

  // global updater
  useEffect(() => {
    const interval = setInterval(() => {
      runUpdate().catch(console.error)
    }, Number(process.env.REACT_APP_UPDATE_INTERVAL))

    return () => clearInterval(interval)
  }, [runUpdate])

  return [
    form,
    {
      info,
      lpBalance,
      gasPrice,
      oneTokenCost,
      oneUSDCost,
      slippage,
      setSlippage,
      isSlippageOpen,
      setSlippageOpen,
      handleFromChange,
      handleToChange,
      handlePercentageChange,
      handleSubmit,
    },
  ]
}

export default useSwapRiskyProposal
