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

function InvestInvestmentProposal() {
  const { poolAddress, proposalId } = useParams()
  const [
    { info, formData, isSlippageOpen, fromAmount, toAmount, slippage },
    {
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
  }, [formData.to.symbol, fromAmount, handleSubmit, toAmount])

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
