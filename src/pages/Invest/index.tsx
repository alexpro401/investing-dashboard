import { useMemo } from "react"
import { useParams } from "react-router-dom"
import { Center, Flex } from "theme"

import { ICON_NAMES } from "constants/icon-names"
import Token from "components/Token"
import SwapPrice from "components/SwapPrice"
import Header from "components/Header/Layout"
import IconButton from "components/IconButton"
import ExchangeDivider from "components/Exchange/Divider"
import CircularProgress from "components/CircularProgress"
import { AppButton } from "common"
import ExchangeInput from "components/Exchange/ExchangeInput"
import TransactionSlippage from "components/TransactionSlippage"

import { useUserAgreement } from "state/user/hooks"

import { createClient, Provider as GraphProvider } from "urql"
import { cutDecimalPlaces, fromBig, shortenAddress } from "utils"

import close from "assets/icons/close-big.svg"
import settings from "assets/icons/settings.svg"

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
  InfoDropdown,
} from "components/Exchange/styled"

import useInvest from "./useInvest"
import { GuardSpinner } from "react-spinners-kit"
import WithPoolAddressValidation from "components/WithPoolAddressValidation"

const poolsClient = createClient({
  url: process.env.REACT_APP_ALL_POOLS_API_URL || "",
})

const Invest = () => {
  const { poolAddress } = useParams<{
    poolAddress: string
  }>()

  const [
    { from, to },
    {
      info,
      allowance,
      isSlippageOpen,
      slippage,
      gasPrice,
      swapPrice,
      swapPriceUSD,
      direction,
      updateAllowance,
      setSlippageOpen,
      setSlippage,
      handleDirectionChange,
      handlePercentageChange,
      handleFromChange,
      handleSubmit,
    },
  ] = useInvest({
    poolAddress,
    initialDirection: "deposit",
  })

  const [{ agreed }, { setShowAgreement }] = useUserAgreement()

  const isAllowanceNeeded =
    direction === "deposit" && !!allowance && allowance.lt(from.amount)

  const button = useMemo(() => {
    if (from.amount === "0") {
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

    if (from.balance.lt(from.amount)) {
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

    if (isAllowanceNeeded) {
      return (
        <AppButton
          color="secondary"
          type="button"
          size="large"
          text={`Unlock Token ${from.symbol}`}
          style={{ fontWeight: 600 }}
          iconRight={ICON_NAMES.locked}
          iconSize={17}
          onClick={() => (agreed ? updateAllowance() : setShowAgreement(true))}
          full
        />
      )
    }

    return (
      <AppButton
        size="large"
        color={direction === "deposit" ? "primary" : "error"}
        text={
          direction === "deposit" ? `Buy ${to.symbol}` : `Sell ${from.symbol}`
        }
        onClick={handleSubmit}
        full
      />
    )
  }, [
    from,
    isAllowanceNeeded,
    direction,
    handleSubmit,
    to,
    agreed,
    updateAllowance,
    setShowAgreement,
  ])

  const freeLiquidity = useMemo(() => {
    if (!info.freeLiquidity.lp) return <InfoGrey>Loading</InfoGrey>

    if (typeof info.freeLiquidity.lp === "number")
      return <InfoGrey>Unlimited</InfoGrey>

    return (
      <Flex gap="4">
        <InfoWhite>
          {fromBig(cutDecimalPlaces(info.freeLiquidity.lp))} LP
        </InfoWhite>
        <InfoGrey>({fromBig(info.freeLiquidity.percent)}%)</InfoGrey>
      </Flex>
    )
  }, [info])

  const availableToInvest = useMemo(() => {
    if (!info.availableToInvest.amount) return <InfoGrey>Loading</InfoGrey>

    return (
      <Flex gap="4">
        <InfoWhite>
          {fromBig(cutDecimalPlaces(info.availableToInvest.amount))}
        </InfoWhite>
        <InfoGrey>{info.symbol}</InfoGrey>
      </Flex>
    )
  }, [info])

  const minInvestAmount = useMemo(() => {
    if (!info.minInvestAmount.amount) return <InfoGrey>Loading</InfoGrey>

    return (
      <Flex gap="4">
        <InfoWhite>
          {fromBig(cutDecimalPlaces(info.minInvestAmount.amount))}
        </InfoWhite>
        <InfoGrey>{info.symbol}</InfoGrey>
      </Flex>
    )
  }, [info])

  const totalPositionSize = useMemo(() => {
    return (
      <Flex gap="4">
        <InfoWhite>
          {fromBig(cutDecimalPlaces(info.fundPositions.total))}
        </InfoWhite>
        <InfoGrey>{info.symbol}</InfoGrey>
      </Flex>
    )
  }, [info])

  const positions = useMemo(() => {
    return info.fundPositions.positions.map((p) => (
      <Token key={p.address} data={p} />
    ))
  }, [info])

  const form = (
    <Card>
      <CardHeader>
        <Title active>Swap</Title>
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

      <ExchangeInput
        price={from.price}
        amount={from.amount}
        balance={from.balance}
        address={from.address}
        symbol={from.symbol}
        decimal={from.decimals}
        customIcon={from.icon}
        onChange={handleFromChange}
        isLocked={isAllowanceNeeded}
      />

      <ExchangeDivider
        changeAmount={handlePercentageChange}
        changeDirection={handleDirectionChange}
      />

      <ExchangeInput
        price={to.price}
        amount={to.amount}
        balance={to.balance}
        address={to.address}
        symbol={to.symbol}
        decimal={to.decimals}
        customIcon={to.icon}
      />

      <SwapPrice
        fromSymbol={from.symbol}
        toSymbol={to.symbol}
        tokensCost={swapPrice}
        usdCost={swapPriceUSD}
        gasPrice={gasPrice}
      />

      <Flex p="16px 0 0" full>
        {button}
      </Flex>

      <InfoCard gap="12">
        <InfoRow>
          <InfoGrey>Free Liquidity</InfoGrey>
          {freeLiquidity}
        </InfoRow>
        <InfoRow>
          <InfoGrey>Available to invest</InfoGrey>
          {availableToInvest}
        </InfoRow>
        <InfoRow>
          <InfoGrey>Min invest amount</InfoGrey>
          {minInvestAmount}
        </InfoRow>
        <InfoDropdown
          left={<InfoGrey>Total fund positions: </InfoGrey>}
          right={totalPositionSize}
        >
          {positions}
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
      <Header>{shortenAddress(poolAddress)}</Header>
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

const InvestWithProvider = () => {
  const { poolAddress } = useParams()
  return (
    <GraphProvider value={poolsClient}>
      <WithPoolAddressValidation
        poolAddress={poolAddress ?? ""}
        loader={
          <Center>
            <GuardSpinner size={20} loading />
          </Center>
        }
      >
        <Invest />
      </WithPoolAddressValidation>
    </GraphProvider>
  )
}

export default InvestWithProvider
