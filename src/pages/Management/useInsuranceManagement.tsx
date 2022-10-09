import { useState, useEffect, useCallback } from "react"
import { useSelector } from "react-redux"
import { useWeb3React } from "@web3-react/core"
import { Insurance, PriceFeed } from "abi"

import { useERC20 } from "hooks/useERC20"
import useContract from "hooks/useContract"
import {
  selectDexeAddress,
  selectInsuranceAddress,
  selectPriceFeedAddress,
} from "state/contracts/selectors"

import { divideBignumbers } from "utils/formulas"

import useError from "hooks/useError"
import usePayload from "hooks/usePayload"
import { parseEther } from "@ethersproject/units"

import { ZERO } from "constants/index"

import { useTransactionAdder } from "state/transactions/hooks"
import { TransactionType } from "state/transactions/types"

import { SubmitState, SwapDirection } from "constants/types"

import { getAllowance, parseTransactionError, isTxMined } from "utils"
import { BigNumber } from "@ethersproject/bignumber"

const useInsuranceManagement = () => {
  const { account, library } = useWeb3React()

  const [fromAmount, setFromAmount] = useState("0")
  const [toAmount, setToAmount] = useState("0")
  const [slippage, setSlippage] = useState("0.10")
  const [direction, setDirection] = useState<SwapDirection>("deposit")

  const [, setError] = useError()
  const [stakeAmount, setStakeAmount] = useState(ZERO)
  const [insuranceAmount, setInsuranceAmount] = useState(ZERO)
  const [insuranceAmountUSD, setInsuranceAmountUSD] = useState(ZERO)
  const [inPrice, setInPrice] = useState(ZERO)
  const [outPrice, setOutPrice] = useState(ZERO)
  const [allowance, setAllowance] = useState("-1")

  const [isSlippageOpen, setSlippageOpen] = useState(false)
  const [, setLoading] = usePayload()

  const priceFeedAddress = useSelector(selectPriceFeedAddress)
  const insuranceAddress = useSelector(selectInsuranceAddress)
  const dexeAddress = useSelector(selectDexeAddress)

  const priceFeed = useContract(priceFeedAddress, PriceFeed)
  const insurance = useContract(insuranceAddress, Insurance)

  const [fromToken, , fromBalance, refetchBalance] = useERC20(dexeAddress)

  const addTransaction = useTransactionAdder()

  const fetchAndUpdateAllowance = useCallback(async () => {
    const allowance = await getAllowance(
      account,
      dexeAddress,
      insuranceAddress,
      library
    )
    setAllowance(allowance.toString())
  }, [account, dexeAddress, insuranceAddress, library])

  const fetchInsuranceAmountInUSD = useCallback(async () => {
    if (!priceFeed || insuranceAmount.isZero()) return

    const price = await priceFeed.getNormalizedPriceOutUSD(
      dexeAddress,
      insuranceAmount
    )
    setInsuranceAmountUSD(price[0])
  }, [dexeAddress, insuranceAmount, priceFeed])

  const fetchInsuranceBalance = useCallback(async () => {
    if (!insurance) return

    const userInsurance = await insurance.getInsurance(account)
    setStakeAmount(userInsurance[0])
    setInsuranceAmount(userInsurance[1])
  }, [account, insurance])

  const handleSubmit = useCallback(() => {
    setLoading(SubmitState.SIGN)

    const handleBuy = async () => {
      const amount = BigNumber.from(fromAmount)
      const response = await insurance?.buyInsurance(amount)

      setLoading(SubmitState.WAIT_CONFIRM)
      const receipt = await addTransaction(response, {
        type: TransactionType.INSURANCE_STAKE,
        amount: fromAmount,
      })
      if (isTxMined(receipt)) {
        setLoading(SubmitState.SUCCESS)
        refetchBalance()
        await fetchInsuranceBalance()
      }
    }

    const handleSell = async () => {
      const amount = BigNumber.from(toAmount)
      const response = await insurance?.withdraw(amount)
      const receipt = await addTransaction(response, {
        type: TransactionType.INSURANCE_UNSTAKE,
        amount: toAmount,
      })
      if (isTxMined(receipt)) {
        setLoading(SubmitState.SUCCESS)
        refetchBalance()
        await fetchInsuranceBalance()
      }
    }

    ;(direction === "deposit" ? handleBuy() : handleSell()).catch((error) => {
      setLoading(SubmitState.IDLE)
      if (!!error && !!error.data && !!error.data.message) {
        setError(error.data.message)
      } else {
        const errorMessage = parseTransactionError(error.toString())
        !!errorMessage && setError(errorMessage)
      }
    })
  }, [
    addTransaction,
    direction,
    fetchInsuranceBalance,
    fromAmount,
    insurance,
    refetchBalance,
    setError,
    setLoading,
    toAmount,
  ])

  const approve = useCallback(() => {
    if (!dexeAddress || !insuranceAddress || !fromToken) return
    setLoading(SubmitState.SIGN)

    const approveToken = async () => {
      const amount = BigNumber.from(fromAmount)
      const approveResponse = await fromToken.approve(insuranceAddress, amount)
      setLoading(SubmitState.WAIT_CONFIRM)

      const receipt = await addTransaction(approveResponse, {
        type: TransactionType.APPROVAL,
        tokenAddress: dexeAddress,
        spender: account,
      })

      if (
        !!receipt &&
        isTxMined(receipt) &&
        receipt.logs &&
        receipt.logs.length
      ) {
        setLoading(SubmitState.SUCCESS)
        await fetchAndUpdateAllowance()
      }
    }

    approveToken().catch(() => {
      setLoading(SubmitState.IDLE)
    })
  }, [
    account,
    addTransaction,
    dexeAddress,
    fetchAndUpdateAllowance,
    fromAmount,
    fromToken,
    insuranceAddress,
    setLoading,
  ])

  const handleFromChange = useCallback(
    (v: string) => {
      setFromAmount(v)

      const fetchPrice = async () => {
        const amount = BigNumber.from(v)

        const price = await priceFeed?.getNormalizedPriceOutUSD(
          dexeAddress,
          amount
        )
        setInPrice(price[0])
      }

      fetchPrice().catch(console.error)
    },
    [dexeAddress, priceFeed]
  )

  const handleToChange = useCallback(
    (v: string) => {
      setToAmount(v)

      const fetchPrice = async () => {
        const amount = divideBignumbers(
          [BigNumber.from(v), 18],
          [parseEther("10"), 18]
        )

        const price = await priceFeed?.getNormalizedPriceOutUSD(
          dexeAddress,
          amount
        )
        setOutPrice(price[0])
      }

      fetchPrice().catch(console.error)
    },
    [dexeAddress, priceFeed]
  )

  const runUpdate = useCallback(async () => {
    fetchAndUpdateAllowance()
    fetchInsuranceBalance()
    refetchBalance()
  }, [fetchAndUpdateAllowance, fetchInsuranceBalance, refetchBalance])

  // update insurance amount in USD on insuranceAmount change
  useEffect(() => {
    fetchInsuranceAmountInUSD().catch(console.log)
  }, [fetchInsuranceAmountInUSD])

  // update insurance balance on account change
  useEffect(() => {
    if (!insurance || !account) return
    fetchInsuranceBalance().catch(console.log)
  }, [insurance, account, fetchInsuranceBalance])

  // update allowance
  useEffect(() => {
    if (!insuranceAddress || !dexeAddress || !account || !library) return

    fetchAndUpdateAllowance().catch(console.error)
  }, [insuranceAddress, dexeAddress, account, library, fetchAndUpdateAllowance])

  // global updater
  useEffect(() => {
    const interval = setInterval(() => {
      runUpdate()
    }, Number(process.env.REACT_APP_UPDATE_INTERVAL))

    return () => clearInterval(interval)
  }, [runUpdate])

  return {
    direction,
    setDirection,
    fromAmount,
    toAmount,
    allowance,
    approve,
    handleSubmit,
    inPrice,
    outPrice,
    handleFromChange,
    handleToChange,
    fromBalance,
    dexeAddress,
    insuranceAmount,
    stakeAmount,
    insuranceAmountUSD,
    slippage,
    setSlippage,
    isSlippageOpen,
    setSlippageOpen,
  }
}

export default useInsuranceManagement
