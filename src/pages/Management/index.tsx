import { Flex } from "theme"
import { useState, useEffect, useCallback } from "react"
import { createClient, Provider as GraphProvider } from "urql"
import { useSelector } from "react-redux"
import { useWeb3React } from "@web3-react/core"
import { BigNumber } from "@ethersproject/bignumber"
import { Insurance, PriceFeed } from "abi"

import ExchangeInput from "components/Exchange/ExchangeInput"
import ExchangeDivider from "components/Exchange/Divider"
import Button, { SecondaryButton } from "components/Button"
import TransactionSlippage from "components/TransactionSlippage"

import { useERC20 } from "hooks/useERC20"
import useContract from "hooks/useContract"
import {
  selectDexeAddress,
  selectInsuranceAddress,
  selectPriceFeedAddress,
} from "state/contracts/selectors"

import { multiplyBignumbers } from "utils/formulas"
import {
  formatBigNumber,
  getAllowance,
  parseTransactionError,
  isTxMined,
} from "utils"

import { useTransactionAdder } from "state/transactions/hooks"
import { TransactionType } from "state/transactions/types"

import LockedIcon from "assets/icons/LockedIcon"
import multiplier from "assets/icons/10x-staking.svg"

import { Card, CardHeader, Title } from "components/Exchange/styled"
import { SubmitState, SwapDirection } from "constants/types"
import {
  Container,
  PriceCard,
  Row,
  Label,
  Amount,
  InsuranceAmount,
  MultiplierIcon,
} from "./styled"
import useError from "hooks/useError"
import usePayload from "hooks/usePayload"

const poolsClient = createClient({
  url: process.env.REACT_APP_ALL_POOLS_API_URL || "",
})

export const useInsurance = (): [
  {
    fromAmount: string
    toAmount: string
    slippage: string
    fromAddress: string
    toAddress: string
    toSelectorOpened: boolean
    fromSelectorOpened: boolean
    pending: boolean
    direction: SwapDirection
  },
  {
    setFromAmount: (amount: string) => void
    setToAmount: (amount: string) => void
    setToAddress: (address: string) => void
    setFromAddress: (address: string) => void
    setDirection: (d?: SwapDirection) => void
    setPercentage: (v: number) => void
    setToSelector: (state: boolean) => void
    setFromSelector: (state: boolean) => void
    setSlippage: (slippage: string) => void
  }
] => {
  const { library } = useWeb3React()

  const [fromAmount, setFromAmount] = useState("0")
  const [toAmount, setToAmount] = useState("0")
  const [slippage, setSlippage] = useState("0.10")
  const [hash, setHash] = useState("")
  const [pending, setPending] = useState(false)
  const [toSelectorOpened, setToSelector] = useState(false)
  const [fromSelectorOpened, setFromSelector] = useState(false)
  const [direction, setDirection] = useState<SwapDirection>("deposit")

  const [toAddress, setToAddress] = useState("")
  const [fromAddress, setFromAddress] = useState("")

  useEffect(() => {
    if (!hash || !library) return
    ;(async () => {
      try {
        await library.waitForTransaction(hash)

        setPending(false)
        setHash("")
      } catch (e) {
        console.log(e)
      }
    })()
  }, [hash, library])

  const setFromAmountCallback = useCallback(
    (amount: string): void => setFromAmount(amount),
    []
  )

  const setToAmountCallback = useCallback(
    (amount: string): void => setToAmount(amount),
    []
  )

  const setSlippageCallback = useCallback(
    (slippage: string): void => setSlippage(slippage),
    []
  )

  const setToAddressCallback = useCallback(
    (address: string): void => setToAddress(address),
    []
  )

  const setFromAddressCallback = useCallback(
    (address: string): void => setFromAddress(address),
    []
  )

  const setToSelectorCallback = useCallback(
    (v: boolean): void => setToSelector(v),
    []
  )

  const setFromSelectorCallback = useCallback(
    (v: boolean): void => setFromSelector(v),
    []
  )

  const handleDirectionChange = useCallback(
    (d?: SwapDirection) => {
      if (d !== undefined) {
        setDirection(d)
        return
      }
      if (direction === "deposit") {
        setDirection("withdraw")
      } else {
        setDirection("deposit")
      }
    },
    [direction]
  )

  const handlePercentageChange = useCallback((v: number) => {
    // TODO: decide how to know balance
    console.log(v)
  }, [])

  return [
    {
      fromAmount,
      toAmount,
      fromAddress,
      toAddress,
      toSelectorOpened,
      fromSelectorOpened,
      direction,
      pending,
      slippage,
    },
    {
      setFromAmount: setFromAmountCallback,
      setToAmount: setToAmountCallback,
      setToAddress: setToAddressCallback,
      setFromAddress: setFromAddressCallback,
      setDirection: handleDirectionChange,
      setPercentage: handlePercentageChange,
      setToSelector: setToSelectorCallback,
      setFromSelector: setFromSelectorCallback,
      setSlippage: setSlippageCallback,
    },
  ]
}

