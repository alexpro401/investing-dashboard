import { Flex } from "theme"
import { useCallback, useMemo, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { createClient, Provider as GraphProvider } from "urql"
import { useWeb3React } from "@web3-react/core"
import format from "date-fns/format"
import formatDistanceToNow from "date-fns/formatDistanceToNow"

import { Token } from "interfaces"
import { DATE_TIME_FORMAT } from "constants/time"

import ExternalLink from "components/ExternalLink"
import IconButton from "components/IconButton"
import DividendsInput from "components/Exchange/DividendsInput"
import Button, { SecondaryButton } from "components/Button"
import CircularProgress from "components/CircularProgress"
import Header from "components/Header/Layout"
import TokenSelect from "modals/TokenSelect"
import LockedIcon from "assets/icons/LockedIcon"

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

const investPoolClient = createClient({
  url: process.env.REACT_APP_INVEST_POOLS_API_URL || "",
})

function PayDividends() {
  const { chainId } = useWeb3React()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { poolAddress, proposalId } = useParams()
  const [isOpen, setTokenSelectOpen] = useState(false)
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

  // TODO: check terms and conditions agreement
  const button = useMemo(() => {
    const inufficientTokens = tokens.filter((token) =>
      token.balance.lt(token.amount)
    )

    if (inufficientTokens.length) {
      return (
        <SecondaryButton theme="disabled" size="large" fz={22} full>
          insufficient balance
        </SecondaryButton>
      )
    }

    const lockedTokens = tokens.filter((token) =>
      token.allowance.lt(token.amount)
    )

    if (lockedTokens.length) {
      return (
        <SecondaryButton
          size="large"
          onClick={() => updateAllowance(lockedTokens[0].data.address)}
          fz={22}
          full
        >
          <Flex>
            <Flex ai="center">Unlock Token {lockedTokens[0].data.symbol}</Flex>
            <Flex m="-3px 0 0 4px">
              <LockedIcon />
            </Flex>
          </Flex>
        </SecondaryButton>
      )
    }

    const disabled =
      tokens.filter((token) => token.amount.isZero()).length === tokens.length

    if (disabled) {
      return (
        <SecondaryButton theme="disabled" size="large" fz={22} full>
          Enter amount
        </SecondaryButton>
      )
    }

    return (
      <Button size="large" theme="primary" onClick={handleSubmit} fz={22} full>
        Pay dividends
      </Button>
    )
  }, [handleSubmit, tokens, updateAllowance])

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

  const form = (
    <Card>
      <CardHeader>
        <Flex>
          <Title active>Pay dividends</Title>
        </Flex>
        <IconsGroup>
          <CircularProgress />
          <IconButton size={10} filled media={close} onClick={() => {}} />
        </IconsGroup>
      </CardHeader>

      <DividendsInput
        tokens={tokens}
        onChange={handleFromChange}
        onSelect={openTokenSelect}
      />

      <Flex full p="16px 0 0">
        {button}
      </Flex>

      <InfoCard gap="12">
        {proposalTVL}
        {APR}
        <InfoDropdown
          left={<InfoGrey>Last paid dividend</InfoGrey>}
          right={lastDividends}
        >
          {lastDividendsContent}
        </InfoDropdown>
      </InfoCard>

      <Flex p="16px 0 0">
        {poolAddress && proposalId && (
          <BlueButton
            onClick={() => convertToDividends(poolAddress, proposalId)}
          >
            Convert balance to dividends
          </BlueButton>
        )}
      </Flex>
    </Card>
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
        {form}
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
  return (
    <GraphProvider value={investPoolClient}>
      <ConvertToDividendsProvider>
        <PayDividends />
      </ConvertToDividendsProvider>
    </GraphProvider>
  )
}

export default PayDividendsWithProvider
