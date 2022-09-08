import { useState, useEffect, useCallback, useMemo } from "react"
import {
  expandTimestamp,
  isTxMined,
  normalizeBigNumber,
  parseTransactionError,
  shortenAddress,
} from "utils"

import { useWeb3React } from "@web3-react/core"
import { BigNumber } from "@ethersproject/bignumber"

import Avatar from "components/Avatar"

import { useTransactionAdder } from "state/transactions/hooks"
import { TransactionType } from "state/transactions/types"
import { useUserMetadata } from "state/ipfsMetadata/hooks"

import { multiplyBignumbers } from "utils/formulas"

import { usePoolContract } from "hooks/usePool"
import {
  useERC20,
  useInvestProposalContract,
  usePriceFeedContract,
  useUserRegistryContract,
} from "hooks/useContract"
import { RiskyForm } from "interfaces/exchange"
import usePoolPrice from "hooks/usePoolPrice"
import useGasTracker from "state/gas/hooks"
import { useInvestProposal } from "hooks/useInvestmentProposals"
import { ZERO } from "constants/index"
import usePayload from "hooks/usePayload"
import useError from "hooks/useError"
import { SubmitState } from "constants/types"
import { parseEther } from "@ethersproject/units"
import { DATE_TIME_FORMAT } from "constants/time"
import { format } from "date-fns"

interface WithdrawInfo {
  tvl: {
    current: string
    max: string
  }
  avgPriceLP: {
    base: string
    usd: string
  }
  expirationDate: string
}

