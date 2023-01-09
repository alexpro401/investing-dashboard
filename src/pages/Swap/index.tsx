import { useCallback, useMemo, useState } from "react"
import { Center, Flex, To } from "theme"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { GuardSpinner, PulseSpinner } from "react-spinners-kit"

import { AppButton } from "common"

import { Exchange } from "components/Exchange"
import { Info } from "components/InfoAccordion"
import SwapPrice from "components/SwapPrice"
import SwapPath from "components/SwapPrice/SwapPath"
import WithPoolAddressValidation from "components/WithPoolAddressValidation"
import ExchangeInput from "components/Exchange/ExchangeInput"
import ExchangeDivider from "components/Exchange/Divider"
import Header from "components/Header/Layout"
import TokenSelect from "modals/TokenSelect"

import { useUserAgreement } from "state/user/hooks"
import { Currency } from "lib/entities"

import {
  useAllTokens,
  useAllTokenFundBalances,
  useRiskyProposals,
  usePoolType,
  POOL_TYPE,
  useRouteState,
  useNavigateWithState,
} from "hooks"

import { createClient, Provider as GraphProvider } from "urql"
import { cutDecimalPlaces, fromBig } from "utils"

import swapPathIcon from "assets/icons/swap-path.svg"

import * as ExchangeStyles from "components/Exchange/styled"

import * as S from "./styled"

import useSwap from "./useSwap"

const poolsClient = createClient({
  url: process.env.REACT_APP_ALL_POOLS_API_URL || "",
})

enum ModalView {
  FROM = "from",
  TO = "to",
  NONE = "none",
}

