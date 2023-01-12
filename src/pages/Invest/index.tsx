import { useMemo } from "react"
import { useParams } from "react-router-dom"
import { Center } from "theme"

import { ICON_NAMES } from "consts/icon-names"
import Token from "components/Token"
import SwapPrice from "components/SwapPrice"
import Header from "components/Header/Layout"
import ExchangeDivider from "components/Exchange/Divider"
import { AppButton } from "common"
import ExchangeInput from "components/Exchange/ExchangeInput"

import { useUserAgreement } from "state/user/hooks"

import { cutDecimalPlaces, fromBig, shortenAddress } from "utils"
import { Container } from "components/Exchange/styled"

import useInvest from "./useInvest"
import { GuardSpinner } from "react-spinners-kit"
import WithPoolAddressValidation from "components/WithPoolAddressValidation"
import { Exchange } from "components/Exchange"
import { Info } from "components/InfoAccordion"

const Invest = () => {
  const { poolAddress } = useParams<{
    poolAddress: string
  }>()

  const [
    { from, to },
    {
      info,
      allowance,
      slippage,
      gasPrice,
      swapPrice,
      swapPriceUSD,
      direction,
      updateAllowance,
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
    if (!info.freeLiquidity.lp) return "Loading"

    if (typeof info.freeLiquidity.lp === "number") return "Unlimited"

    return `${fromBig(cutDecimalPlaces(info.freeLiquidity.lp))} LP (${fromBig(
      info.freeLiquidity.percent
    )}%)`
  }, [info])

  const availableToInvest = useMemo(() => {
    if (!info.availableToInvest.amount) return "Loading"

    return `${fromBig(cutDecimalPlaces(info.availableToInvest.amount))} ${
      info.symbol
    }`
  }, [info])

  const minInvestAmount = useMemo(() => {
    if (!info.minInvestAmount.amount) return "Loading"

    return `${fromBig(cutDecimalPlaces(info.minInvestAmount.amount))} ${
      info.symbol
    }`
  }, [info])

  const totalPositionSize = useMemo(() => {
    return `${fromBig(cutDecimalPlaces(info.fundPositions.total))} ${
      info.symbol
    }`
  }, [info])

  const positions = useMemo(() => {
    return info.fundPositions.positions.map((p) => (
      <Token key={p.address} data={p} />
    ))
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
    </>
  )

  const infoData: Info[] | undefined = useMemo(() => {
    if (!info) return

    return [
      {
        title: "Free Liquidity",
        value: freeLiquidity,
        tooltip: "Free Liquidity",
      },
      {
        title: "Available to Invest",
        value: availableToInvest,
        tooltip: "Available to Invest",
      },
      {
        title: "Min Invest Amount",
        value: minInvestAmount,
        tooltip: "Min Invest Amount",
      },
      {
        title: "Total fund positions",
        value: totalPositionSize,
        tooltip: "Total fund positions",
        childrens: positions,
      },
    ]
  }, [
    availableToInvest,
    freeLiquidity,
    positions,
    info,
    minInvestAmount,
    totalPositionSize,
  ])

  return (
    <>
      <Header>{shortenAddress(poolAddress)}</Header>
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Exchange
          title="Invest"
          slippage={slippage}
          setSlippage={setSlippage}
          buttons={[button]}
          form={form}
          info={infoData}
        >
          <SwapPrice
            fromSymbol={from.symbol}
            toSymbol={to.symbol}
            tokensCost={swapPrice}
            usdCost={swapPriceUSD}
            gasPrice={gasPrice}
          />
        </Exchange>
      </Container>
    </>
  )
}

const InvestWithProvider = () => {
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
      <Invest />
    </WithPoolAddressValidation>
  )
}

export default InvestWithProvider