const useWithdrawInvestmentProposal = (
  poolAddress?: string,
  proposalId?: string
): [
  {
    info: WithdrawInfo
    form: RiskyForm
    gasPrice: string
    baseTokenPrice: BigNumber
  },
  {
    handlePercentageChange: (percentage: BigNumber) => void
    handleFromChange: (amount: string) => void
    handleSubmit: () => void
  }
] => {
  const { account } = useWeb3React()
  const [, getGasPrice] = useGasTracker()

  const [proposalBaseBalance, setProposalBaseBalance] = useState(ZERO)
  const [tokensPrice, setTokensPrice] = useState(ZERO)
  const [fromAmount, setFromAmount] = useState(ZERO)
  const [gasPrice, setGasPrice] = useState("0.00")
  const [baseTokenPrice, setBaseTokenPrice] = useState(ZERO)
  const [profileURL, setProfileURL] = useState<string | null>(null)
  const [userAvatar, setUserAvatar] = useState("")

  const [{ priceUSD, priceBase }] = usePoolPrice(poolAddress)
  const priceFeed = usePriceFeedContract()
  const [proposal, updateProposal] = useInvestProposal(poolAddress, proposalId)
  const [, poolInfo] = usePoolContract(poolAddress)
  const [, baseToken] = useERC20(poolInfo?.parameters.baseToken)
  const userRegistry = useUserRegistryContract()
  const [investProposalContract] = useInvestProposalContract(poolAddress)
  const [, setPayload] = usePayload()
  const [, setError] = useError()

  const addTransaction = useTransactionAdder()
  const [{ userMetadata }] = useUserMetadata(profileURL)

  const userIcon = <Avatar url={userAvatar} address={account} size={26} />

  const info = useMemo(() => {
    const expandedTimestampLimit = expandTimestamp(
      Number(proposal?.proposalInfo.proposalLimits.timestampLimit.toString())
    )
    return {
      tvl: {
        current: proposal
          ? normalizeBigNumber(
              multiplyBignumbers(
                [proposal.proposalInfo.lpLocked, 18],
                [priceBase, 18]
              )
            )
          : "-",
        max: proposal
          ? normalizeBigNumber(
              multiplyBignumbers(
                [proposal.proposalInfo.proposalLimits.investLPLimit, 18],
                [priceBase, 18]
              )
            )
          : "-",
      },
      avgPriceLP: {
        base: normalizeBigNumber(priceBase, 18, 2),
        usd: normalizeBigNumber(priceUSD, 18, 2),
      },
      expirationDate: proposal
        ? format(expandedTimestampLimit, DATE_TIME_FORMAT)
        : "-",
    }
  }, [proposal, priceBase, priceUSD])

  const form = useMemo(() => {
    return {
      from: {
        address: poolInfo?.parameters.baseToken,
        amount: fromAmount.toString(),
        balance: proposalBaseBalance,
        price: tokensPrice,
        symbol: baseToken?.symbol,
        decimals: baseToken?.decimals,
        icon: undefined,
      },
      to: {
        address: undefined,
        amount: fromAmount.toString(),
        balance: ZERO,
        price: tokensPrice,
        symbol: shortenAddress(account, 3),
        decimals: 18,
        icon: userIcon,
        info: {},
      },
    }
  }, [
    poolInfo,
    fromAmount,
    proposalBaseBalance,
    baseToken,
    tokensPrice,
    account,
    userIcon,
  ])

  const updateBaseTokenPrice = useCallback(async () => {
    if (!priceFeed || !poolInfo) return
    const priceUSD = await priceFeed.getNormalizedPriceOutUSD(
      poolInfo.parameters.baseToken,
      parseEther("1")
    )
    setBaseTokenPrice(priceUSD[0])
  }, [poolInfo, priceFeed])

  const runUpdate = useCallback(() => {
    updateBaseTokenPrice()
    updateProposal()
  }, [updateProposal, updateBaseTokenPrice])

  const estimateGas = useCallback(async () => {
    if (!investProposalContract || fromAmount.isZero()) return

    try {
      return await investProposalContract.estimateGas.withdraw(
        Number(proposalId) + 1,
        fromAmount
      )
    } catch {
      return
    }
  }, [fromAmount, investProposalContract, proposalId])

  const handleSubmit = useCallback(async () => {
    if (!investProposalContract || !baseToken) return

    try {
      setPayload(SubmitState.SIGN)
      const response = await investProposalContract.withdraw(
        Number(proposalId) + 1,
        fromAmount
      )

      setPayload(SubmitState.WAIT_CONFIRM)

      const receipt = await addTransaction(response, {
        type: TransactionType.INVEST_PROPOSAL_WITHDRAW,
        amountRaw: fromAmount.toString(),
        symbol: baseToken.symbol,
      })

      if (isTxMined(receipt)) {
        runUpdate()
        setPayload(SubmitState.SUCCESS)
      }
    } catch (error: any) {
      setPayload(SubmitState.IDLE)
      if (!!error && !!error.data && !!error.data.message) {
        setError(error.data.message)
      } else {
        const errorMessage = parseTransactionError(error.toString())
        !!errorMessage && setError(errorMessage)
      }
    } finally {
      setPayload(SubmitState.SUCCESS)
    }
  }, [
    investProposalContract,
    baseToken,
    setPayload,
    proposalId,
    fromAmount,
    addTransaction,
    runUpdate,
    setError,
  ])

  const handleFromChange = useCallback(
    async (v: string) => {
      if (!priceFeed || !poolInfo) return

      const amount = BigNumber.from(v)
      setFromAmount(amount)

      try {
        const priceUSD = await priceFeed.getNormalizedPriceOutUSD(
          poolInfo.parameters.baseToken,
          amount
        )
        setTokensPrice(priceUSD[0])
      } catch (e) {
        console.log(e)
      }
    },
    [poolInfo, priceFeed]
  )

  const handlePercentageChange = useCallback(
    (percent: BigNumber) => {
      const from = multiplyBignumbers([proposalBaseBalance, 18], [percent, 18])
      handleFromChange(from.toString())
    },
    [proposalBaseBalance, handleFromChange]
  )

  // update proposal base tokens balance
  useEffect(() => {
    if (!proposal) return

    setProposalBaseBalance(proposal.proposalInfo.newInvestedBase)
  }, [proposal])

  // interval updater
  useEffect(() => {
    const interval = setInterval(() => {
      runUpdate()
    }, Number(process.env.REACT_APP_UPDATE_INTERVAL))

    return () => clearInterval(interval)
  }, [runUpdate])

  // estimate gas price
  useEffect(() => {
    if (fromAmount.isZero()) return
    ;(async () => {
      const gasPrice = await estimateGas()

      if (!gasPrice) return

      const gas = getGasPrice(gasPrice.toNumber())
      setGasPrice(gas)
    })()
  }, [estimateGas, fromAmount, getGasPrice])

  // get user avatar link
  useEffect(() => {
    if (!userRegistry) return

    const getUserInfo = async () => {
      const userData = await userRegistry.userInfos(account)
      setProfileURL(userData.profileURL)
    }

    getUserInfo().catch((error) => {
      console.error(error)
    })
  }, [userRegistry, account])

  // set user avatar
  useEffect(() => {
    if (userMetadata !== null) {
      if ("assets" in userMetadata && userMetadata.assets.length) {
        setUserAvatar(userMetadata.assets[userMetadata.assets.length - 1])
      }
    }
  }, [userMetadata])

  return [
    {
      info,
      form,
      gasPrice,
      baseTokenPrice,
    },
    {
      handlePercentageChange,
      handleFromChange,
      handleSubmit,
    },
  ]
}

export default useWithdrawInvestmentProposal
