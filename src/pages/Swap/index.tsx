import { useCallback, useMemo, useState } from "react"
import { Center, Flex, To } from "theme"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { GuardSpinner, PulseSpinner } from "react-spinners-kit"

import SwapPrice from "components/SwapPrice"
import SwapPath from "components/SwapPrice/SwapPath"
import IconButton from "components/IconButton"
import ExchangeInput from "components/Exchange/ExchangeInput"
import ExchangeDivider from "components/Exchange/Divider"
import { AppButton } from "common"
import CircularProgress from "components/CircularProgress"
import TransactionSlippage from "components/TransactionSlippage"
import Header from "components/Header/Layout"
import TokenSelect from "modals/TokenSelect"

import settings from "assets/icons/settings.svg"
import close from "assets/icons/close-big.svg"
import swapPathIcon from "assets/icons/swap-path.svg"

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

import * as S from "./styled"

import useSwap from "./useSwap"
import { cutDecimalPlaces, fromBig } from "utils"
import { useUserAgreement } from "state/user/hooks"
import { useAllTokens } from "hooks/useToken"
import { useAllTokenFundBalances } from "hooks/useBalance"
import { Currency } from "lib/entities"
import useRiskyProposals from "hooks/useRiskyProposals"
import usePoolType, { POOL_TYPE } from "hooks/usePoolType"
import WithPoolAddressValidation from "components/WithPoolAddressValidation"

enum ModalView {
  FROM = "from",
  TO = "to",
  NONE = "none",
}

const Swap = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { poolToken, inputToken, outputToken } = useParams()
  const poolType = usePoolType(poolToken)
  const [
    formState,
    {
      info,
      direction,
      gasPrice,
      receivedAfterSlippage,
      priceImpact,
      oneTokenCost,
      oneUSDCost,
      isSlippageOpen,
      slippage,
      swapPath,
      setSlippage,
      setSlippageOpen,
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
    navigate(
      `/pool/swap/${poolType}/${poolToken}/${to.address}/${from.address}`
    )
  }, [from, navigate, poolToken, poolType, to])

  const openTokenSearchModal = useCallback(
    (field: ModalView) => {
      setModalView(field)
      navigate("modal/search")
    },
    [navigate]
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
    navigate(pathname.slice(0, pathname.indexOf("/modal")))
  }, [navigate, pathname])

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

  const fundPNL = useMemo(() => {
    return (
      <Flex gap="4">
        <InfoWhite>{info.fundPNL.lp}</InfoWhite>
        <InfoGrey>({info.fundPNL.percent})</InfoGrey>
      </Flex>
    )
  }, [info])

  const fundPNLContent = useMemo(() => {
    return (
      <>
        <InfoRow>
          <InfoGrey>in USD</InfoGrey>
          <InfoGrey>
            {info.fundPNL.usd} ({info.fundPNL.percent}){" "}
          </InfoGrey>
        </InfoRow>
        <InfoRow>
          <InfoGrey>Trader P&L</InfoGrey>
          <Flex gap="4">
            <InfoWhite>{info.fundPNL.traderLP}</InfoWhite>
            <InfoGrey>({info.fundPNL.percent})</InfoGrey>
          </Flex>
        </InfoRow>
        <InfoRow>
          <InfoGrey>in USD</InfoGrey>
          <InfoGrey>
            {info.fundPNL.traderUSD} ({info.fundPNL.percent}){" "}
          </InfoGrey>
        </InfoRow>
      </>
    )
  }, [info])

  const averagePrice = useMemo(() => {
    if (direction === "deposit") {
      return (
        <InfoRow>
          <InfoGrey>Average buying price</InfoGrey>
          <Flex gap="4">
            <InfoWhite>{info.avgBuyingPrice} </InfoWhite>
            <InfoGrey>{info.baseSymbol}</InfoGrey>
          </Flex>
        </InfoRow>
      )
    }

    return (
      <InfoRow>
        <InfoGrey>Average selling price</InfoGrey>
        <Flex gap="4">
          <InfoWhite>{info.avgSellingPrice} </InfoWhite>
          <InfoGrey>{info.baseSymbol}</InfoGrey>
        </Flex>
      </InfoRow>
    )
  }, [direction, info])

  const expectedOutput = useMemo(() => {
    return (
      <InfoRow>
        <InfoGrey>Expected Output:</InfoGrey>
        <Flex gap="4">
          <InfoWhite>
            {fromBig(cutDecimalPlaces(to.amount, to.decimals, false, 6))}
          </InfoWhite>
          <InfoGrey>{to.symbol}</InfoGrey>
        </Flex>
      </InfoRow>
    )
  }, [to.amount, to.decimals, to.symbol])

  const priceImpactUI = useMemo(() => {
    return (
      <InfoRow>
        <InfoGrey>Price Impact:</InfoGrey>
        <Flex gap="4">
          <InfoWhite>{priceImpact}%</InfoWhite>
        </Flex>
      </InfoRow>
    )
  }, [priceImpact])

  const expectedOutputWithSlippage = useMemo(() => {
    return (
      <InfoRow>
        <InfoGrey>Received after slippage ({slippage}%)</InfoGrey>
        <Flex gap="4">
          <InfoWhite>
            {fromBig(cutDecimalPlaces(receivedAfterSlippage, 18, false, 6))}
          </InfoWhite>
          <InfoGrey>{to.symbol}</InfoGrey>
        </Flex>
      </InfoRow>
    )
  }, [receivedAfterSlippage, slippage, to.symbol])

  const infoCard = useMemo(() => {
    if (!inputToken || !outputToken) return
    if (inputToken.length !== 42 || outputToken.length !== 42) return

    return (
      <InfoCard gap="12">
        <InfoDropdown left={<InfoGrey>Fund P&L</InfoGrey>} right={fundPNL}>
          {fundPNLContent}
        </InfoDropdown>
        {averagePrice}
      </InfoCard>
    )
  }, [averagePrice, fundPNL, fundPNLContent, inputToken, outputToken])

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

      <Flex full p="16px 0 0">
        {button}
      </Flex>

      {infoCard}

      {poolType === POOL_TYPE.INVEST && (
        <To to={`/create-invest-proposal/${poolToken}`}>
          <S.CreateProposal />
        </To>
      )}

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
  )
}
