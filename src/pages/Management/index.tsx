import { Flex } from "theme"
import { useMemo } from "react"
import { createClient, Provider as GraphProvider } from "urql"
import { BigNumber } from "@ethersproject/bignumber"

import { ICON_NAMES } from "constants/icon-names"
import ExchangeInput from "components/Exchange/ExchangeInput"
import { AppButton } from "common"
import TransactionSlippage from "components/TransactionSlippage"

import { formatBigNumber } from "utils"

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
    if (
      (direction === "deposit" && fromAmount === "0") ||
      (direction === "withdraw" && toAmount === "0")
    ) {
      return (
        <AppButton
          disabled
          size="large"
          color="secondary"
          onClick={handleSubmit}
          text="Enter amount to stake"
          full
        />
      )
    }

    if (direction === "deposit" && BigNumber.from(allowance).lt(fromAmount)) {
      return (
        <AppButton
          size="large"
          color="secondary"
          onClick={approve}
          text="Unlock DEXE"
          iconRight={ICON_NAMES.locked}
          full
        />
      )
    }

    return (
      <AppButton
        size="large"
        color={direction === "deposit" ? "primary" : "error"}
        text={direction === "deposit" ? `Stake DEXE` : `Unstake DEXE`}
        onClick={handleSubmit}
        full
      />
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
