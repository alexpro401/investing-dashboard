import { Center } from "theme"
import { useCallback, useMemo } from "react"
import { useParams } from "react-router-dom"
import { BigNumber } from "@ethersproject/bignumber"

import ExchangeInput from "components/Exchange/ExchangeInput"
import RiskyInvestInput from "components/Exchange/RiskyInvestInput"
import ExchangeDivider from "components/Exchange/Divider"
import { AppButton } from "common"
import Header from "components/Header/Layout"

import { Container, InfoRow, InfoGrey } from "components/Exchange/styled"

import { normalizeBigNumber } from "utils"
import SwapPrice from "components/SwapPrice"
import { useUserAgreement } from "state/user/hooks"
import useInvestRiskyProposal from "./useInvestRiskyProposal"
import WithPoolAddressValidation from "components/WithPoolAddressValidation"
import { GuardSpinner } from "react-spinners-kit"
import { Exchange } from "components/Exchange"
import { Info } from "components/InfoAccordion"

function InvestRiskyProposal() {
  const { poolAddress, proposalId } = useParams()
  const [
    {
      info,
      formWithDirection,
      oneTokenCost,
      usdTokenCost,
      gasPrice,
      fromAmount,
      toAmount,
      direction,
      slippage,
    },
    {
      setDirection,
      setSlippage,
      handleFromChange,
      handleSubmit,
      handlePercentageChange,
    },
  ] = useInvestRiskyProposal(poolAddress, proposalId)

  const [{ agreed }, { setShowAgreement }] = useUserAgreement()

  const onSubmit = useCallback(() => {
    agreed ? handleSubmit() : setShowAgreement(true)
  }, [agreed, handleSubmit, setShowAgreement])

  const button = useMemo(() => {
    if (fromAmount === "0" || toAmount === "0") {
      return (
        <AppButton
          disabled
          size="large"
          color="secondary"
          onClick={onSubmit}
          text="Enter amount to swap"
          full
        />
      )
    }

    if (
      BigNumber.from(formWithDirection.from.amount).gt(
        BigNumber.from(formWithDirection.from.balance)
      )
    ) {
      return (
        <AppButton
          disabled
          size="large"
          color="secondary"
          onClick={onSubmit}
          text="Inuficient balance"
          full
        />
      )
    }

    return (
      <AppButton
        size="large"
        color={direction === "deposit" ? "primary" : "error"}
        text={
          direction === "deposit"
            ? `Stake ${formWithDirection.to.symbol}`
            : `Unstake ${formWithDirection.from.symbol}`
        }
        onClick={onSubmit}
        full
      />
    )
  }, [
    direction,
    formWithDirection.from.symbol,
    formWithDirection.from.amount,
    formWithDirection.from.balance,
    formWithDirection.to.symbol,
    fromAmount,
    toAmount,
    onSubmit,
  ])

  const myPNL = useMemo(() => {
    return `${normalizeBigNumber(info.investorPnlLP, 18, 4)}
          ${
            direction === "deposit"
              ? formWithDirection.from.symbol
              : formWithDirection.to.symbol
          }
        (${normalizeBigNumber(info.positionPnl, 18, 2)}%)`
  }, [
    direction,
    formWithDirection.from.symbol,
    formWithDirection.to.symbol,
    info,
  ])

  const myPNLContent = useMemo(() => {
    return [
      <>
        <InfoRow>
          <InfoGrey>in USD</InfoGrey>
          <InfoGrey>
            {normalizeBigNumber(info.investorPnlUSD, 18, 2)} USD (
            {normalizeBigNumber(info.positionPnl, 18, 2)}%){" "}
          </InfoGrey>
        </InfoRow>
      </>,
    ]
  }, [info.investorPnlUSD, info.positionPnl])

  const averagePrice = useMemo(() => {
    if (direction === "deposit") {
      return `${normalizeBigNumber(info.avgBuyingPrice)} ${
        info.tokens.position?.symbol
      }/${info.tokens.base?.symbol}`
    }

    return `${normalizeBigNumber(info.avgSellingPrice)} ${
      info.tokens.position?.symbol
    }/${info.tokens.base?.symbol}`
  }, [direction, info])

  const form = (
    <>
      {direction === "deposit" ? (
        <ExchangeInput
          price={formWithDirection.from.price}
          amount={formWithDirection.from.amount}
          balance={formWithDirection.from.balance}
          address={formWithDirection.from.address}
          symbol={formWithDirection.from.symbol}
          customIcon={formWithDirection.from.icon}
          decimal={formWithDirection.from.decimals}
          onChange={handleFromChange}
        />
      ) : (
        <RiskyInvestInput
          price={formWithDirection.from.price}
          info={info}
          amount={formWithDirection.from.amount}
          address={formWithDirection.from.address}
          balance={formWithDirection.from.balance}
          symbol={formWithDirection.from.symbol}
          decimal={formWithDirection.from.decimals}
          customIcon={formWithDirection.from.icon}
          onChange={handleFromChange}
        />
      )}

      <ExchangeDivider
        changeAmount={handlePercentageChange}
        changeDirection={setDirection}
      />

      {direction === "deposit" ? (
        <RiskyInvestInput
          price={formWithDirection.to.price}
          info={info}
          amount={formWithDirection.to.amount}
          address={formWithDirection.to.address}
          balance={formWithDirection.to.balance}
          symbol={formWithDirection.to.symbol}
          decimal={formWithDirection.to.decimals}
          customIcon={formWithDirection.to.icon}
        />
      ) : (
        <ExchangeInput
          price={formWithDirection.to.price}
          amount={formWithDirection.to.amount}
          balance={formWithDirection.to.balance}
          address={formWithDirection.to.address}
          symbol={formWithDirection.to.symbol}
          customIcon={formWithDirection.to.icon}
          decimal={formWithDirection.to.decimals}
        />
      )}
    </>
  )

  const exchangeInfo: Info[] = useMemo(() => {
    return [
      {
        title:
          direction === "deposit"
            ? "Average buying price"
            : "Average selling price",
        value: averagePrice,
        tooltip: "Average price of the position",
      },
      {
        title: "My P&L",
        value: myPNL,
        tooltip: "Profit and loss of the position",
        childrens: myPNLContent,
      },
    ]
  }, [averagePrice, direction, myPNL, myPNLContent])

  return (
    <>
      <Header>Invest risky proposal</Header>
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Exchange
          title="Stake LP2 tokens"
          form={form}
          buttons={[button]}
          setSlippage={setSlippage}
          slippage={slippage}
          info={exchangeInfo}
        >
          <SwapPrice
            fromSymbol={formWithDirection.from.symbol}
            toSymbol={formWithDirection.to.symbol}
            gasPrice={gasPrice}
            tokensCost={oneTokenCost}
            usdCost={usdTokenCost}
          />
        </Exchange>
      </Container>
    </>
  )
}

const InvestRiskyProposalWithProvider = () => {
  const { poolAddress } = useParams()
  return (
    <WithPoolAddressValidation
      poolAddress={poolAddress ?? ""}
      loader={
        <Center>
          <GuardSpinner size={20} loading />
        </Center>
      }
    >
      <InvestRiskyProposal />
    </WithPoolAddressValidation>
  )
}

export default InvestRiskyProposalWithProvider
