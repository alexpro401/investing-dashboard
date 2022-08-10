import {
  useCallback,
  useMemo,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react"
import {
  ExchangeForm,
  ExchangeType,
  RiskyProposal,
} from "constants/interfaces_v2"
import { SwapDirection, TradeType } from "constants/types"
import { BigNumber } from "@ethersproject/bignumber"
import { parseEther } from "@ethersproject/units"
import { useRiskyProposal } from "hooks/useRiskyProposals"
import { usePoolContract } from "hooks/usePool"
import { useERC20, usePriceFeedContract } from "hooks/useContract"
import { divideBignumbers, multiplyBignumbers } from "utils/formulas"
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

const ZERO = BigNumber.from("0")

export interface UseSwapRiskyParams {
  poolAddress?: string
  proposalId?: string
  direction?: SwapDirection
}

interface UseSwapRiskyResponse {
  info: any
  gasPrice: string
  error: string
  lpBalance: BigNumber
  oneTokenCost: BigNumber
  oneUSDCost: BigNumber
  slippage: string
  isSlippageOpen: boolean
  isWalletPrompting: boolean
  setError: Dispatch<SetStateAction<string>>
  setSlippage: Dispatch<SetStateAction<string>>
  setWalletPrompting: Dispatch<SetStateAction<boolean>>
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
  const [error, setError] = useState("")
  const [slippage, setSlippage] = useState("0.10")
  const [isSlippageOpen, setSlippageOpen] = useState(false)
  const [isWalletPrompting, setWalletPrompting] = useState(false)

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
  const { priceBase } = usePoolPrice(poolAddress)

  const addTransaction = useTransactionAdder()
  const [, poolInfo] = usePoolContract(poolAddress)
  const priceFeed = usePriceFeedContract()

  const [, baseToken] = useERC20(poolInfo?.parameters.baseToken)
  const [, positionToken] = useERC20(proposalInfo?.proposalInfo.token)

  const [gasTrackerResponse, getGasPrice] = useGasTracker()

  const info = useMemo(() => {
    const TIMESTAMP_LIMIT =
      (proposalInfo?.proposalInfo.proposalLimits.timestampLimit.toNumber() ||
        0) * 1000

    return {
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
      expirationDate: {
        amount: format(TIMESTAMP_LIMIT, "MMM.dd.yy hh:mm"),
        label: format(TIMESTAMP_LIMIT, "O"),
      },
      maxPrice: normalizeBigNumber(
        proposalInfo?.proposalInfo.proposalLimits.maxTokenPriceLimit || ZERO
      ),
    }
  }, [baseToken, positionToken, proposalInfo, poolInfo, positionAmountLP])

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
    async (from, amount, field) => {
      const exchange = await proposalPool?.getExchangeAmount(
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
    if (!proposalPool) return

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

      const fromPrice = await priceFeed?.getNormalizedPriceOutUSD(
        address,
        amount
      )
      setTokenCost(exchange[0])
      setUSDCost(fromPrice[0])
    },
    [getExchangeAmount, priceFeed]
  )

  const updateRPBalance = useCallback(async () => {
    const balance = await proposalPool?.balanceOf(account, 1)
    setLpBalance(balance)
  }, [proposalPool, account])

  const updatePositionAmountLP = useCallback(async () => {
    if (!proposalInfo || !baseToken) return

    try {
      const [exchange] = await getExchangeAmount(
        baseToken.address,
        proposalInfo.proposalInfo.balancePosition,
        ExchangeType.TO_EXACT
      )

      const lpAmount = divideBignumbers([exchange[0], 18], [priceBase, 18])

      setPositionAmountLP(lpAmount)
    } catch (e) {
      console.log(e)
    }
  }, [proposalInfo, baseToken, getExchangeAmount, priceBase])

  const runUpdate = useCallback(async () => {
    updateProposalData()
    await updateSwapPrice(form.to.address, parseEther("1"))
    await updateRPBalance()
    await updatePositionAmountLP()
  }, [
    form.to.address,
    updateProposalData,
    updateSwapPrice,
    updateRPBalance,
    updatePositionAmountLP,
  ])

  const handleSubmit = useCallback(async () => {
    if (!proposalPool) return
    setWalletPrompting(true)

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

      setWalletPrompting(false)

      const tradeType = {
        deposit: TradeType.EXACT_INPUT,
        withdraw: TradeType.EXACT_OUTPUT,
      }

      const tx = await addTransaction(transactionResponse, {
        type: TransactionType.SWAP_RISKY_PROPOSAL,
        tradeType: tradeType[direction!],
        inputCurrencyId: form.from.address,
        inputCurrencyAmountRaw: form.from.amount,
        outputCurrencyId: form.to.address,
        expectedOutputCurrencyAmountRaw: form.to.amount,
        // TODO: add slippage amount
        minimumOutputCurrencyAmountRaw: ZERO.toHexString(),
      })

      if (isTxMined(tx)) {
        runUpdate()
      }
    } catch (error: any) {
      setWalletPrompting(false)
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
    if (!proposalPool) return

    updateRPBalance().catch(console.error)
  }, [proposalPool, updateRPBalance])

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
      error,
      setError,
      isWalletPrompting,
      setWalletPrompting,
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
