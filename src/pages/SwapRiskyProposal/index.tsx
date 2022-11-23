import { useCallback, useMemo } from "react"
import { createClient, Provider as GraphProvider } from "urql"
import { useParams, useNavigate, useLocation } from "react-router-dom"

import { Flex } from "theme"
import SwapPrice from "components/SwapPrice"
import Header from "components/Header/Layout"
import IconButton from "components/IconButton"
import ExchangeDivider from "components/Exchange/Divider"
import CircularProgress from "components/CircularProgress"
import { AppButton } from "common"
import ExchangeInput from "components/Exchange/ExchangeInput"
import TransactionSlippage from "components/TransactionSlippage"

import close from "assets/icons/close-big.svg"
import settings from "assets/icons/settings.svg"

import { normalizeBigNumber } from "utils"

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
import { useUserAgreement } from "state/user/hooks"

const basicClient = createClient({
  url: process.env.REACT_APP_BASIC_POOLS_API_URL || "",
})

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

  const [{ agreed }, { setShowAgreement }] = useUserAgreement()

  const onSubmit = useCallback(() => {
    agreed ? handleSubmit() : setShowAgreement(true)
  }, [agreed, handleSubmit, setShowAgreement])

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
        <AppButton
          disabled
          size="large"
          color="secondary"
          text="Enter amount to swap"
          onClick={onSubmit}
          full
        />
      )
    }

    return (
      <AppButton
        size="large"
        color={params.direction === "deposit" ? "primary" : "error"}
        text={
          params.direction === "deposit"
            ? `Buy token ${to.symbol}`
            : `Sell token ${from.symbol}`
        }
        onClick={onSubmit}
        full
      />
    )
  }, [
    from.amount,
    from.symbol,
    to.amount,
    to.symbol,
    params.direction,
    onSubmit,
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
          <InfoGrey>
            {normalizeBigNumber(info.positionPnlUSD)} USD (
            {normalizeBigNumber(info.positionPnl)}%){" "}
          </InfoGrey>
        </InfoRow>
        <InfoRow>
          <InfoGrey>Trader P&L</InfoGrey>
          <Flex gap="4">
            <InfoWhite>
              {normalizeBigNumber(info.traderPnlLP)} {info.pool.symbol}{" "}
            </InfoWhite>
            <InfoGrey>({normalizeBigNumber(info.positionPnl)}%)</InfoGrey>
          </Flex>
        </InfoRow>
        <InfoRow>
          <InfoGrey>in USD</InfoGrey>
          <InfoGrey>
            {normalizeBigNumber(info.traderPnlUSD)} USD (
            {normalizeBigNumber(info.positionPnl)}%){" "}
          </InfoGrey>
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
            <InfoWhite>
              {normalizeBigNumber(info.positionPnlLP)} {info.pool.symbol}
            </InfoWhite>
            <InfoGrey>({normalizeBigNumber(info.positionPnl)}%)</InfoGrey>
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
          <InfoWhite>{normalizeBigNumber(info.avgBuyingPrice)}</InfoWhite>
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
        {form}
      </Container>
    </>
  )
}

const SwapRiskyProposalWithProvider = () => {
  return (
    <GraphProvider value={basicClient}>
      <SwapRiskyProposal />
    </GraphProvider>
  )
}

export default SwapRiskyProposalWithProvider