function Management() {
  const { account, library } = useWeb3React()
  const [
    { fromAmount, toAmount, direction, slippage },
    { setFromAmount, setToAmount, setDirection, setSlippage },
  ] = useInsurance()

  const [, setError] = useError()
  const [stakeAmount, setStakeAmount] = useState(BigNumber.from("0"))
  const [insuranceAmount, setInsuranceAmount] = useState(BigNumber.from("0"))
  const [insuranceAmountUSD, setInsuranceAmountUSD] = useState(
    BigNumber.from("0")
  )
  const [inPrice, setInPrice] = useState(BigNumber.from("0"))
  const [outPrice, setOutPrice] = useState(BigNumber.from("0"))
  const [allowance, setAllowance] = useState("-1")

  const [isSlippageOpen, setSlippageOpen] = useState(false)
  const [, setLoading] = usePayload()

  const priceFeedAddress = useSelector(selectPriceFeedAddress)
  const insuranceAddress = useSelector(selectInsuranceAddress)
  const dexeAddress = useSelector(selectDexeAddress)

  const priceFeed = useContract(priceFeedAddress, PriceFeed)
  const insurance = useContract(insuranceAddress, Insurance)

  const [fromToken, fromData, fromBalance, refetchBalance] =
    useERC20(dexeAddress)

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
    const price = await priceFeed?.getNormalizedPriceOutUSD(
      dexeAddress,
      insuranceAmount
    )

    setInsuranceAmountUSD(price[0])
  }, [dexeAddress, insuranceAmount, priceFeed])

  const fetchInsuranceBalance = useCallback(async () => {
    const userInsurance = await insurance?.getInsurance(account)
    setStakeAmount(userInsurance[0])
    setInsuranceAmount(userInsurance[1])
    await fetchInsuranceAmountInUSD()
  }, [account, insurance, fetchInsuranceAmountInUSD])

  useEffect(() => {
    if (!insurance || !account) return

    fetchInsuranceBalance().catch(console.log)
  }, [insurance, account, fetchInsuranceBalance])

  // update allowance
  useEffect(() => {
    if (!insuranceAddress || !dexeAddress || !account || !library) return

    fetchAndUpdateAllowance().catch(console.error)
  }, [insuranceAddress, dexeAddress, account, library, fetchAndUpdateAllowance])

  const handleSubmit = () => {
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
  }

  const approve = () => {
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
  }

  const handlePercentageChange = (percent: BigNumber) => {
    if (!fromData) return

    const from = multiplyBignumbers(
      [fromBalance, fromData.decimals],
      [percent, 18]
    )
    handleFromChange(from.toString())
  }

  const handleFromChange = (v: string) => {
    setFromAmount(v)

    const fetchAndUpdateTo = async () => {
      const amount = BigNumber.from(v)

      const outAmount = await insurance?.getReceivedInsurance(amount)

      const price = await priceFeed?.getNormalizedPriceOutUSD(
        dexeAddress,
        amount
      )
      setToAmount(outAmount)
      setInPrice(price[0])
      setOutPrice(price[0].mul(BigNumber.from("10")))
    }

    fetchAndUpdateTo().catch(console.error)
  }

  const handleToChange = (v: string) => {
    setToAmount(v)

    const amount = BigNumber.from(v)
    setFromAmount(amount.div(BigNumber.from("10")).toString())
  }

  const getButton = () => {
    if (fromAmount === "0" || toAmount === "0") {
      return (
        <SecondaryButton
          theme="disabled"
          size="large"
          onClick={handleSubmit}
          fz={22}
          full
        >
          Enter amount to stake
        </SecondaryButton>
      )
    }

    if (direction === "deposit" && BigNumber.from(allowance).lt(fromAmount)) {
      return (
        <SecondaryButton size="large" onClick={approve} fz={22} full>
          <Flex>
            Unlock DEXE <LockedIcon />
          </Flex>
        </SecondaryButton>
      )
    }

    return (
      <Button
        size="large"
        theme={direction === "deposit" ? "primary" : "warn"}
        onClick={handleSubmit}
        fz={22}
        full
      >
        {direction === "deposit" ? `Stake DEXE` : `Unstake DEXE`}
      </Button>
    )
  }

  const button = getButton()

  const from = (
    <ExchangeInput
      price={inPrice}
      amount={fromAmount}
      balance={fromBalance}
      address={dexeAddress}
      symbol="DEXE"
      decimal={18}
      onChange={handleFromChange}
      customPrice={
        direction === "withdraw" && (
          <Flex>
            <InsuranceAmount>Unstake amount</InsuranceAmount>
          </Flex>
        )
      }
    />
  )

  const to = (
    <ExchangeInput
      price={outPrice}
      amount={toAmount}
      balance={insuranceAmount}
      address={dexeAddress}
      symbol="LP DEXE"
      decimal={18}
      onChange={handleToChange}
      customPrice={
        direction === "deposit" && (
          <Flex>
            <InsuranceAmount>Insurance amount</InsuranceAmount>
            <MultiplierIcon src={multiplier} />
          </Flex>
        )
      }
    />
  )

  const form = (
    <Card>
      <CardHeader>
        <Flex>
          <Title
            active={direction === "deposit"}
            onClick={() => setDirection("deposit")}
          >
            Stake
          </Title>
          <Title
            active={direction === "withdraw"}
            onClick={() => setDirection("withdraw")}
          >
            Unstake
          </Title>
        </Flex>
      </CardHeader>

      {direction === "deposit" ? from : to}

      <ExchangeDivider
        changeAmount={handlePercentageChange}
        changeDirection={setDirection}
      />

      {direction === "deposit" ? to : from}

      <PriceCard>
        <Row>
          <Label>Total Stake:</Label>
          <Flex>
            <Amount>{formatBigNumber(stakeAmount, 18, 2)}</Amount>
            <Label>DEXE</Label>
          </Flex>
        </Row>
        <Row>
          <Label>Insurance amount:</Label>
          <Flex>
            <Amount>{formatBigNumber(insuranceAmount, 18, 2)}</Amount>
            <Label>DEXE</Label>
          </Flex>
        </Row>
        <Row>
          <Label>Insurance amount in USD:</Label>
          <Flex>
            <Amount>{formatBigNumber(insuranceAmountUSD, 18, 2)}</Amount>
            <Label>USD</Label>
          </Flex>
        </Row>
      </PriceCard>

      {button}

      <TransactionSlippage
        slippage={slippage}
        onChange={setSlippage}
        isOpen={isSlippageOpen}
        toggle={(v) => setSlippageOpen(v)}
      />
    </Card>
  )

  return (
    <>
      <Container>{form}</Container>
    </>
  )
}

export default function ManagementWithProvider() {
  return (
    <GraphProvider value={poolsClient}>
      <Management />
    </GraphProvider>
  )
}
