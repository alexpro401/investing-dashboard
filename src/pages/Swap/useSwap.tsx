import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { parseUnits } from "@ethersproject/units"
import { BigNumber } from "@ethersproject/bignumber"

import { ITraderPoolExchangeAmount } from "interfaces/contracts/ITraderPool"
import { ExchangeType } from "interfaces/exchange"
import { ExchangeForm } from "interfaces/exchange"
import { SubmitState, SwapDirection, TradeType } from "constants/types"
import { ZERO } from "constants/index"

import { useTransactionAdder } from "state/transactions/hooks"
import { TransactionType } from "state/transactions/types"
import useGasTracker from "state/gas/hooks"

import { usePoolContract, usePoolPosition, usePoolQuery } from "hooks/usePool"
import useError from "hooks/useError"
import usePayload from "hooks/usePayload"

import { usePriceFeedContract, useTraderPoolContract } from "contracts"

import {
  addBignumbers,
  getPriceImpact,
  multiplyBignumbers,
  divideBignumbers,
} from "utils/formulas"

import {
  calcSlippage,
  isAddress,
  isTxMined,
  normalizeBigNumber,
  parseTransactionError,
} from "utils"
import usePoolPrice from "hooks/usePoolPrice"
import { useERC20Data } from "state/erc20/hooks"

interface UseSwapProps {
  pool: string | undefined
  from: string | undefined
  to: string | undefined
}

interface UseSwapInfo {
  fundPNL: {
    lp: string
    percent: string
    usd: string
    traderLP: string
    traderUSD: string
  }
  avgBuyingPrice: string
  avgSellingPrice: string
  baseSymbol?: string
}

interface UseSwapResponse {
  info: UseSwapInfo
  direction: SwapDirection
  gasPrice: string
  oneTokenCost: BigNumber
  oneUSDCost: BigNumber
  receivedAfterSlippage: BigNumber
  priceImpact: string
  slippage: string
  isSlippageOpen: boolean
  swapPath: string[]
  setSlippage: Dispatch<SetStateAction<string>>
  setSlippageOpen: Dispatch<SetStateAction<boolean>>
  handleFromChange: (v: string) => void
  handleToChange: (v: string) => void
  handleSubmit: () => void
  handlePercentageChange: (p: BigNumber) => void
}

