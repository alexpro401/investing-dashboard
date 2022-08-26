import { useCallback, useMemo } from "react"
import { useParams } from "react-router-dom"

import { Flex } from "theme"
import Token from "components/Token"
import Payload from "components/Payload"
import SwapPrice from "components/SwapPrice"
import Header from "components/Header/Layout"
import IconButton from "components/IconButton"
import TransactionError from "modals/TransactionError"
import ExchangeDivider from "components/Exchange/Divider"
import CircularProgress from "components/CircularProgress"
import Button, { SecondaryButton } from "components/Button"
import ExchangeInput from "components/Exchange/ExchangeInput"
import TransactionSlippage from "components/TransactionSlippage"


import { createClient, Provider as GraphProvider } from "urql"
import { cutDecimalPlaces, fromBig, shortenAddress } from "utils"

import close from "assets/icons/close-big.svg"
import settings from "assets/icons/settings.svg"
import LockedIcon from "assets/icons/LockedIcon"

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
import { useUserAgreement } from "state/user/hooks"

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
      isWalletPrompting,
      isSlippageOpen,
      slippage,
      gasPrice,
      swapPrice,
      swapPriceUSD,
      error,
      direction,
      updateAllowance,
      setSlippageOpen,
      setSlippage,
      setError,
      setWalletPrompting,
      handleDirectionChange,
      handlePercentageChange,
      handleFromChange,
      handleSubmit,
    },
  ] = useInvest({
    poolAddress,
    initialDirection: "deposit",
  })

  const [
    { processed, agreed, error: termsAgreementError },
    { setShowAgreement, setProcessed, setError: setTermsAgreementError },
  ] = useUserAgreement()

  const isAllowanceNeeded =
    direction === "deposit" && !!allowance && allowance.lt(from.amount)

  const button = useMemo(() => {
    if (from.amount === "0") {
      return (
        <SecondaryButton
          theme="disabled"
          size="large"
          onClick={() => {}}
          fz={22}
          full
        >
          Enter amount to swap
        </SecondaryButton>
      )
    }

    if (from.balance.lt(from.amount)) {
      return (
        <SecondaryButton theme="disabled" size="large" fz={22} full>
          Insufficient balance
        </SecondaryButton>
      )
    }

    if (isAllowanceNeeded) {
      return (
        <SecondaryButton
          size="large"
          onClick={() => (agreed ? updateAllowance() : setShowAgreement(true))}
          fz={22}
          full
        >
          <Flex>
            <Flex ai="center">Unlock Token {from.symbol}</Flex>
            <Flex m="-3px 0 0 4px">
              <LockedIcon />
            </Flex>
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
        {direction === "deposit" ? `Buy ${to.symbol}` : `Sell ${from.symbol}`}
      </Button>
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

  const transactionErrorIsOpen = useMemo<boolean>(
    () => !!error.length || !!termsAgreementError.length,
    [error, termsAgreementError]
  )

  const toggleTransactionError = useCallback(() => {
    if (!!error.length) {
      return setError("")
    }

    if (!!termsAgreementError.length) {
      return setTermsAgreementError("")
    }
  }, [error.length, setError, setTermsAgreementError, termsAgreementError])

  const walletPrompting = useMemo<boolean>(
    () => isWalletPrompting || processed,
    [isWalletPrompting, processed]
  )

  const toggleWalletPrompting = useCallback(() => {
    if (processed) {
      return setProcessed(false)
    }
    if (isWalletPrompting) {
      return setWalletPrompting(false)
    }
  }, [isWalletPrompting, setProcessed, setWalletPrompting, processed])

  return (
    <>
      <Header>{shortenAddress(poolAddress)}</Header>
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Payload
          isOpen={walletPrompting}
          toggle={() => toggleWalletPrompting()}
        />
        <TransactionError
          isOpen={transactionErrorIsOpen}
          toggle={() => toggleTransactionError()}
        >
          {error}
        </TransactionError>
        {form}
      </Container>
    </>
  )
}

const InvestWithProvider = () => {
  return (
    <GraphProvider value={poolsClient}>
      <Invest />
    </GraphProvider>
  )
}

export default InvestWithProvider