const Swap = () => {
  const navigate = useNavigate()
  const navigateWithState = useNavigateWithState()
  const { pathname } = useLocation()
  const { poolToken, inputToken, outputToken } = useParams()
  const poolType = usePoolType(poolToken)

  const routeState = useRouteState()
  console.log(routeState)

  const [
    formState,
    {
      info,
      infoLoading,
      direction,
      gasPrice,
      receivedAfterSlippage,
      priceImpact,
      oneTokenCost,
      oneUSDCost,
      slippage,
      swapPath,
      setSlippage,
      handleFromChange,
      handleToChange,
      handleSubmit,
      handlePercentageChange,
    },
  ] = useSwap({
    pool: poolToken,
    from: inputToken,
    to: outputToken,
  })

  const { from, to } = formState

  const [{ agreed }, { setShowAgreement }] = useUserAgreement()
  const [{ data: riskyProposals }] = useRiskyProposals(poolToken, true)

  const allTokens = useAllTokens()
  const [balances, balancesIsLoading] = useAllTokenFundBalances(poolToken)
  const [modalView, setModalView] = useState(ModalView.NONE)

  const riskyProposalTokens = useMemo(() => {
    return riskyProposals.map((p) => p.proposalInfo.token.toLocaleLowerCase())
  }, [riskyProposals])

  const onSubmit = useCallback(() => {
    agreed ? handleSubmit() : setShowAgreement(true)
  }, [agreed, handleSubmit, setShowAgreement])

  const handleDirectionChange = useCallback(() => {
    navigateWithState(
      `/pool/swap/${poolType}/${poolToken}/${to.address}/${from.address}`
    )
  }, [from, navigateWithState, poolToken, poolType, to])

  const openTokenSearchModal = useCallback(
    (field: ModalView) => {
      setModalView(field)
      navigateWithState("modal/search")
    },
    [navigateWithState]
  )

  const handleRiskyToken = useCallback(
    (currency: Currency) => {
      const token = currency.isToken ? currency : undefined

      if (!token) return

      const tokenAddress = token.address.toLocaleLowerCase()

      const riskyIndex = riskyProposalTokens.indexOf(tokenAddress)

      // if risky proposal not created yet redirect to create proposal page
      if (riskyIndex === -1) {
        navigate(`/create-risky-proposal/${poolToken}/${tokenAddress}/3`)
        return
      }

      // if risky proposal with status "OPEN INVESTING" redirect to risky swap page
      navigate(`/swap-risky-proposal/${poolToken}/${riskyIndex}/deposit`)

      // TODO: if risky proposal limits outdated ...
    },
    [navigate, poolToken, riskyProposalTokens]
  )

  const handleTokenSelect = useCallback(
    (currency: Currency, isRisky?: boolean) => {
      if (isRisky && poolType === "BASIC_POOL") {
        handleRiskyToken(currency)
        return
      }

      if (!modalView) return

      const rootPath = `/pool/swap/${poolType}/${poolToken}`
      const token = currency.isToken ? currency : undefined

      if (!token) return

      if (modalView === ModalView.FROM) {
        const address = formState[ModalView.TO].address
        navigate(`${rootPath}/${token.address}/${address}`)
      }
      if (modalView === ModalView.TO) {
        const address = formState[ModalView.FROM].address
        navigate(`${rootPath}/${address}/${token.address}`)
      }
    },
    [formState, handleRiskyToken, modalView, navigate, poolToken, poolType]
  )

  const handleModalClose = useCallback(() => {
    navigateWithState(pathname.slice(0, pathname.indexOf("/modal")))
  }, [navigateWithState, pathname])

  const symbol = useMemo(() => {
    if (direction === "deposit") {
      return to.symbol ? (
        to.symbol
      ) : (
        <PulseSpinner color="#181E2C" size={14} loading />
      )
    }

    return from.symbol ? (
      from.symbol
    ) : (
      <PulseSpinner color="#181E2C" size={14} loading />
    )
  }, [direction, from.symbol, to.symbol])

  const button = useMemo(() => {
    if (from.amount === "0" || to.amount === "0") {
      return (
        <AppButton
          disabled
          size="large"
          color="secondary"
          onClick={onSubmit}
          text="Enter amount to swap"
          full
        />
      )
    }

    return (
      <AppButton
        size="large"
        color={direction === "deposit" ? "primary" : "error"}
        onClick={onSubmit}
        full
        text={
          direction === "deposit"
            ? `Buy token ${symbol}`
            : `Sell token ${symbol}`
        }
      />
    )
  }, [from.amount, to.amount, direction, onSubmit, symbol])

  const expectedOutput = useMemo(() => {
    return (
      <ExchangeStyles.InfoRow>
        <ExchangeStyles.InfoGrey>Expected Output:</ExchangeStyles.InfoGrey>
        <Flex gap="4">
          <ExchangeStyles.InfoWhite>
            {fromBig(cutDecimalPlaces(to.amount, to.decimals, false, 6))}
          </ExchangeStyles.InfoWhite>
          <ExchangeStyles.InfoGrey>{to.symbol}</ExchangeStyles.InfoGrey>
        </Flex>
      </ExchangeStyles.InfoRow>
    )
  }, [to.amount, to.decimals, to.symbol])

  const priceImpactUI = useMemo(() => {
    return (
      <ExchangeStyles.InfoRow>
        <ExchangeStyles.InfoGrey>Price Impact:</ExchangeStyles.InfoGrey>
        <Flex gap="4">
          <ExchangeStyles.InfoWhite>{priceImpact}%</ExchangeStyles.InfoWhite>
        </Flex>
      </ExchangeStyles.InfoRow>
    )
  }, [priceImpact])

  const expectedOutputWithSlippage = useMemo(() => {
    return (
      <ExchangeStyles.InfoRow>
        <ExchangeStyles.InfoGrey>
          Received after slippage ({slippage}%)
        </ExchangeStyles.InfoGrey>
        <Flex gap="4">
          <ExchangeStyles.InfoWhite>
            {fromBig(cutDecimalPlaces(receivedAfterSlippage, 18, false, 6))}
          </ExchangeStyles.InfoWhite>
          <ExchangeStyles.InfoGrey>{to.symbol}</ExchangeStyles.InfoGrey>
        </Flex>
      </ExchangeStyles.InfoRow>
    )
  }, [receivedAfterSlippage, slippage, to.symbol])

  const infoData: Info[] | undefined = useMemo(() => {
    if (infoLoading) return undefined
    if (inputToken?.length !== 42 || outputToken?.length !== 42)
      return undefined

    return [
      {
        title: "Fund P&L",
        value: info.fundPNL.lp,
        pnl: info.fundPNL.percent,
        tooltip: "About Fund P&L",
        childrens: [
          {
            title: "Fund P&L in USD",
            value: info.fundPNL.usd,
            pnl: info.fundPNL.percent,
            tooltip: "About Fund P&L in USD",
          },
          {
            title: "Trader P&L",
            value: info.fundPNL.traderLP,
            pnl: info.fundPNL.percent,
            tooltip: "About Trader P&L",
          },
          {
            title: "Trader P&L in USD",
            value: info.fundPNL.traderUSD,
            pnl: info.fundPNL.percent,
            tooltip: "About Trader P&L in USD",
          },
        ],
      },
      {
        title:
          direction === "deposit"
            ? "Average buying price"
            : "Average selling price",
        value: `${
          direction === "deposit" ? info.avgBuyingPrice : info.avgSellingPrice
        } ${info.baseSymbol}`,
        tooltip: "About Average price",
      },
    ]
  }, [infoLoading, inputToken, outputToken, info, direction])

  const createInvestProposalButton = poolType === POOL_TYPE.INVEST && (
    <To to={`/create-invest-proposal/${poolToken}`}>
      <S.CreateProposal />
    </To>
  )

  const swapForm = useMemo(() => {
    return (
      <>
        <ExchangeInput
          price={from.price}
          amount={from.amount}
          balance={from.balance}
          address={from.address}
          symbol={from.symbol}
          decimal={from.decimals}
          onSelect={() => openTokenSearchModal(ModalView.FROM)}
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
          onSelect={() => openTokenSearchModal(ModalView.TO)}
          onChange={handleToChange}
        />
      </>
    )
  }, [
    from,
    to,
    handleDirectionChange,
    handleFromChange,
    handlePercentageChange,
    handleToChange,
    openTokenSearchModal,
  ])

  return (
    <>
      <Header>Swap</Header>
      <ExchangeStyles.Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Exchange
          title="Swap"
          slippage={slippage}
          setSlippage={setSlippage}
          buttons={[button, createInvestProposalButton]}
          info={infoData}
          form={swapForm}
        >
          {inputToken !== "0x" && outputToken !== "0x" && (
            <SwapPrice
              fromSymbol={from.symbol}
              toSymbol={to.symbol}
              tokensCost={oneTokenCost}
              usdCost={oneUSDCost}
              gasPrice={gasPrice}
              isExpandable
            >
              <S.SwapPriceBody>
                {expectedOutput}
                {priceImpactUI}
                {expectedOutputWithSlippage}
              </S.SwapPriceBody>
              <S.SwapRouteBody>
                <S.SwapPathTitle>
                  <S.SwapPathIcon src={swapPathIcon} />
                  Swap Route
                </S.SwapPathTitle>
                {!!swapPath.length && <SwapPath path={swapPath} />}
                {!!swapPath.length && (
                  <S.SwapPathDescription>
                    Best price route costs - ${gasPrice} in gas. This route
                    optimizes your total output by considering split routes,
                    multiple hops, and the gas cost of each step.
                  </S.SwapPathDescription>
                )}
              </S.SwapRouteBody>
            </SwapPrice>
          )}
        </Exchange>
      </ExchangeStyles.Container>

      <TokenSelect
        onClose={handleModalClose}
        allBalances={balances}
        balancesLoading={balancesIsLoading}
        allTokens={allTokens}
        onSelect={handleTokenSelect}
      />
    </>
  )
}

export default function SwapWithProvider() {
  const { poolToken } = useParams()
  return (
    <GraphProvider value={poolsClient}>
      <WithPoolAddressValidation
        poolAddress={poolToken ?? ""}
        loader={
          <Center>
            <GuardSpinner size={20} loading />
          </Center>
        }
      >
        <Swap />
      </WithPoolAddressValidation>
    </GraphProvider>
  )
}