const useSwap = ({
  pool,
  from,
  to,
}: UseSwapProps): [ExchangeForm, UseSwapResponse] => {
  const [, poolInfo, refreshPoolInfo] = usePoolContract(pool)
  const priceFeed = usePriceFeedContract()
  const traderPool = useTraderPoolContract(pool)
  const addTransaction = useTransactionAdder()
  const [gasTrackerResponse, getGasPrice] = useGasTracker()

  const [fromToken] = useERC20Data(from)
  const [toToken] = useERC20Data(to)

  const [avgBuyingPrice, setAvgBuyingPrice] = useState(ZERO)
  const [avgSellingPrice, setAvgSellingPrice] = useState(ZERO)
  const [traderShare, setTraderShare] = useState(ZERO)
  const [totalLockedLP, setTotalLockedLP] = useState(ZERO)
  const [pnl, setPNL] = useState(ZERO)
  const [pnlLP, setPNLLP] = useState(ZERO)
  const [receivedAfterSlippage, setReceivedAfterSlippage] = useState(ZERO)
  const [priceImpact, setPriceImpact] = useState("0.00")
  const [gasPrice, setGasPrice] = useState("0.00")
  const [, setError] = useError()
  const [slippage, setSlippage] = useState("0.10")
  const [isSlippageOpen, setSlippageOpen] = useState(false)
  const [, setWalletPrompting] = usePayload()
  const [fromAmount, setFromAmount] = useState("0")
  const [toAmount, setToAmount] = useState("0")
  const [toBalance, setToBalance] = useState(ZERO)
  const [fromBalance, setFromBalance] = useState(ZERO)
  const [fromPrice, setFromPrice] = useState(ZERO)
  const [toPrice, setToPrice] = useState(ZERO)
  const [oneTokenCost, setTokenCost] = useState(ZERO)
  const [oneUSDCost, setUSDCost] = useState(ZERO)
  const [swapPath, setSwapPath] = useState<string[]>([])
  const [lastChangedField, setLastChangedField] = useState<"from" | "to">(
    "from"
  )

  const [baseTokenData] = useERC20Data(poolInfo?.parameters.baseToken)
  const [{ priceUSD }] = usePoolPrice(pool)
  const [history] = usePoolQuery(pool)
  const position = usePoolPosition(pool, to)

  const transactionOptions = useMemo(() => {
    if (!gasTrackerResponse) return
    return {
      gasPrice: parseUnits(gasTrackerResponse.ProposeGasPrice, "gwei"),
    }
  }, [gasTrackerResponse])

  const info = useMemo(() => {
    const pnlUSD = multiplyBignumbers([pnlLP, 18], [priceUSD, 18])
    const traderLP = multiplyBignumbers([pnlLP, 18], [traderShare, 18])
    const traderPNLUSD = multiplyBignumbers([traderLP, 18], [priceUSD, 18])
    const baseSymbol = baseTokenData?.symbol

    return {
      fundPNL: {
        lp: `${normalizeBigNumber(pnlLP, 18, 2)} ${poolInfo?.ticker}`,
        percent: `${normalizeBigNumber(pnl, 4, 2)}%`,
        usd: `${normalizeBigNumber(pnlUSD, 18, 2)} USD`,
        traderLP: `${normalizeBigNumber(traderLP, 18, 2)} ${poolInfo?.ticker}`,
        traderUSD: `${normalizeBigNumber(traderPNLUSD, 18, 2)} USD`,
      },
      avgBuyingPrice: normalizeBigNumber(avgBuyingPrice, 18, 6),
      avgSellingPrice: normalizeBigNumber(avgSellingPrice, 18, 6),
      baseSymbol,
    }
  }, [
    pnlLP,
    priceUSD,
    traderShare,
    poolInfo,
    pnl,
    avgBuyingPrice,
    avgSellingPrice,
    baseTokenData,
  ])

  const form = useMemo(
    () => ({
      from: {
        address: from,
        amount: fromAmount,
        balance: fromBalance,
        symbol: fromToken?.symbol,
        decimals: fromToken?.decimals,
        price: fromPrice,
      },
      to: {
        address: to,
        amount: toAmount,
        balance: toBalance,
        symbol: toToken?.symbol,
        decimals: toToken?.decimals,
        price: toPrice,
      },
    }),
    [
      from,
      fromAmount,
      fromBalance,
      fromPrice,
      fromToken,
      to,
      toAmount,
      toBalance,
      toPrice,
      toToken,
    ]
  )

  const direction = useMemo<SwapDirection>(() => {
    if (
      form.to.address?.toLocaleLowerCase() ===
      poolInfo?.parameters.baseToken.toLocaleLowerCase()
    ) {
      return "withdraw"
    }

    return "deposit"
  }, [form.to.address, poolInfo])

  const updatePriceImpact = (from: BigNumber, to: BigNumber) => {
    const result = getPriceImpact(from, to)
    setPriceImpact(result)
  }

  const getExchangeFromAmounts = useCallback(
    async (
      amount: BigNumber
    ): Promise<[ITraderPoolExchangeAmount, BigNumber]> => {
      if (!traderPool || !from || !to)
        return new Promise((resolve, reject) => reject(null))

      const exchange = await traderPool.getExchangeAmount(
        from,
        to,
        amount.toHexString(),
        [],
        ExchangeType.FROM_EXACT
      )

      const exchangeWithSlippage = calcSlippage(
        [exchange[0], 18],
        slippage,
        ExchangeType.FROM_EXACT
      )
      return [exchange, exchangeWithSlippage]
    },
    [from, slippage, to, traderPool]
  )
  const getExchangeToAmounts = useCallback(
    async (
      amount: BigNumber
    ): Promise<[ITraderPoolExchangeAmount, BigNumber]> => {
      if (!traderPool || !from || !to)
        return new Promise((resolve, reject) => reject(null))

      const exchange = await traderPool.getExchangeAmount(
        from,
        to,
        amount.toHexString(),
        [],
        ExchangeType.TO_EXACT
      )

      const exchangeWithSlippage = calcSlippage(
        [exchange[0], 18],
        slippage,
        ExchangeType.TO_EXACT
      )
      return [exchange, exchangeWithSlippage]
    },
    [from, slippage, to, traderPool]
  )

  const handleFromChange = useCallback(
    (v: string) => {
      if (!traderPool || !priceFeed || !from || !to) return
      setLastChangedField("from")

      const amount = BigNumber.from(v)
      setFromAmount(amount.toString())

      const fetchAndUpdateTo = async () => {
        const amount = BigNumber.from(v)

        const [exchange, exchangeWithSlippage] = await getExchangeFromAmounts(
          amount
        )
        setReceivedAfterSlippage(exchangeWithSlippage)

        const fromPrice = await priceFeed.getNormalizedPriceOutUSD(
          from,
          amount.toHexString()
        )
        const toPrice = await priceFeed.getNormalizedPriceOutUSD(
          to,
          exchange[0].toHexString()
        )

        const receivedAmount = exchange[0]
        setSwapPath(exchange[1])
        setToAmount(receivedAmount.toString())
        setFromPrice(fromPrice[0])
        setToPrice(toPrice[0])

        updatePriceImpact(fromPrice[0], toPrice[0])
      }

      fetchAndUpdateTo().catch(console.error)
    },
    [from, getExchangeFromAmounts, priceFeed, to, traderPool]
  )

  const handleToChange = useCallback(
    (v: string) => {
      if (!traderPool || !priceFeed || !from || !to) return
      setLastChangedField("to")

      const amount = BigNumber.from(v)
      setToAmount(amount.toString())

      const fetchAndUpdateFrom = async () => {
        const amount = BigNumber.from(v)

        const [exchange, exchangeWithSlippage] = await getExchangeToAmounts(
          amount
        )

        const fromPrice = await priceFeed?.getNormalizedPriceOutUSD(to, amount)
        const toPrice = await priceFeed?.getNormalizedPriceOutUSD(
          from,
          exchangeWithSlippage
        )
        setSwapPath(exchange[1])
        setFromAmount(exchange[0].toString())
        setFromPrice(fromPrice[0])
        setToPrice(toPrice[0])

        updatePriceImpact(fromPrice[0], toPrice[0])
      }

      fetchAndUpdateFrom().catch(console.error)
    },
    [traderPool, priceFeed, getExchangeToAmounts, to, from]
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

  const getTokenBalance = useCallback(
    (token: string | undefined) => {
      if (!poolInfo) return ZERO

      if (
        token?.toLocaleLowerCase() ===
        poolInfo.parameters.baseToken.toLocaleLowerCase()
      ) {
        return poolInfo.baseAndPositionBalances[0]
      }

      const positionIndex = poolInfo.openPositions
        .map((address) => address.toLocaleLowerCase())
        .indexOf((token || "").toLocaleLowerCase())

      if (positionIndex === -1) return ZERO

      return poolInfo.baseAndPositionBalances[positionIndex + 1]
    },
    [poolInfo]
  )

  const runUpdate = useCallback(() => {
    refreshPoolInfo()
  }, [refreshPoolInfo])

  const exchangeParams = useMemo(() => {
    return {
      from: {
        amount: fromAmount,
        func: getExchangeFromAmounts,
        type: ExchangeType.FROM_EXACT,
      },
      to: {
        amount: toAmount,
        func: getExchangeToAmounts,
        type: ExchangeType.TO_EXACT,
      },
    }
  }, [fromAmount, getExchangeFromAmounts, getExchangeToAmounts, toAmount])

  const estimateGas = useCallback(async () => {
    if (!traderPool || !from || !to) return

    try {
      const amount = BigNumber.from(exchangeParams[lastChangedField].amount)
      const [, exchangeWithSlippage] = await exchangeParams[
        lastChangedField
      ].func(amount)

      return await traderPool.estimateGas.exchange(
        from,
        to,
        amount.toHexString(),
        exchangeWithSlippage.toHexString(),
        [],
        exchangeParams[lastChangedField].type
      )
    } catch (e) {
      return
    }
  }, [exchangeParams, from, lastChangedField, to, traderPool])

  const handleSubmit = useCallback(async () => {
    if (!traderPool || !from || !to) return

    setWalletPrompting(SubmitState.SIGN)
    try {
      const amount = BigNumber.from(exchangeParams[lastChangedField].amount)
      const [exchange, exchangeWithSlippage] = await exchangeParams[
        lastChangedField
      ].func(amount)

      const transactionResponse = await traderPool.exchange(
        from,
        to,
        amount.toHexString(),
        exchangeWithSlippage.toHexString(),
        [],
        exchangeParams[lastChangedField].type,
        transactionOptions
      )

      setWalletPrompting(SubmitState.WAIT_CONFIRM)

      const receipt = await addTransaction(transactionResponse, {
        type: TransactionType.SWAP,
        tradeType: TradeType.EXACT_INPUT,
        inputCurrencyId: from,
        inputCurrencyAmountRaw: amount.toHexString(),
        expectedOutputCurrencyAmountRaw: exchange[0].toHexString(),
        outputCurrencyId: to,
        minimumOutputCurrencyAmountRaw: exchangeWithSlippage.toHexString(),
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
    exchangeParams,
    lastChangedField,
    from,
    to,
    transactionOptions,
    addTransaction,
    runUpdate,
    setError,
    setWalletPrompting,
  ])

  // read and update prices
  useEffect(() => {
    if (!traderPool || !priceFeed || !from || !to) return

    const amount = parseUnits("1", 18)

    const fetchAndUpdatePrices = async () => {
      const tokensCost = await traderPool?.getExchangeAmount(
        from,
        to,
        amount.toHexString(),
        [],
        ExchangeType.TO_EXACT
      )
      const usdCost = await priceFeed?.getNormalizedPriceOutUSD(
        to,
        amount.toHexString()
      )
      setTokenCost(tokensCost[0])
      setUSDCost(usdCost[0])
    }

    if (!isAddress(from) || !isAddress(to)) return
    fetchAndUpdatePrices().catch(console.error)
  }, [traderPool, priceFeed, from, to])

  // global updater
  useEffect(() => {
    const interval = setInterval(() => {
      runUpdate()
    }, Number(process.env.REACT_APP_UPDATE_INTERVAL))

    return () => clearInterval(interval)
  }, [runUpdate])

  // balance updater
  useEffect(() => {
    if (!poolInfo) return

    const fromBalanceData = getTokenBalance(from)
    const toBalanceData = getTokenBalance(to)

    setFromBalance(fromBalanceData)
    setToBalance(toBalanceData)
  }, [from, getTokenBalance, poolInfo, to])

  // update total locked LP
  useEffect(() => {
    if (!poolInfo) return

    const total = addBignumbers(
      [poolInfo.lpSupply, 18],
      [poolInfo.lpLockedInProposals, 18]
    )

    setTotalLockedLP(total)
  }, [poolInfo])

  // update pnl
  useEffect(() => {
    if (!history) return

    if (!history.priceHistory || !history.priceHistory.length) return

    const { percPNL } = history.priceHistory[0]

    setPNL(BigNumber.from(percPNL))
  }, [history])

  useEffect(() => {
    if (pnl.isZero() || totalLockedLP.isZero()) return

    const pnlLP = multiplyBignumbers([pnl, 6], [totalLockedLP, 18])
    setPNLLP(pnlLP)
  }, [pnl, totalLockedLP])

  // calculate trader pool share percentage from poolInfo. using totalPoolBase and traderBase values
  useEffect(() => {
    if (!poolInfo) return

    const share = divideBignumbers(
      [poolInfo.traderBase, 18],
      [poolInfo.totalPoolBase, 18]
    )

    setTraderShare(share)
  }, [poolInfo])

  // estimate gas price
  useEffect(() => {
    const amount = BigNumber.from(fromAmount)
    if (amount.isZero()) return
    ;(async () => {
      const gasPrice = await estimateGas()

      if (!gasPrice) return

      const gas = getGasPrice(gasPrice.toNumber())
      setGasPrice(gas)
    })()
  }, [estimateGas, fromAmount, getGasPrice])

  // update avg buy/sell price
  useEffect(() => {
    if (!position) return

    const baseOpen = BigNumber.from(position.totalBaseOpenVolume)
    const positionOpen = BigNumber.from(position.totalPositionOpenVolume)

    if (positionOpen.isZero()) return
    const buyingPrice = divideBignumbers([baseOpen, 18], [positionOpen, 18])
    setAvgBuyingPrice(buyingPrice)

    const baseClose = BigNumber.from(position.totalBaseCloseVolume)
    const positionClose = BigNumber.from(position.totalPositionCloseVolume)

    if (positionClose.isZero()) return
    const sellingPrice = divideBignumbers([baseClose, 18], [positionClose, 18])
    setAvgSellingPrice(sellingPrice)
  }, [position])

  return [
    form,
    {
      info,
      direction,
      gasPrice,
      receivedAfterSlippage,
      priceImpact,
      oneTokenCost,
      oneUSDCost,
      isSlippageOpen,
      slippage,
      swapPath,
      setSlippage,
      setSlippageOpen,
      handleSubmit,
      handleFromChange,
      handleToChange,
      handlePercentageChange,
    },
  ]
}

export default useSwap
