import { useCallback, useEffect, useMemo, useState } from "react"
import { Center, Flex, To } from "theme"
import {
  useParams,
  useNavigate,
  useLocation,
  generatePath,
} from "react-router-dom"
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

import { cutDecimalPlaces, fromBig, isAddress } from "utils"

import swapPathIcon from "assets/icons/swap-path.svg"

import * as ExchangeStyles from "components/Exchange/styled"

import * as S from "./styled"

import useSwap from "./useSwap"
import { ROUTE_PATHS } from "consts"

enum ModalView {
  FROM = "from",
  TO = "to",
  NONE = "none",
}

const Swap = () => {
  const navigate = useNavigate()
  const navigateWithState = useNavigateWithState()
  const { pathname } = useLocation()
  const { poolAddress, inputToken, outputToken } = useParams()
  const poolType = usePoolType(poolAddress)

  const routeState = useRouteState()

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
    pool: poolAddress,
    from: inputToken,
    to: outputToken,
  })

  const { from, to } = formState

  const [{ agreed }, { setShowAgreement }] = useUserAgreement()
  const [{ data: riskyProposals }] = useRiskyProposals(poolAddress, true)

  const allTokens = useAllTokens()
  const [balances, balancesIsLoading] = useAllTokenFundBalances(poolAddress)
  const [modalView, setModalView] = useState(ModalView.NONE)

  const riskyProposalTokens = useMemo(() => {
    return riskyProposals.map((p) => p.proposalInfo.token.toLocaleLowerCase())
  }, [riskyProposals])

  const onSubmit = useCallback(() => {
    agreed ? handleSubmit() : setShowAgreement(true)
  }, [agreed, handleSubmit, setShowAgreement])

  const handleDirectionChange = useCallback(() => {
    navigateWithState(`/pool/swap/${poolAddress}/${to.address}/${from.address}`)
  }, [from, navigateWithState, poolAddress, to])

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

      const DO_NOT_SHOW_FAQ =
        localStorage.getItem("risky-proposal-faq-read") === "true"
      const tokenAddress = token.address.toLocaleLowerCase()

      const riskyIndex = riskyProposalTokens.indexOf(tokenAddress)

      // if risky proposal not created yet redirect to create proposal page
      if (riskyIndex === -1) {
        navigate(
          `/create-risky-proposal/${poolAddress}/${tokenAddress}/${
            DO_NOT_SHOW_FAQ ? "create" : "faq"
          }`
        )
        return
      }

      // if risky proposal with status "OPEN INVESTING" redirect to risky swap page
      navigate(`/swap-risky-proposal/${poolAddress}/${riskyIndex}/deposit`)

      // TODO: if risky proposal limits outdated ...
    },
    [navigate, poolAddress, riskyProposalTokens]
  )

  const handleTokenSelect = useCallback(
    (currency: Currency, isRisky?: boolean) => {
      if (isRisky && poolType === "BASIC_POOL") {
        handleRiskyToken(currency)
        return
      }

      if (!modalView) return

      const rootPath = `/pool/swap/${poolAddress}`
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
    [formState, handleRiskyToken, modalView, navigate, poolAddress, poolType]
  )

  // fallback: if from and to addresses are not valid, select basic pool token as from
  // gives ability to redirect on swap without loading basic pool data
  useEffect(() => {
    if (!isAddress(info.baseAddress) || !isAddress(poolAddress)) return

    const lastPath = pathname.split("/").reverse()
    console.log(lastPath)

    if (isAddress(from) || isAddress(to)) return

    const options = lastPath[1] === "modal" ? `modal/${lastPath[0]}` : ""

    const path = generatePath(ROUTE_PATHS.poolSwap, {
      poolAddress: poolAddress!,
      inputToken: info.baseAddress!,
      outputToken: "0x...",
      "*": options,
    })

    navigate(path)
  }, [info.baseAddress, from, to, navigate, poolAddress, pathname])

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
    if (!isAddress(from.address) || !isAddress(to.address)) {
      return (
        <AppButton
          disabled
          size="large"
          color="secondary"
          onClick={onSubmit}
          text="Select token"
          full
        />
      )
    }

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
    <To to={`/create-invest-proposal/${poolAddress}`}>
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
      <Swap />
    </WithPoolAddressValidation>
  )
}
