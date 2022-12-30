import { useState, useEffect, useCallback, useMemo } from "react"
import { BigNumber } from "@ethersproject/bignumber"
import { useWeb3React } from "@web3-react/core"

import { Token, DividendToken } from "interfaces"
import { IInvestProposalSupply } from "interfaces/thegraphs/invest-pools"

import { useTransactionAdder } from "state/transactions/hooks"
import { TransactionType } from "state/transactions/types"

import { usePoolContract } from "hooks/usePool"
import usePayload from "hooks/usePayload"
import useError from "hooks/useError"
import { useInvestProposal } from "hooks/useInvestmentProposals"
import usePoolPrice from "hooks/usePoolPrice"
import { useInvestProposalSupplies } from "hooks/useInvestProposalData"
import {
  useTraderPoolInvestProposalContract,
  usePriceFeedContract,
} from "contracts"

import { SubmitState } from "consts/types"
import { ZERO } from "consts"

import {
  getAllowance,
  getERC20Contract,
  getTokenBalance,
  getTokenData,
  isTxMined,
  normalizeBigNumber,
  parseTransactionError,
} from "utils"

import { multiplyBignumbers } from "utils/formulas"
import { useERC20Data } from "state/erc20/hooks"
import useProposalAddress from "hooks/useProposalAddress"

interface FetchedTokenData {
  balance: BigNumber
  allowance: BigNumber
  data: Token
}

interface PayDividendsInfo {
  tvl: {
    base: string
    usd: string
  }
  APR: {
    percent: string
    usd: string
  }
  ticker: string
}

