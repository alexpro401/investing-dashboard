import { useState, useEffect, useCallback, useMemo } from "react"
import { parseTransactionError } from "utils"

import { useWeb3React } from "@web3-react/core"
import { BigNumber } from "@ethersproject/bignumber"

import Icon from "components/Icon"

import { useTransactionAdder } from "state/transactions/hooks"
import { TransactionType } from "state/transactions/types"
import {
  useInvestProposalMetadata,
  usePoolMetadata,
} from "state/ipfsMetadata/hooks"
import { SwapDirection } from "constants/types"

import { divideBignumbers, multiplyBignumbers } from "utils/formulas"

import {
  IDivestAmounts,
  IProposalInvestTokens,
} from "interfaces/ITraderPoolRiskyProposal"
import {
  IDivestAmountsAndCommissions,
  IPoolInvestTokens,
} from "interfaces/ITraderPool"

import useAlert, { AlertType } from "hooks/useAlert"
import { usePoolContract } from "hooks/usePool"
import {
  useBasicPoolContract,
  useERC20,
  useInvestPoolContract,
  useInvestProposalContract,
  useTraderPoolContract,
} from "hooks/useContract"
import { RiskyForm } from "constants/interfaces_v2"
import usePoolPrice from "hooks/usePoolPrice"
import useGasTracker from "state/gas/hooks"
import {
  useActiveInvestmentsInfo,
  useInvestProposal,
} from "hooks/useInvestmentProposals"
import useInvestmentPrice from "hooks/useInvestmentPrice"
import { ZERO } from "constants/index"
import { formatEther } from "@ethersproject/units"

