import { useState, useEffect, useCallback, useMemo } from "react"
import { BigNumber } from "@ethersproject/bignumber"
import { useWeb3React } from "@web3-react/core"

import { useTransactionAdder } from "state/transactions/hooks"
import { TransactionType } from "state/transactions/types"
import { usePoolContract } from "hooks/usePool"
import {
  useInvestProposalContract,
  usePriceFeedContract,
} from "hooks/useContract"
import { Token, DividendToken } from "interfaces"
import { SubmitState } from "constants/types"
import usePayload from "hooks/usePayload"
import {
  getAllowance,
  getERC20Contract,
  getTokenBalance,
  getTokenData,
  isTxMined,
} from "utils"
import { ZERO } from "constants/index"

interface FetchedTokenData {
  balance: BigNumber
  allowance: BigNumber
  data: Token
}

const usePayDividends = (
  poolAddress?: string,
  proposalId?: string
): [
  {
    tokens: DividendToken[]
  },
  {
    updateAllowance: (address: string) => Promise<void>
    handleFromChange: (amount: string, index: number) => void
    handleDividendTokenSelect: (token: Token, index: number) => void
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
  const [, poolInfo] = usePoolContract(poolAddress)

  const priceFeed = usePriceFeedContract()

  const [investProposal, investProposalAddress] =
    useInvestProposalContract(poolAddress)
  console.log("investProposalAddress", investProposalAddress)
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

  const removeTokenFromList = useCallback(
    (tokenAddress: string) => {
      setDividendTokens(
        dividendTokens.filter((address) => address !== tokenAddress)
      )
      setDividendAmounts(
        dividendAmounts.filter(
          (amount, index) => index !== dividendTokens.indexOf(tokenAddress)
        )
      )
      setDividendAllowances(
        dividendAllowances.filter(
          (amount, index) => index !== dividendTokens.indexOf(tokenAddress)
        )
      )
      setDividendBalances(
        dividendBalances.filter(
          (amount, index) => index !== dividendTokens.indexOf(tokenAddress)
        )
      )
      setDividendDatas(
        dividendDatas.filter(
          (amount, index) => index !== dividendTokens.indexOf(tokenAddress)
        )
      )
      setDividendPrices(
        dividendPrices.filter(
          (amount, index) => index !== dividendTokens.indexOf(tokenAddress)
        )
      )
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

  const runUpdate = useCallback(() => {}, [])

  const handleSubmit = useCallback(async () => {
    if (!investProposal) return

    try {
      const response = await investProposal.supply(
        Number(proposalId) + 1,
        dividendAmounts,
        dividendTokens
      )
    } catch (error) {
      console.log(error)
    }
  }, [dividendAmounts, dividendTokens, investProposal, proposalId])

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
    async (token: Token, index: number) => {
      const tokenData = await fetchTokenData(token.address)

      if (dividendTokens.indexOf(token.address) >= 0) return

      if (index >= 0) {
        replaceTokenInList(index, tokenData)
        return
      }

      addTokenToList(tokenData)
    },
    [addTokenToList, dividendTokens, fetchTokenData, replaceTokenInList]
  )

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
