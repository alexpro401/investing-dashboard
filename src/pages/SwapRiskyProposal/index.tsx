import { useCallback, useMemo } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"

import { Center, Flex } from "theme"
import SwapPrice from "components/SwapPrice"
import Header from "components/Header/Layout"
import ExchangeDivider from "components/Exchange/Divider"
import { AppButton } from "common"
import ExchangeInput from "components/Exchange/ExchangeInput"

import { normalizeBigNumber } from "utils"

import {
  Container,
  InfoRow,
  InfoGrey,
  InfoWhite,
} from "components/Exchange/styled"

import { AddButton } from "./styled"

import useSwapRiskyProposal, {
  UseSwapRiskyParams,
} from "./useSwapRiskyProposal"
import { useUserAgreement } from "state/user/hooks"
import WithPoolAddressValidation from "components/WithPoolAddressValidation"
import { GuardSpinner } from "react-spinners-kit"
import { Exchange } from "components/Exchange"
import { Info } from "components/InfoAccordion"

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
    return `${normalizeBigNumber(lpBalance)} ${info.pool.symbol}`
  }, [info, lpBalance])

  const baseInPosition = useMemo(() => {
    return `${info.lpInPosition} ${info.pool.symbol}`
  }, [info])

  const lpComplete = useMemo(() => {
    return `${info.lpComplete} ${info.pool.symbol}`
  }, [info])

  const lpLimit = useMemo(() => {
    return `${info.maxLPLimit} ${info.pool.symbol}`
  }, [info])

  const expirationDate = useMemo(() => {
    return `${info.expirationDate.amount} ${info.expirationDate.label}`
  }, [info])

  const maxBuyingPrice = useMemo(() => {
    return `${info.maxPrice} ${info.positionToken.symbol}/${info.baseToken.symbol}`
  }, [info])

  const positionPNLContent = useMemo(() => {
    return [
      <InfoRow key="PNL in USD">
        <InfoGrey>in USD</InfoGrey>
        <InfoGrey>
          {normalizeBigNumber(info.positionPnlUSD)} USD (
          {normalizeBigNumber(info.positionPnl)}%){" "}
        </InfoGrey>
      </InfoRow>,
      <InfoRow key="Trader PNL">
        <InfoGrey>Trader P&L</InfoGrey>
        <Flex gap="4">
          <InfoWhite>
            {normalizeBigNumber(info.traderPnlLP)} {info.pool.symbol}{" "}
          </InfoWhite>
          <InfoGrey>({normalizeBigNumber(info.positionPnl)}%)</InfoGrey>
        </Flex>
      </InfoRow>,
      <InfoRow key="Trader PNL in USD">
        <InfoGrey>in USD</InfoGrey>
        <InfoGrey>
          {normalizeBigNumber(info.traderPnlUSD)} USD (
          {normalizeBigNumber(info.positionPnl)}%){" "}
        </InfoGrey>
      </InfoRow>,
    ]
  }, [info])

  const averagePositionPrice = useMemo(() => {
    return `${normalizeBigNumber(info.avgBuyingPrice)} ${
      info.positionToken.symbol
    }/${info.baseToken.symbol}`
  }, [info])

  const form = (
    <>
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
    </>
  )

  const exchangeInfo: Info[] = useMemo(() => {
    return [
      {
        title: "Your share",
        value: yourShare,
        tooltip: "Your share of the pool",
        rightNode: <AddButton onClick={handleInvestRedirect}>+ Add</AddButton>,
      },
      {
        title: `${info.baseToken.symbol} in position`,
        value: baseInPosition,
        tooltip: "Base token in position of the pool",
      },
      {
        title: "LP complete",
        value: lpComplete,
        tooltip: "LP complete",
      },
      {
        title: "LP max size",
        value: lpLimit,
        tooltip: "LP max size",
      },
      {
        title: "Average position price",
        value: averagePositionPrice,
        tooltip: "Average position price",
      },
      {
        title: "Position P&L",
        value: `${normalizeBigNumber(info.positionPnlLP)} ${
          info.pool.symbol
        } (${normalizeBigNumber(info.positionPnl)}%)`,
        childrens: positionPNLContent,
        tooltip: "Position P&L",
      },
      {
        title: "Expiration date",
        value: expirationDate,
        tooltip: "Expiration date",
      },
      {
        title: "Maximum buying price",
        value: maxBuyingPrice,
        tooltip: "Maximum buying price",
      },
    ]
  }, [
    averagePositionPrice,
    baseInPosition,
    expirationDate,
    handleInvestRedirect,
    info.baseToken.symbol,
    info.pool.symbol,
    info.positionPnl,
    info.positionPnlLP,
    lpComplete,
    lpLimit,
    maxBuyingPrice,
    positionPNLContent,
    yourShare,
  ])

  return (
    <>
      <Header>Swap</Header>
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Exchange
          title="Swap"
          form={form}
          buttons={[button]}
          setSlippage={setSlippage}
          slippage={slippage}
          info={exchangeInfo}
        >
          <SwapPrice
            fromSymbol={from.symbol}
            toSymbol={to.symbol}
            tokensCost={oneTokenCost}
            usdCost={oneUSDCost}
            gasPrice={gasPrice}
          />
        </Exchange>
      </Container>
    </>
  )
}

const SwapRiskyProposalWithProvider = () => {
  const params: UseSwapRiskyParams = useParams()

  return (
    <WithPoolAddressValidation
      poolAddress={params.poolAddress ?? ""}
      loader={
        <Center>
          <GuardSpinner size={20} loading />
        </Center>
      }
    >
      <SwapRiskyProposal />
    </WithPoolAddressValidation>
  )
}

export default SwapRiskyProposalWithProvider