const usePayDividends = (
  poolAddress?: string,
  proposalId?: string
): [
  {
    tokens: DividendToken[]
    info: PayDividendsInfo
    supplies?: IInvestProposalSupply[]
  },
  {
    updateAllowance: (address: string) => Promise<void>
    handleFromChange: (amount: string, index: number) => void
    handleDividendTokenSelect: (tokenAddress: string, index: number) => void
    handleSubmit: () => void
  }
] => {
  const { account, library } = useWeb3React()

  const [isBaseAdded, setIsBaseAdded] = useState(false)
  const [dividendTokens, setDividendTokens] = useState<string[]>([])
  const [dividendAmounts, setDividendAmounts] = useState<BigNumber[]>([])
  const [dividendBalances, setDividendBalances] = useState<BigNumber[]>([])
  const [dividendPrices, setDividendPrices] = useState<BigNumber[]>([])
  const [dividendAllowances, setDividendAllowances] = useState<BigNumber[]>([])
  const [dividendDatas, setDividendDatas] = useState<Token[]>([])

  const [, setPayload] = usePayload()
  const [, setError] = useError()
  const [, poolInfo] = usePoolContract(poolAddress)

  const priceFeed = usePriceFeedContract()

  const investProposal = useTraderPoolInvestProposalContract(poolAddress)
  const investProposalAddress = useProposalAddress(poolAddress)
  const [proposal, updateProposal] = useInvestProposal(poolAddress, proposalId)
  const [{ priceBase, priceUSD }, updatePoolPrice] = usePoolPrice(poolAddress)
  const [baseData] = useERC20Data(poolInfo?.parameters.baseToken)
  const [supplies, APR] = useInvestProposalSupplies(
    investProposalAddress,
    proposalId
  )

  const addTransaction = useTransactionAdder()

  // Memoized function that returns list of objects that represents dividend token
  // Object contains token address, token amount, token allowance
  const tokens = useMemo(() => {
    return dividendTokens.map((token, index) => {
      return {
        address: token,
        amount: dividendAmounts[index],
        balance: dividendBalances[index],
        price: dividendPrices[index],
        data: dividendDatas[index],
        allowance: dividendAllowances[index],
      }
    })
  }, [
    dividendTokens,
    dividendAmounts,
    dividendBalances,
    dividendPrices,
    dividendDatas,
    dividendAllowances,
  ])

  const info = useMemo(() => {
    const tvlUSD = multiplyBignumbers(
      [proposal?.proposalInfo.lpLocked || ZERO, 18],
      [priceUSD, 18]
    )
    const tvlBase = multiplyBignumbers(
      [proposal?.proposalInfo.lpLocked || ZERO, 18],
      [priceBase, 18]
    )

    const APR_USD = multiplyBignumbers(
      [BigNumber.from(APR || ZERO), 6],
      [tvlUSD, 18]
    )

    return {
      tvl: {
        base: proposal ? normalizeBigNumber(tvlBase) : "-",
        usd: proposal ? normalizeBigNumber(tvlUSD, 18, 2) : "-",
      },
      APR: {
        percent: APR ? normalizeBigNumber(APR, 4, 2) : "-",
        usd: proposal && APR ? normalizeBigNumber(APR_USD, 18, 2) : "-",
      },
      ticker: baseData?.symbol || "",
    }
  }, [proposal, priceBase, priceUSD, baseData, APR])

  const fetchTokenData = useCallback(
    async (address: string) => {
      const balance = await getTokenBalance(account, address, library)
      const allowance = await getAllowance(
        account,
        address,
        investProposalAddress,
        library
      )
      const data = await getTokenData(account, address, library)

      return { balance, allowance, data }
    },
    [account, library, investProposalAddress]
  )

  const addTokenToList = useCallback(
    ({ data, balance, allowance }: FetchedTokenData) => {
      if (dividendTokens.includes(data.address)) return
      setDividendTokens([...dividendTokens, data.address])
      setDividendAmounts([...dividendAmounts, ZERO])
      setDividendBalances([...dividendBalances, balance])
      setDividendPrices([...dividendPrices, ZERO])
      setDividendDatas([...dividendDatas, data])
      setDividendAllowances([...dividendAllowances, allowance])
    },
    [
      dividendPrices,
      dividendAllowances,
      dividendAmounts,
      dividendBalances,
      dividendDatas,
      dividendTokens,
    ]
  )

  const replaceTokenInList = useCallback(
    (index: number, { data, balance, allowance }: FetchedTokenData) => {
      const newTokens = [...dividendTokens]
      const newAmounts = [...dividendAmounts]
      const newBalances = [...dividendBalances]
      const newPrices = [...dividendPrices]
      const newDatas = [...dividendDatas]
      const newAllowances = [...dividendAllowances]

      newTokens[index] = data.address
      newAmounts[index] = ZERO
      newBalances[index] = balance
      newPrices[index] = ZERO
      newDatas[index] = data
      newAllowances[index] = allowance

      setDividendTokens(newTokens)
      setDividendAmounts(newAmounts)
      setDividendBalances(newBalances)
      setDividendPrices(newPrices)
      setDividendDatas(newDatas)
      setDividendAllowances(newAllowances)
    },
    [
      dividendAllowances,
      dividendAmounts,
      dividendBalances,
      dividendDatas,
      dividendPrices,
      dividendTokens,
    ]
  )

  const updateTokenInList = useCallback(
    (index: number, { data, balance, allowance }: FetchedTokenData) => {
      if (
        dividendTokens[index].toLocaleLowerCase() !==
        data.address.toLocaleLowerCase()
      )
        return

      setDividendBalances((prevBalances) => {
        const newBalances = [...prevBalances]
        newBalances[index] = balance
        return newBalances
      })
      setDividendAllowances((prevAllowances) => {
        const newAllowances = [...prevAllowances]
        newAllowances[index] = allowance

        return newAllowances
      })
    },
    [dividendTokens]
  )

  const updateTokens = useCallback(async () => {
    const tokensUpdate = await Promise.all(
      dividendTokens.map((token, index) => {
        return new Promise<[number, FetchedTokenData]>((resolve) => {
          fetchTokenData(token).then((data) => resolve([index, data]))
        })
      })
    )

    tokensUpdate.map((tokenData) => {
      updateTokenInList(tokenData[0], tokenData[1])
    })
  }, [dividendTokens, fetchTokenData, updateTokenInList])

  const updateDividendAmount = useCallback(
    (amount: BigNumber, index: number) => {
      setDividendAmounts([
        ...dividendAmounts.slice(0, index),
        amount,
        ...dividendAmounts.slice(index + 1),
      ])
    },
    [dividendAmounts]
  )

  const updateDividendPrice = useCallback(
    (price: BigNumber, index: number) => {
      setDividendPrices([
        ...dividendPrices.slice(0, index),
        price,
        ...dividendPrices.slice(index + 1),
      ])
    },
    [dividendPrices]
  )

  const updateDividendAllowance = useCallback(
    (allowance: BigNumber, index: number) => {
      setDividendAllowances([
        ...dividendAllowances.slice(0, index),
        allowance,
        ...dividendAllowances.slice(index + 1),
      ])
    },
    [dividendAllowances]
  )

  const fetchAndUpdateAllowance = useCallback(
    async (index: number) => {
      const address = dividendTokens[index]
      const allowance = await getAllowance(
        account,
        address,
        investProposalAddress,
        library
      )
      updateDividendAllowance(allowance, index)
    },
    [
      account,
      dividendTokens,
      library,
      investProposalAddress,
      updateDividendAllowance,
    ]
  )

  const updateAllowance = useCallback(
    async (address: string) => {
      const index = dividendTokens.indexOf(address)

      if (index === -1) return

      const dividendTokenContract = getERC20Contract(
        dividendTokens[index],
        library,
        account
      )

      if (!dividendTokenContract) return

      try {
        setPayload(SubmitState.SIGN)
        const amount = dividendAmounts[index]
        const approveResponse = await dividendTokenContract.approve(
          investProposalAddress,
          amount
        )

        setPayload(SubmitState.WAIT_CONFIRM)

        const receipt = await addTransaction(approveResponse, {
          type: TransactionType.APPROVAL,
          tokenAddress: dividendTokens[index],
          spender: account,
        })
        if (isTxMined(receipt)) {
          setPayload(SubmitState.SUCCESS)
          await fetchAndUpdateAllowance(index)
        }
      } catch (error) {
        setPayload(SubmitState.IDLE)
      } finally {
        setPayload(SubmitState.IDLE)
      }
    },
    [
      account,
      addTransaction,
      dividendAmounts,
      dividendTokens,
      library,
      investProposalAddress,
      setPayload,
      fetchAndUpdateAllowance,
    ]
  )

  const handleFromChange = useCallback(
    async (v: string, i: number) => {
      const amount = BigNumber.from(v)

      updateDividendAmount(amount, i)

      if (!priceFeed) return
      const priceResponse = await priceFeed.getNormalizedPriceOutUSD(
        dividendTokens[i],
        amount
      )
      updateDividendPrice(priceResponse[0], i)

      try {
      } catch (e) {
        console.log(e)
      }
    },
    [updateDividendAmount, priceFeed, dividendTokens, updateDividendPrice]
  )

  const handleDividendTokenSelect = useCallback(
    async (tokenAddress: string, index: number) => {
      const tokenData = await fetchTokenData(tokenAddress)

      if (dividendTokens.indexOf(tokenAddress) >= 0) return

      if (index >= 0) {
        replaceTokenInList(index, tokenData)
        return
      }

      addTokenToList(tokenData)
    },
    [addTokenToList, dividendTokens, fetchTokenData, replaceTokenInList]
  )

  const runUpdate = useCallback(() => {
    updateTokens().catch(console.log)
    updateProposal()
    updatePoolPrice()
  }, [updateTokens, updateProposal, updatePoolPrice])

  const handleSubmit = useCallback(async () => {
    if (!investProposal) return

    try {
      setPayload(SubmitState.SIGN)

      const transactionResponse = await investProposal.supply(
        Number(proposalId) + 1,
        dividendAmounts,
        dividendTokens
      )

      setPayload(SubmitState.WAIT_CONFIRM)

      const receipt = await addTransaction(transactionResponse, {
        type: TransactionType.INVEST_PROPOSAL_SUPPLY,
        amount: dividendTokens.length,
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
      setPayload(SubmitState.IDLE)
    }
  }, [
    addTransaction,
    dividendAmounts,
    dividendTokens,
    investProposal,
    proposalId,
    runUpdate,
    setError,
    setPayload,
  ])

  // add base token on init
  useEffect(() => {
    if (!poolInfo) return

    const base = poolInfo.parameters.baseToken.toLocaleLowerCase()

    if (dividendTokens.indexOf(base) > 0) return

    if (isBaseAdded) return

    fetchTokenData(base).then((token) => {
      addTokenToList(token)
      setIsBaseAdded(true)
    })
  }, [dividendTokens, fetchTokenData, addTokenToList, poolInfo, isBaseAdded])

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
      info,
      supplies,
    },
    {
      updateAllowance,
      handleFromChange,
      handleDividendTokenSelect,
      handleSubmit,
    },
  ]
}

export default usePayDividends
