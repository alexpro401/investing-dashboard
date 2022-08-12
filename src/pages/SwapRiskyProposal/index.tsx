import { useCallback, useMemo } from "react"
import { Flex } from "theme"
import { useParams, useNavigate, useLocation } from "react-router-dom"

import SwapPrice from "components/SwapPrice"
import IconButton from "components/IconButton"
import ExchangeInput from "components/Exchange/ExchangeInput"
import ExchangeDivider from "components/Exchange/Divider"
import Button, { SecondaryButton } from "components/Button"
import CircularProgress from "components/CircularProgress"
import TransactionSlippage from "components/TransactionSlippage"
import Header from "components/Header/Layout"
import Payload from "components/Payload"
import TransactionError from "modals/TransactionError"

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

import { AddButton } from "./styled"

import useSwapRiskyProposal, {
  UseSwapRiskyParams,
} from "./useSwapRiskyProposal"
import { normalizeBigNumber } from "utils"

const SwapRiskyProposal = () => {
  const params: UseSwapRiskyParams = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [
    { from, to },
    {
      info,
      lpBalance,
      gasPrice,
      oneTokenCost,
      oneUSDCost,
      error,
      setError,
      isWalletPrompting,
      setWalletPrompting,
      slippage,
      setSlippage,
      isSlippageOpen,
      setSlippageOpen,
      handleFromChange,
      handleToChange,
      handlePercentageChange,
      handleSubmit,
    },
  ] = useSwapRiskyProposal(params)

  const handleDirectionChange = useCallback(() => {
    if (!location || !navigate) return

    const { pathname } = location
    const isDeposit = pathname.includes("/deposit")

    if (isDeposit) {
      navigate(
        `/swap-risky-proposal/${params.poolAddress}/${params.proposalId}/withdraw`
      )
    }

    if (!isDeposit) {
      navigate(
        `/swap-risky-proposal/${params.poolAddress}/${params.proposalId}/deposit`
      )
    }
  }, [location, navigate, params])

  const handleInvestRedirect = useCallback(() => {
    navigate(
      `/invest-risky-proposal/${params.poolAddress}/${params.proposalId}`
    )
  }, [navigate, params])

  const button = useMemo(() => {
    if (from.amount === "0" || to.amount === "0") {
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
        theme={params.direction === "deposit" ? "primary" : "warn"}
        onClick={handleSubmit}
        fz={22}
        full
      >
        {params.direction === "deposit" ? (
          <Flex gap="6">Buy token {to.symbol}</Flex>
        ) : (
          <Flex gap="6">Sell token {from.symbol}</Flex>
        )}
      </Button>
    )
  }, [
    from.amount,
    from.symbol,
    to.amount,
    to.symbol,
    params.direction,
    handleSubmit,
  ])

  const yourShare = useMemo(() => {
    return (
      <InfoRow>
        <InfoGrey>Your share:</InfoGrey>
        <Flex onClick={handleInvestRedirect} gap="4">
          <AddButton>+ Add</AddButton>
          <InfoWhite>{normalizeBigNumber(lpBalance)}</InfoWhite>
          <InfoGrey>{info.pool.symbol}</InfoGrey>
        </Flex>
      </InfoRow>
    )
  }, [handleInvestRedirect, info, lpBalance])

  const baseInPosition = useMemo(() => {
    return (
      <InfoRow>
        <InfoGrey>{info.baseToken.symbol} in position</InfoGrey>
        <Flex gap="4">
          <InfoWhite>{info.lpInPosition}</InfoWhite>
          <InfoGrey>{info.pool.symbol}</InfoGrey>
        </Flex>
      </InfoRow>
    )
  }, [info])

  const lpComplete = useMemo(() => {
    return (
      <InfoRow>
        <InfoGrey>LP complete</InfoGrey>
        <Flex gap="4">
          <InfoWhite>{info.lpComplete}</InfoWhite>
          <InfoGrey>{info.pool.symbol}</InfoGrey>
        </Flex>
      </InfoRow>
    )
  }, [info])

  const lpLimit = useMemo(() => {
    return (
      <InfoRow>
        <InfoGrey>LP max size</InfoGrey>
        <Flex gap="4">
          <InfoWhite>{info.maxLPLimit}</InfoWhite>
          <InfoGrey>{info.pool.symbol}</InfoGrey>
        </Flex>
      </InfoRow>
    )
  }, [info])

  const expirationDate = useMemo(() => {
    return (
      <InfoRow>
        <InfoGrey>Expiration date:</InfoGrey>
        <Flex gap="4">
          <InfoWhite>{info.expirationDate.amount}</InfoWhite>
          <InfoGrey>{info.expirationDate.label}</InfoGrey>
        </Flex>
      </InfoRow>
    )
  }, [info])

  const maxBuyingPrice = useMemo(() => {
    return (
      <InfoRow>
        <InfoGrey>Maximum buying price</InfoGrey>
        <Flex gap="4">
          <InfoWhite>{info.maxPrice}</InfoWhite>
          <InfoGrey>
            {info.positionToken.symbol}/{info.baseToken.symbol}
          </InfoGrey>
        </Flex>
      </InfoRow>
    )
  }, [info])

  const positionPNLContent = useMemo(() => {
    return (
      <>
        <InfoRow>
          <InfoGrey>in USD</InfoGrey>
          <InfoGrey>+1260 USD (+27.18%) </InfoGrey>
        </InfoRow>
        <InfoRow>
          <InfoGrey>Trader P&L</InfoGrey>
          <Flex gap="4">
            <InfoWhite>2.11 {info.pool.symbol} </InfoWhite>
            <InfoGrey>(+14%)</InfoGrey>
          </Flex>
        </InfoRow>
        <InfoRow>
          <InfoGrey>in USD</InfoGrey>
          <InfoGrey>+1260 USD (+27.18%) </InfoGrey>
        </InfoRow>
      </>
    )
  }, [info])

  const positionPNL = useMemo(() => {
    return (
      <InfoDropdown
        left={<InfoGrey>Position P&L</InfoGrey>}
        right={
          <Flex gap="4">
            <InfoWhite>+12.72 {info.pool.symbol}</InfoWhite>
            <InfoGrey>(+37.18%)</InfoGrey>
          </Flex>
        }
      >
        {positionPNLContent}
      </InfoDropdown>
    )
  }, [positionPNLContent, info])

  const averagePositionPrice = useMemo(() => {
    return (
      <InfoRow>
        <InfoGrey>Average position price</InfoGrey>
        <Flex gap="4">
          <InfoWhite>0.01289 </InfoWhite>
          <InfoGrey>
            {info.positionToken.symbol}/{info.baseToken.symbol}
          </InfoGrey>
        </Flex>
      </InfoRow>
    )
  }, [info])

  const form = (
    <Card>
      <CardHeader>
        <Flex>
          <Title active>Swap</Title>
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

      <ExchangeInput
        price={from.price}
        amount={from.amount}
        balance={from.balance}
        address={from.address}
        symbol={from.symbol}
        decimal={from.decimals}
        onChange={handleFromChange}
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
        onChange={handleToChange}
      />

      <SwapPrice
        fromSymbol={from.symbol}
        toSymbol={to.symbol}
        tokensCost={oneTokenCost}
        usdCost={oneUSDCost}
        gasPrice={gasPrice}
      />

      <Flex full p="16px 0 0">
        {button}
      </Flex>

      <InfoCard gap="12">
        {yourShare}
        {baseInPosition}
        {lpComplete}
        {lpLimit}
        {averagePositionPrice}
        {positionPNL}
        {expirationDate}
        {maxBuyingPrice}
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
      <Header>Swap</Header>
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Payload
          isOpen={isWalletPrompting}
          toggle={() => setWalletPrompting(false)}
        />
        <TransactionError isOpen={!!error.length} toggle={() => setError("")}>
          {error}
        </TransactionError>
        {form}
      </Container>
    </>
  )
}

export default SwapRiskyProposal
