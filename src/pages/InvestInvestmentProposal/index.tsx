import { Flex } from "theme"
import { useParams } from "react-router-dom"
import { createClient, Provider as GraphProvider } from "urql"

import IconButton from "components/IconButton"
import ExchangeInput from "components/Exchange/ExchangeInput"
import ExchangeDivider from "components/Exchange/Divider"
import Button, { SecondaryButton } from "components/Button"
import CircularProgress from "components/CircularProgress"
import TransactionSlippage from "components/TransactionSlippage"
import Header from "components/Header/Layout"

import settings from "assets/icons/settings.svg"
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
import { useMemo } from "react"

const poolsClient = createClient({
  url: process.env.REACT_APP_ALL_POOLS_API_URL || "",
})

function InvestInvestmentProposal() {
  const { poolAddress, proposalId } = useParams()
  const [
    {
      info,
      formWithDirection,
      isSlippageOpen,
      fromAmount,
      toAmount,
      direction,
      slippage,
    },
    {
      setDirection,
      setSlippageOpen,
      setSlippage,
      handleFromChange,
      handleSubmit,
      handlePercentageChange,
    },
  ] = useInvestInvestmentProposal(poolAddress, proposalId)

  const button = useMemo(() => {
    if (fromAmount.isZero() || toAmount.isZero()) {
      return (
        <SecondaryButton
          theme="disabled"
          size="large"
          onClick={handleSubmit}
          fz={22}
          full
        >
          Enter amount to swap
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
        {direction === "deposit"
          ? `Stake ${formWithDirection.to.symbol}`
          : `Unstake ${formWithDirection.from.symbol}`}
      </Button>
    )
  }, [
    direction,
    formWithDirection.from.symbol,
    formWithDirection.to.symbol,
    fromAmount,
    handleSubmit,
    toAmount,
  ])

  const proposalTVL = useMemo(() => {
    return (
      <InfoRow>
        <InfoGrey>Proposal TVL:</InfoGrey>
        <Flex gap="4">
          <InfoWhite>
            {info.tvl.base} {info.tvl.ticker}
          </InfoWhite>
          <InfoGrey>(${info.tvl.usd})</InfoGrey>
        </Flex>
      </InfoRow>
    )
  }, [info.tvl.base, info.tvl.ticker, info.tvl.usd])

  const fullness = useMemo(() => {
    return (
      <InfoRow>
        <InfoGrey>Fullness:</InfoGrey>
        <Flex gap="4">
          <InfoWhite>{info.fullness}%</InfoWhite>
        </Flex>
      </InfoRow>
    )
  }, [info.fullness])

  const averagePrice = useMemo(() => {
    return (
      <InfoRow>
        <InfoGrey>Average LP price:</InfoGrey>
        <Flex gap="4">
          <InfoWhite>1 ISDX = {info.avgPriceLP} USD</InfoWhite>
        </Flex>
      </InfoRow>
    )
  }, [info.avgPriceLP])

  const expirationDate = useMemo(() => {
    return (
      <InfoRow>
        <InfoGrey>Expiration date:</InfoGrey>
        <Flex gap="4">
          <InfoWhite>{info.expirationDate}</InfoWhite>
        </Flex>
      </InfoRow>
    )
  }, [info.expirationDate])

  const form = (
    <Card>
      <CardHeader>
        <Flex>
          <Title active>Stake</Title>
        </Flex>
        <IconsGroup>
          <CircularProgress />
          <IconButton size={10} filled media={close} onClick={() => {}} />
        </IconsGroup>
      </CardHeader>

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

      <ExchangeDivider
        changeAmount={handlePercentageChange}
        changeDirection={setDirection}
      />

      <ExchangeInput
        price={formWithDirection.to.price}
        amount={formWithDirection.to.amount}
        balance={formWithDirection.to.balance}
        address={formWithDirection.to.address}
        symbol={formWithDirection.to.symbol}
        customIcon={formWithDirection.to.icon}
        decimal={formWithDirection.to.decimals}
      />

      <Flex full p="16px 0 0">
        {button}
      </Flex>

      <InfoCard gap="12">
        {proposalTVL}
        {fullness}
        {averagePrice}
        {expirationDate}
      </InfoCard>

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
      <Header>Invest investment proposal</Header>
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {form}
      </Container>
    </>
  )
}

const InvestInvestmentProposalWithProvider = () => {
  return (
    <GraphProvider value={poolsClient}>
      <InvestInvestmentProposal />
    </GraphProvider>
  )
}

export default InvestInvestmentProposalWithProvider
