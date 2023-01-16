import { useMemo } from "react"
import { useParams } from "react-router-dom"

import { Center, Flex } from "theme"
import Header from "components/Header/Layout"
import IconButton from "components/IconButton"
import ExchangeDivider from "components/Exchange/Divider"
import CircularProgress from "components/CircularProgress"
import { AppButton } from "common"
import ExchangeInput from "components/Exchange/ExchangeInput"
import TransactionSlippage from "components/TransactionSlippage"

import close from "assets/icons/close-big.svg"

import {
  Container,
  Card,
  CardHeader,
  Title,
  IconsGroup,
  InfoCard,
  InfoRow,
  InfoGrey,
  InfoWhite,
} from "components/Exchange/styled"

import useInvestInvestmentProposal from "./useInvestInvestmentProposal"
import { GuardSpinner } from "react-spinners-kit"
import WithPoolAddressValidation from "components/WithPoolAddressValidation"
import { Exchange } from "components/Exchange"
import { Info } from "components/InfoAccordion"

function InvestInvestmentProposal() {
  const { poolAddress, proposalId } = useParams()
  const [
    { info, formData, fromAmount, toAmount, slippage },
    { setSlippage, handleFromChange, handleSubmit, handlePercentageChange },
  ] = useInvestInvestmentProposal(poolAddress, proposalId)

  const button = useMemo(() => {
    if (fromAmount.isZero() || toAmount.isZero()) {
      return (
        <AppButton
          disabled
          size="large"
          color="secondary"
          text="Enter amount to swap"
          onClick={() => {}}
          full
        />
      )
    }

    if (formData.from.balance.lt(formData.from.amount)) {
      return (
        <AppButton
          disabled
          size="large"
          color="secondary"
          full
          text="Insufficient balance"
        />
      )
    }

    return (
      <AppButton
        size="large"
        color="primary"
        onClick={handleSubmit}
        full
        text={`Stake ${formData.to.symbol}`}
      />
    )
  }, [
    formData.from.amount,
    formData.from.balance,
    formData.to.symbol,
    fromAmount,
    handleSubmit,
    toAmount,
  ])

  const cardInfo: Info[] = useMemo(() => {
    return [
      {
        title: "Proposal TVL",
        value: `${info.tvl.base} ${info.tvl.ticker} ($${info.tvl.usd})`,
        tooltip: "Total value locked in the proposal",
      },
      {
        title: "Fullness",
        value: `${info.fullness}%`,
        tooltip: "Percentage of the proposal that has been staked",
      },
      {
        title: "Average LP price",
        value: `1 ISDX = ${info.avgPriceLP} USD`,
        tooltip: "Average price of the LP token in USD",
      },
      {
        title: "Expiration date",
        value: info.expirationDate,
        tooltip: "Date when the proposal will expire",
      },
    ]
  }, [
    info.avgPriceLP,
    info.expirationDate,
    info.fullness,
    info.tvl.base,
    info.tvl.ticker,
    info.tvl.usd,
  ])

  const form = (
    <>
      <ExchangeInput
        price={formData.from.price}
        amount={formData.from.amount}
        balance={formData.from.balance}
        address={formData.from.address}
        symbol={formData.from.symbol}
        customIcon={formData.from.icon}
        decimal={formData.from.decimals}
        onChange={handleFromChange}
      />

      <ExchangeDivider changeAmount={handlePercentageChange} />

      <ExchangeInput
        price={formData.to.price}
        amount={formData.to.amount}
        balance={formData.to.balance}
        address={formData.to.address}
        symbol={formData.to.symbol}
        customIcon={formData.to.icon}
        decimal={formData.to.decimals}
      />
    </>
  )

  return (
    <>
      <Header>Invest investment proposal</Header>
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Exchange
          title="Stake LP2 tokens"
          buttons={[button]}
          form={form}
          slippage={slippage}
          setSlippage={setSlippage}
        />
      </Container>
    </>
  )
}

const InvestInvestmentProposalWithProvider = () => {
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
      <InvestInvestmentProposal />
    </WithPoolAddressValidation>
  )
}

export default InvestInvestmentProposalWithProvider
