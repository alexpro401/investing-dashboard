import { Flex } from "theme"
import { useMemo } from "react"
import { createClient, Provider as GraphProvider } from "urql"
import { BigNumber } from "@ethersproject/bignumber"

import ExchangeInput from "components/Exchange/ExchangeInput"
import Button, { SecondaryButton } from "components/Button"
import TransactionSlippage from "components/TransactionSlippage"

import { formatBigNumber } from "utils"

import LockedIcon from "assets/icons/LockedIcon"
import multiplier from "assets/icons/10x-staking.svg"

import { Card, CardHeader, Title } from "components/Exchange/styled"
import useInsuranceManagement from "./useInsuranceManagement"
import {
  PriceCard,
  Row,
  Label,
  Amount,
  InsuranceAmount,
  MultiplierIcon,
} from "./styled"

const poolsClient = createClient({
  url: process.env.REACT_APP_ALL_POOLS_API_URL || "",
})

function Management() {
  const {
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
  } = useInsuranceManagement()

  const button = useMemo(() => {
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
  }, [allowance, approve, direction, fromAmount, handleSubmit, toAmount])

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

  return (
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
}

export default function ManagementWithProvider() {
  return (
    <GraphProvider value={poolsClient}>
      <Management />
    </GraphProvider>
  )
}
