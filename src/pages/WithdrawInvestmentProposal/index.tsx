import { useCallback, useMemo } from "react"
import { useParams } from "react-router-dom"
import { BigNumber } from "@ethersproject/bignumber"
import { createClient, Provider as GraphProvider } from "urql"

import { Flex } from "theme"
import SwapPrice from "components/SwapPrice"
import Header from "components/Header/Layout"
import IconButton from "components/IconButton"
import ExchangeDivider from "components/Exchange/Divider"
import CircularProgress from "components/CircularProgress"
import Button, { SecondaryButton } from "components/Button"
import ExchangeInput from "components/Exchange/ExchangeInput"

import { useUserAgreement } from "state/user/hooks"

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
  InfoDropdown,
  InfoWhite,
} from "components/Exchange/styled"

import useWithdrawInvestmentProposal from "./useWithdrawInvestmentProposal"

const investPoolsClient = createClient({
  url: process.env.REACT_APP_INVEST_POOLS_API_URL || "",
})

function WithdrawInvestmentProposal() {
  const { poolAddress, proposalId } = useParams()
  const [
    {
      info,
      form: { from, to },
      gasPrice,
      baseTokenPrice,
    },
    { handleFromChange, handleSubmit, handlePercentageChange },
  ] = useWithdrawInvestmentProposal(poolAddress, proposalId)

  const [{ agreed }, { setShowAgreement }] = useUserAgreement()

  const onSubmit = useCallback(() => {
    agreed ? handleSubmit() : setShowAgreement(true)
  }, [agreed, handleSubmit, setShowAgreement])

  const button = useMemo(() => {
    if (from.amount === "0") {
      return (
        <SecondaryButton
          theme="disabled"
          size="large"
          onClick={onSubmit}
          fz={22}
          full
        >
          Enter amount to swap
        </SecondaryButton>
      )
    }

    if (BigNumber.from(from.amount).gt(from.balance)) {
      return (
        <SecondaryButton
          theme="disabled"
          size="large"
          onClick={() => {}}
          fz={22}
          full
        >
          Inuficient funds
        </SecondaryButton>
      )
    }

    return (
      <Button size="large" theme="primary" onClick={onSubmit} fz={22} full>
        Confirm withdraw
      </Button>
    )
  }, [onSubmit, from.amount, from.balance])

  const lastWithdraw = useMemo(() => {
    return (
      <Flex gap="4">
        <InfoGrey>
          {info.withdrawals.length ? info.withdrawals[0].date : "-"}
        </InfoGrey>
      </Flex>
    )
  }, [info.withdrawals])

  const lastWithdrawContent = useMemo(() => {
    return (
      <>
        {info.withdrawals.map((withdraw) => (
          <InfoRow key={withdraw.id}>
            <InfoGrey>{withdraw.date}</InfoGrey>
            <Flex gap="4">
              <InfoWhite>{withdraw.amount}</InfoWhite>
              <InfoGrey>{from.symbol}</InfoGrey>
            </Flex>
          </InfoRow>
        ))}
      </>
    )
  }, [from.symbol, info.withdrawals])

  const fullness = useMemo(() => {
    return (
      <InfoRow>
        <InfoGrey>Fullness:</InfoGrey>
        <Flex gap="4">
          <InfoWhite>
            {info.tvl.current} {from.symbol}
          </InfoWhite>
          <InfoGrey>
            /{info.tvl.max} {from.symbol}
          </InfoGrey>
        </Flex>
      </InfoRow>
    )
  }, [from.symbol, info.tvl])

  const averageLpPrice = useMemo(() => {
    return (
      <InfoRow>
        <InfoGrey>Average LP price:</InfoGrey>
        <Flex gap="4">
          <InfoWhite>
            {info.avgPriceLP.base} {from.symbol} = {info.avgPriceLP.usd} USD
          </InfoWhite>
        </Flex>
      </InfoRow>
    )
  }, [from.symbol, info.avgPriceLP.base, info.avgPriceLP.usd])

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
          <Title active>Withdraw</Title>
        </Flex>
        <IconsGroup>
          <CircularProgress />
          <IconButton size={10} filled media={close} onClick={() => {}} />
        </IconsGroup>
      </CardHeader>

      <ExchangeInput
        price={from.price}
        amount={from.amount}
        balance={from.balance}
        address={from.address}
        symbol={from.symbol}
        customIcon={from.icon}
        decimal={from.decimals}
        onChange={handleFromChange}
      />

      <ExchangeDivider changeAmount={handlePercentageChange} />

      <ExchangeInput
        price={to.price}
        amount={to.amount}
        balance={to.balance}
        address={to.address}
        symbol={to.symbol}
        customIcon={to.icon}
        decimal={to.decimals}
        customBalance={<InfoGrey>My address wallet</InfoGrey>}
      />

      <SwapPrice
        gasPrice={gasPrice}
        toSymbol={from.symbol}
        fromSymbol="USD"
        tokensCost={baseTokenPrice}
      />

      <Flex full p="16px 0 0">
        {button}
      </Flex>

      <InfoCard gap="12">
        {fullness}
        {averageLpPrice}
        {expirationDate}
        <InfoDropdown
          left={<InfoGrey>Last withdraw</InfoGrey>}
          right={lastWithdraw}
        >
          {lastWithdrawContent}
        </InfoDropdown>
      </InfoCard>
    </Card>
  )

  return (
    <>
      <Header>Withdraw funds</Header>
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

const WithdrawInvestmentProposalWithProvider = () => {
  return (
    <GraphProvider value={investPoolsClient}>
      <WithdrawInvestmentProposal />
    </GraphProvider>
  )
}

export default WithdrawInvestmentProposalWithProvider
