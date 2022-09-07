import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react"

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

import { IDivestAmountsAndCommissions } from "interfaces/contracts/ITraderPool"

import {
  useERC20,
  useInvestPoolContract,
  useInvestProposalContract,
  useTraderPoolContract,
} from "hooks/useContract"
import { usePoolContract } from "hooks/usePool"
import usePoolPrice from "hooks/usePoolPrice"
import { useInvestProposal } from "hooks/useInvestmentProposals"

import { RiskyForm } from "interfaces/exchange"
import { ZERO } from "constants/index"
import { SubmitState } from "constants/types"
import { DATE_TIME_FORMAT } from "constants/time"

import {
  expandTimestamp,
  isTxMined,
  normalizeBigNumber,
  parseTransactionError,
} from "utils"
import { divideBignumbers, multiplyBignumbers } from "utils/formulas"
import useError from "hooks/useError"
import usePayload from "hooks/usePayload"

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
  },
  {
    setSlippageOpen: (state: boolean) => void
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
  const [isSlippageOpen, setSlippageOpen] = useState(false)
  const [toSelectorOpened, setToSelector] = useState(false)
  const [fromSelectorOpened, setFromSelector] = useState(false)
  const [, setWalletPrompting] = usePayload()
  const [, setError] = useError()

  const [toAddress, setToAddress] = useState("")
  const [fromAddress, setFromAddress] = useState("")

  const traderPool = useTraderPoolContract(poolAddress)
  const investPool = useInvestPoolContract(poolAddress)
  const [proposalPool] = useInvestProposalContract(poolAddress)
  const [proposal, updateProposal] = useInvestProposal(poolAddress, proposalId)

  const [, poolInfo] = usePoolContract(poolAddress)
  const [, baseData] = useERC20(poolInfo?.parameters.baseToken)
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

  const poolIcon = (
    <Icon
      size={27}
      source={poolMetadata?.assets[poolMetadata?.assets.length - 1]}
      address={poolAddress}
    />
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

    const lpAvailable = await traderPool?.balanceOf(account)

    setLPBalance(lpAvailable)
  }, [account, traderPool])

  const getLP2Balance = useCallback(async () => {
    if (!proposalPool || !account) return

    const balance = await proposalPool?.balanceOf(
      account,
      Number(proposalId) + 1
    )

    setLP2Balance(balance)
  }, [account, proposalId, proposalPool])

  const runUpdate = useCallback(() => {
    updatePoolPrice()
    updateProposal()
    getLPBalance().catch(console.error)
    getLP2Balance().catch(console.error)
  }, [getLP2Balance, getLPBalance, updateProposal, updatePoolPrice])

  const getDivestTokens = useCallback(
    async (amount: BigNumber): Promise<IDivestAmountsAndCommissions> => {
      const divests: IDivestAmountsAndCommissions =
        await traderPool?.getDivestAmountsAndCommissions(account, amount)
      return divests
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
      isSlippageOpen,
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
      setSlippageOpen,
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
