import { useState, useEffect, useCallback, useMemo } from "react"
import { BigNumber } from "@ethersproject/bignumber"

import Icon from "components/Icon"

import { useTransactionAdder } from "state/transactions/hooks"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"

import { multiplyBignumbers } from "utils/formulas"

import { usePoolContract } from "hooks/usePool"
import { useERC20, useInvestProposalContract } from "hooks/useContract"
import { RiskyForm } from "interfaces/exchange"
import { Token, DividendToken } from "interfaces"
import { useWeb3React } from "@web3-react/core"
import { SubmitState } from "constants/types"
import usePayload from "hooks/usePayload"
import { TransactionType } from "state/transactions/types"
import { getAllowance, getTokenBalance, isTxMined } from "utils"
import { ZERO } from "constants/index"

const usePayDividends = (
  poolAddress?: string,
  proposalId?: string
): [
  {
    tokens: DividendToken[]
    form: RiskyForm
    allowance: BigNumber
  },
  {
    updateAllowance: () => Promise<void>
    handlePercentageChange: (percentage: BigNumber) => void
    handleFromChange: (amount: string) => void
    handleDividendTokenSelect: (token: Token) => void
    handleSubmit: () => void
  }
] => {
  const { account, library } = useWeb3React()
  const [dividendTokenAddress, setDividendTokenAddress] = useState("")
  const [toBalance, setToBalance] = useState(ZERO)
  const [fromBalance, setFromBalance] = useState(ZERO)
  const [inPrice, setInPrice] = useState(ZERO)
  const [outPrice, setOutPrice] = useState(ZERO)
  const [fromAmount, setFromAmount] = useState("0")
  const [toAmount, setToAmount] = useState("0")
  const [allowance, setAllowance] = useState(ZERO)

  const [dividendTokens, setDividendTokens] = useState<string[]>([])
  const [dividendAmounts, setDividendAmounts] = useState<BigNumber[]>([])
  const [dividendAllowance, setDividendAllowance] = useState<BigNumber[]>([])

  const [, setPayload] = usePayload()
  const [, poolInfo] = usePoolContract(poolAddress)
  const [dividendTokenContract, dividendToken] = useERC20(dividendTokenAddress)
  const [{ poolMetadata }] = usePoolMetadata(
    poolAddress,
    poolInfo?.parameters.descriptionURL
  )

  const [investProposal] = useInvestProposalContract(poolAddress)

  const addTransaction = useTransactionAdder()

  const form = useMemo(() => {
    return {
      from: {
        address: dividendToken?.address,
        amount: fromAmount,
        balance: fromBalance,
        price: inPrice,
        symbol: dividendToken?.symbol,
        decimals: dividendToken?.decimals,
        icon: undefined,
      },
      to: {
        address: undefined,
        amount: toAmount,
        balance: toBalance,
        price: outPrice,
        symbol: "1/JBR",
        decimals: 18,
        icon: (
          <Icon
            size={24}
            source={poolMetadata?.assets[poolMetadata?.assets.length - 1]}
            address={poolAddress}
          />
        ),
        info: {},
      },
    }
  }, [
    poolAddress,
    dividendToken,
    fromAmount,
    fromBalance,
    inPrice,
    toAmount,
    toBalance,
    outPrice,
    poolMetadata,
  ])

  // Memoized function that returns list of objects that represents dividend token
  // Object contains token address, token amount, token allowance
  const tokens = useMemo(() => {
    return dividendTokens.map((token, index) => {
      return {
        address: token,
        amount: dividendAmounts[index],
        allowance: dividendAllowance[index],
      }
    })
  }, [dividendTokens, dividendAmounts, dividendAllowance])

  const handleDividendTokenSelect = useCallback(
    (token: Token) => {
      if (dividendTokens.indexOf(token.address) === -1) {
        setDividendTokens([...dividendTokens, token.address])
        setDividendAmounts([...dividendAmounts, ZERO])
        setDividendAllowance([...dividendAllowance, ZERO])
      } else {
        setDividendTokens(
          dividendTokens.filter((address) => address !== token.address)
        )
        setDividendAmounts(
          dividendAmounts.filter(
            (amount, index) => index !== dividendTokens.indexOf(token.address)
          )
        )
        setDividendAllowance(
          dividendAllowance.filter(
            (amount, index) => index !== dividendTokens.indexOf(token.address)
          )
        )
      }
    },
    [dividendAllowance, dividendAmounts, dividendTokens]
  )

  const fetchAndUpdateAllowance = useCallback(async () => {
    if (!account || !library || !poolAddress || !poolInfo) return

    const allowance = await getAllowance(
      account,
      poolInfo?.parameters.baseToken,
      poolAddress,
      library
    )
    setAllowance(allowance)
  }, [account, library, poolAddress, poolInfo])

  const updateAllowance = useCallback(async () => {
    if (!account || !poolAddress || !dividendTokenContract) return

    try {
      setPayload(SubmitState.SIGN)

      const amount = BigNumber.from(fromAmount)
      const approveResponse = await dividendTokenContract.approve(
        poolAddress,
        amount
      )
      setPayload(SubmitState.WAIT_CONFIRM)

      const receipt = await addTransaction(approveResponse, {
        type: TransactionType.APPROVAL,
        tokenAddress: dividendTokenAddress,
        spender: account,
      })

      if (isTxMined(receipt)) {
        fetchAndUpdateAllowance()
        setPayload(SubmitState.SUCCESS)
      }
    } catch (e) {
      setPayload(SubmitState.IDLE)
    }
  }, [
    account,
    addTransaction,
    dividendTokenAddress,
    dividendTokenContract,
    fetchAndUpdateAllowance,
    fromAmount,
    poolAddress,
    setPayload,
  ])

  const runUpdate = useCallback(() => {
    fetchAndUpdateAllowance().catch(console.log)
  }, [fetchAndUpdateAllowance])

  const handleSubmit = useCallback(async () => {
    if (!investProposal || !dividendTokenAddress) return

    const response = await investProposal.supply(
      Number(proposalId) + 1,
      [fromAmount],
      [dividendTokenAddress]
    )
    console.log(response)
  }, [dividendTokenAddress, fromAmount, investProposal, proposalId])

  const handleFromChange = useCallback(async (v: string) => {
    setFromAmount(v)
    const amount = BigNumber.from(v)

    try {
    } catch (e) {
      console.log(e)
    }
  }, [])

  const handlePercentageChange = useCallback(
    (percent: BigNumber) => {
      const from = multiplyBignumbers([fromBalance, 18], [percent, 18])
      handleFromChange(from.toString())
    },
    [fromBalance, handleFromChange]
  )

  useEffect(() => {
    if (!poolInfo) return

    const base = poolInfo.parameters.baseToken
    setDividendTokenAddress(base)
    ;(async () => {
      const allowance = await getAllowance(
        account,
        poolInfo?.parameters.baseToken,
        poolAddress,
        library
      )
      const balance = await getTokenBalance(account, base, library)

      setDividendTokens([base])
      setDividendAmounts([balance])
      setDividendAllowance([allowance])
    })()
  }, [account, library, poolAddress, poolInfo])

  // init data
  useEffect(() => {
    runUpdate()
  }, [runUpdate])

  // update with interval
  useEffect(() => {
    const interval = setInterval(() => {
      runUpdate()
    }, Number(process.env.REACT_APP_UPDATE_INTERVAL))

    return () => clearInterval(interval)
  }, [runUpdate])

  return [
    {
      tokens,
      form,
      allowance,
    },
    {
      updateAllowance,
      handlePercentageChange,
      handleFromChange,
      handleDividendTokenSelect,
      handleSubmit,
    },
  ]
}

export default usePayDividends