const useInvestInvestmentProposal = (
  poolAddress?: string,
  proposalId?: string
): [
  {
    formWithDirection: RiskyForm
    isSlippageOpen: boolean
    inPrice: BigNumber
    outPrice: BigNumber
    fromAmount: BigNumber
    toAmount: BigNumber
    slippage: string
    fromAddress: string
    toAddress: string
    toSelectorOpened: boolean
    fromSelectorOpened: boolean
    direction: SwapDirection
  },
  {
    setSlippageOpen: (state: boolean) => void
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

  const [lpBalance, setLPBalance] = useState(ZERO)
  const [lp2Balance, setLP2Balance] = useState(ZERO)
  const [inPrice, setInPrice] = useState(ZERO)
  const [outPrice, setOutPrice] = useState(ZERO)
  const [fromAmount, setFromAmount] = useState(ZERO)
  const [toAmount, setToAmount] = useState(ZERO)
  const [slippage, setSlippage] = useState("0.10")
  const [isSlippageOpen, setSlippageOpen] = useState(false)
  const [toSelectorOpened, setToSelector] = useState(false)
  const [fromSelectorOpened, setFromSelector] = useState(false)
  const [direction, setDirection] = useState<SwapDirection>("deposit")

  const [toAddress, setToAddress] = useState("")
  const [fromAddress, setFromAddress] = useState("")

  const handleDirectionChange = useCallback(() => {
    setDirection(direction === "deposit" ? "withdraw" : "deposit")
  }, [direction])

  const traderPool = useTraderPoolContract(poolAddress)
  const investPool = useInvestPoolContract(poolAddress)
  const [proposalPool] = useInvestProposalContract(poolAddress)
  const proposal = useInvestProposal(poolAddress, proposalId)
  const investmentsInfo = useActiveInvestmentsInfo(
    poolAddress,
    account,
    proposalId
  )
  const [, poolInfo] = usePoolContract(poolAddress)
  const [{ poolMetadata }] = usePoolMetadata(
    poolAddress,
    poolInfo?.parameters.descriptionURL
  )

  const [{ investProposalMetadata }] = useInvestProposalMetadata(
    poolAddress,
    proposal?.proposalInfo.descriptionURL
  )

  const { priceUSD: poolPriceUSD } = usePoolPrice(poolAddress)

  const addTransaction = useTransactionAdder()

  console.log("base Invested: ", investmentsInfo?.baseInvested.toString())
  console.log("lp2 balance: ", investmentsInfo?.lp2Balance.toString())
  console.log("lp invested: ", investmentsInfo?.lpInvested.toString())

  const poolIcon = (
    <Icon
      size={27}
      source={poolMetadata?.assets[poolMetadata?.assets.length - 1]}
      address={poolAddress}
    />
  )

  const exchangeForm = useMemo(() => {
    return {
      deposit: {
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
      },
      withdraw: {
        from: {
          address: undefined,
          amount: fromAmount.toString(),
          balance: lp2Balance,
          price: inPrice,
          symbol: investProposalMetadata?.ticker,
          decimals: 18,
          icon: poolIcon,
          info: {},
        },
        to: {
          address: undefined,
          amount: toAmount.toString(),
          balance: lpBalance,
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
    lpBalance,
    lp2Balance,
    inPrice,
    outPrice,
    poolIcon,
    poolInfo,
    investProposalMetadata,
  ])

  const formWithDirection = exchangeForm[direction]

  const getLPBalance = useCallback(async () => {
    if (!traderPool || !account) return

    const lpAvailable = await traderPool?.balanceOf(account)

    setLPBalance(lpAvailable)
  }, [account, traderPool])

  const getLP2Balance = useCallback(async () => {
    // if (!investmentsInfo) return

    // const balance = investmentsInfo.lp2Balance

    if (!proposalPool || !account) return

    const balance = await proposalPool?.balanceOf(
      account,
      Number(proposalId) + 1
    )

    setLP2Balance(balance)
  }, [account, proposalId, proposalPool])

  const getDivestTokens = useCallback(
    async (amount: BigNumber): Promise<IDivestAmountsAndCommissions> => {
      const divests: IDivestAmountsAndCommissions =
        await traderPool?.getDivestAmountsAndCommissions(account, amount)
      return divests
    },
    [account, traderPool]
  )

  const estimateDepositGasPrice = useCallback(async () => {}, [])

  const estimateGas = useCallback(async () => {
    return await estimateDepositGasPrice()
  }, [estimateDepositGasPrice])

  const handleSubmit = useCallback(async () => {
    if (!traderPool || !account || !proposalId || !investPool) return

    try {
      const divests = await getDivestTokens(fromAmount)

      console.log(
        "amounts: ",
        divests.receptions.receivedAmounts
          .reduce((prev, next) => prev.add(next), ZERO)
          .toString()
      )

      console.log("lpAmount: ", divests.receptions.lpAmount.toString())

      const investReceipt = await investPool.investProposal(
        Number(proposalId) + 1,
        fromAmount,
        divests.receptions.receivedAmounts
      )

      console.log(investReceipt)
    } catch (error: any) {
      console.log(error)
      // const errorMessage = parseTransactionError(error)
      // showAlert({
      //   content: errorMessage,
      //   type: AlertType.warning,
      //   hideDuration: 10000,
      // })
    }
  }, [account, fromAmount, getDivestTokens, proposalId, traderPool, investPool])

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
      setToAmount(amount)
      setInPrice(priceUSD)
      setOutPrice(priceUSD)
      try {
      } catch (e) {
        console.log(e)
      }
    },
    [getPriceUSD]
  )

  const handlePercentageChange = useCallback(
    (percent: BigNumber) => {
      const from = multiplyBignumbers([lpBalance, 18], [percent, 18])
      handleFromChange(from.toString())
    },
    [lpBalance, handleFromChange]
  )

  // get LP balance
  // get LP2 balance
  // update amounts
  useEffect(() => {
    getLPBalance().catch(console.error)
    getLP2Balance().catch(console.error)
  }, [direction, getLP2Balance, getLPBalance])

  // balance updater for both LP and LP2
  useEffect(() => {
    const interval = setInterval(() => {
      getLPBalance().catch(console.error)
      getLP2Balance().catch(console.error)
    }, Number(process.env.REACT_APP_UPDATE_INTERVAL))

    return () => clearInterval(interval)
  }, [getLPBalance, getLP2Balance])

  return [
    {
      formWithDirection,
      isSlippageOpen,
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

export default useInvestInvestmentProposal
