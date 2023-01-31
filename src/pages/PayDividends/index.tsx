import { Center, Flex } from "theme"
import { useCallback, useMemo, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useWeb3React } from "@web3-react/core"
import format from "date-fns/format"
import formatDistanceToNow from "date-fns/formatDistanceToNow"

import { DATE_TIME_FORMAT } from "consts/time"

import { ICON_NAMES } from "consts/icon-names"
import ExternalLink from "components/ExternalLink"
import IconButton from "components/IconButton"
import DividendsInput from "components/Exchange/DividendsInput"
import { AppButton } from "common"
import CircularProgress from "components/CircularProgress"
import Header from "components/Header/Layout"
import TokenSelect from "modals/TokenSelect"

import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"

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
  BlueButton,
} from "components/Exchange/styled"

import usePayDividends from "./usePayDividends"
import useConvertToDividendsContext, {
  ConvertToDividendsProvider,
} from "modals/ConvertToDividends/useConvertToDividendsContext"
import { useAllTokenBalances } from "hooks/useBalance"
import { useAllTokens } from "hooks/useToken"
import { Currency } from "lib/entities"
import WithPoolAddressValidation from "components/WithPoolAddressValidation"
import { GuardSpinner } from "react-spinners-kit"
import { Exchange } from "components/Exchange"

function PayDividends() {
  const { chainId } = useWeb3React()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { poolAddress, proposalId } = useParams()
  const [activeIndex, setActiveIndex] = useState(-1)
  const { convertToDividends } = useConvertToDividendsContext()
  const [balances, balancesIsLoading] = useAllTokenBalances()
  const allTokens = useAllTokens()

  const [
    { tokens, info, supplies },
    {
      handleFromChange,
      handleSubmit,
      handleDividendTokenSelect,
      updateAllowance,
    },
  ] = usePayDividends(poolAddress, proposalId)

  const openTokenSelect = (index: number) => {
    setActiveIndex(index)
    navigate("modal/search")
  }

  const handleModalClose = useCallback(() => {
    navigate(pathname.slice(0, pathname.indexOf("/modal")))
  }, [navigate, pathname])

  const onTokenSelect = useCallback(
    (currency: Currency) => {
      const token = currency.isToken ? currency : undefined

      if (!token) return

      handleDividendTokenSelect(token.address, activeIndex)
      handleModalClose()
    },
    [activeIndex, handleDividendTokenSelect, handleModalClose]
  )

  const lastDividends = useMemo(() => {
    if (!supplies || !supplies.length)
      return (
        <Flex gap="4">
          <InfoWhite>-</InfoWhite>
        </Flex>
      )

    return (
      <Flex gap="4">
        <InfoWhite>
          {formatDistanceToNow(new Date(Number(supplies[0].timestamp) * 1000))}{" "}
          ago
        </InfoWhite>
      </Flex>
    )
  }, [supplies])

  const lastDividendsContent = useMemo(() => {
    return (supplies || []).map((supply) => (
      <InfoRow key={supply.id}>
        <InfoGrey>
          {format(new Date(Number(supply.timestamp) * 1000), DATE_TIME_FORMAT)}
        </InfoGrey>
        <Flex gap="4">
          {chainId && (
            <ExternalLink
              color="#2680EB"
              href={getExplorerLink(
                chainId,
                supply.hash,
                ExplorerDataType.TRANSACTION
              )}
            >
              {supply.dividendsTokens.length} token
              {supply.dividendsTokens.length > 1 && "s"}
            </ExternalLink>
          )}
        </Flex>
      </InfoRow>
    ))
  }, [supplies, chainId])

  const proposalTVL = useMemo(() => {
    return (
      <InfoRow>
        <InfoGrey>Proposal TVL</InfoGrey>
        <Flex gap="4">
          <InfoWhite>
            {info.tvl.base} {info.ticker}
          </InfoWhite>
          <InfoGrey>(${info.tvl.usd})</InfoGrey>
        </Flex>
      </InfoRow>
    )
  }, [info.tvl.base, info.ticker, info.tvl.usd])

  const APR = useMemo(() => {
    return (
      <InfoRow>
        <InfoGrey>APR after dividend</InfoGrey>
        <Flex gap="4">
          <InfoWhite>{info.APR.percent}%</InfoWhite>
          <InfoGrey>(${info.APR.usd})</InfoGrey>
        </Flex>
      </InfoRow>
    )
  }, [info.APR])

  // TODO: check terms and conditions agreement
  const button = useMemo(() => {
    const inufficientTokens = tokens.filter((token) =>
      token.balance.lt(token.amount)
    )

    if (inufficientTokens.length) {
      return (
        <AppButton
          disabled
          size="large"
          full
          text="insufficient balance"
          color="secondary"
        />
      )
    }

    const lockedTokens = tokens.filter((token) =>
      token.allowance.lt(token.amount)
    )

    if (lockedTokens.length) {
      return (
        <AppButton
          size="large"
          color="secondary"
          onClick={() => updateAllowance(lockedTokens[0].data.address)}
          text={`Unlock Token ${lockedTokens[0].data.symbol}`}
          full
          iconRight={ICON_NAMES.locked}
        />
      )
    }

    const disabled =
      tokens.filter((token) => token.amount.isZero()).length === tokens.length

    if (disabled) {
      return (
        <AppButton
          disabled
          size="large"
          color="secondary"
          full
          text="Enter amount"
        />
      )
    }

    return (
      <AppButton
        size="large"
        color="primary"
        onClick={handleSubmit}
        full
        text="Pay dividends"
      />
    )
  }, [handleSubmit, tokens, updateAllowance])

  const convertToDividendsButton = useMemo(() => {
    return (
      poolAddress &&
      proposalId && (
        <BlueButton onClick={() => convertToDividends(poolAddress, proposalId)}>
          Convert balance to dividends
        </BlueButton>
      )
    )
  }, [convertToDividends, poolAddress, proposalId])

  const form = (
    <>
      <DividendsInput
        tokens={tokens}
        onChange={handleFromChange}
        onSelect={openTokenSelect}
      />

      {/* <InfoCard gap="12">
        {proposalTVL}
        {APR}
        <InfoDropdown
          left={<InfoGrey>Last paid dividend</InfoGrey>}
          right={lastDividends}
        >
          {lastDividendsContent}
        </InfoDropdown>
      </InfoCard> */}
    </>
  )

  return (
    <>
      <Header>Withdraw funds</Header>
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* {form} */}
        <Exchange
          title="Pay dividends"
          form={form}
          buttons={[button, convertToDividendsButton]}
        />
      </Container>
      <TokenSelect
        allBalances={balances}
        balancesLoading={balancesIsLoading}
        allTokens={allTokens}
        onClose={handleModalClose}
        onSelect={onTokenSelect}
      />
    </>
  )
}

const PayDividendsWithProvider = () => {
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
      <ConvertToDividendsProvider>
        <PayDividends />
      </ConvertToDividendsProvider>
    </WithPoolAddressValidation>
  )
}

export default PayDividendsWithProvider
