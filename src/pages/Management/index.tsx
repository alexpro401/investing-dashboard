import { Flex } from "theme"
import { useMemo } from "react"
import { BigNumber } from "@ethersproject/bignumber"

import { ICON_NAMES } from "consts/icon-names"
import ExchangeInput from "components/Exchange/ExchangeInput"
import { AppButton, Icon } from "common"
import TransactionSlippage from "components/TransactionSlippage"

import { formatBigNumber } from "utils"

import { Card, CardHeader, Title } from "components/Exchange/styled"
import useInsuranceManagement from "./useInsuranceManagement"
import * as S from "./styled"
import InfoAccordion, { Info } from "components/InfoAccordion"

function Management(props) {
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
            <S.InsuranceAmount>Unstake amount</S.InsuranceAmount>
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
            <S.InsuranceAmount>Insurance amount</S.InsuranceAmount>
            <Icon name={ICON_NAMES.insuranceMultiplier} />
          </Flex>
        )
      }
    />
  )

  const info: Info[] | undefined = useMemo(() => {
    return [
      {
        title: "Total Stake",
        value: `${formatBigNumber(stakeAmount, 18, 2)}`,
        tooltip: `Total amount of DEXE staked in the insurance pool`,
      },
      {
        title: "Insurance amount",
        value: `${formatBigNumber(insuranceAmount, 18, 2)}`,
        tooltip: `Total amount of DEXE insurance LP tokens`,
      },
      {
        title: "Insurance amount in USD",
        value: `${formatBigNumber(insuranceAmountUSD, 18, 2)}`,
        tooltip: `Total amount of DEXE insurance LP tokens in USD`,
      },
    ]
  }, [insuranceAmount, insuranceAmountUSD, stakeAmount])

  return (
    <Card {...props}>
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

      <InfoAccordion rows={info} />

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

export default Management
