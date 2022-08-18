import { Flex } from "theme"
import { useParams } from "react-router-dom"
import { createClient, Provider as GraphProvider } from "urql"

import IconButton from "components/IconButton"
import ExchangeInput from "components/Exchange/ExchangeInput"
import RiskyInvestInput from "components/Exchange/RiskyInvestInput"
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
  InfoDropdown,
  InfoWhite,
} from "components/Exchange/styled"

import useInvestRiskyProposal from "./useInvestRiskyProposal"
import { useMemo } from "react"
import SwapPrice from "components/SwapPrice"
import { normalizeBigNumber } from "utils"

const basicClient = createClient({
  url: process.env.REACT_APP_BASIC_POOLS_API_URL || "",
})

function InvestRiskyProposal() {
  const { poolAddress, proposalId } = useParams()
  const [
    {
      info,
      formWithDirection,
      isSlippageOpen,
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
      setSlippageOpen,
      setSlippage,
      handleFromChange,
      handleSubmit,
      handlePercentageChange,
    },
  ] = useInvestRiskyProposal(poolAddress, proposalId)

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

  const myPNL = useMemo(() => {
    return (
      <Flex gap="4">
        <InfoWhite>
          {normalizeBigNumber(info.investorPnlLP, 18, 4)}{" "}
          {direction === "deposit"
            ? formWithDirection.from.symbol
            : formWithDirection.to.symbol}
        </InfoWhite>
        <InfoGrey>({normalizeBigNumber(info.positionPnl, 18, 2)}%)</InfoGrey>
      </Flex>
    )
  }, [
    direction,
    formWithDirection.from.symbol,
    formWithDirection.to.symbol,
    info,
  ])

  const myPNLContent = useMemo(() => {
    return (
      <>
        <InfoRow>
          <InfoGrey>in USD</InfoGrey>
          <InfoGrey>
            {normalizeBigNumber(info.investorPnlUSD, 18, 2)} USD (
            {normalizeBigNumber(info.positionPnl, 18, 2)}%){" "}
          </InfoGrey>
        </InfoRow>
      </>
    )
  }, [info.investorPnlUSD, info.positionPnl])

  const averagePrice = useMemo(() => {
    if (direction === "deposit") {
      return (
        <InfoRow>
          <InfoGrey>Average buying price</InfoGrey>
          <Flex gap="4">
            <InfoWhite>{normalizeBigNumber(info.avgBuyingPrice)}</InfoWhite>
            <InfoGrey>
              {info.tokens.position?.symbol}/{info.tokens.base?.symbol}
            </InfoGrey>
          </Flex>
        </InfoRow>
      )
    }

    return (
      <InfoRow>
        <InfoGrey>Average selling price</InfoGrey>
        <Flex gap="4">
          <InfoWhite>{normalizeBigNumber(info.avgSellingPrice)}</InfoWhite>
          <InfoGrey>
            {info.tokens.position?.symbol}/{info.tokens.base?.symbol}
          </InfoGrey>
        </Flex>
      </InfoRow>
    )
  }, [direction, info])

  const form = (
    <Card>
      <CardHeader>
        <Flex>
          <Title active>Stake</Title>
        </Flex>
        <IconsGroup>
          <CircularProgress />
          <IconButton
            size={12}
            filled
            media={settings}
            onClick={() => setSlippageOpen(!isSlippageOpen)}
          />
          <IconButton size={10} filled media={close} onClick={() => {}} />
        </IconsGroup>
      </CardHeader>

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

      <SwapPrice
        fromSymbol={formWithDirection.from.symbol}
        toSymbol={formWithDirection.to.symbol}
        gasPrice={gasPrice}
        tokensCost={oneTokenCost}
        usdCost={usdTokenCost}
      />

      <Flex full p="16px 0 0">
        {button}
      </Flex>

      <InfoCard gap="12">
        {averagePrice}
        <InfoDropdown left={<InfoGrey>My P&L</InfoGrey>} right={myPNL}>
          {myPNLContent}
        </InfoDropdown>
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
      <Header>Invest risky proposal</Header>
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

const InvestRiskyProposalWithProvider = () => {
  return (
    <GraphProvider value={basicClient}>
      <InvestRiskyProposal />
    </GraphProvider>
  )
}

export default InvestRiskyProposalWithProvider
