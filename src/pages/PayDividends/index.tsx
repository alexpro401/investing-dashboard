import { Center, Flex } from "theme"
import { useCallback, useMemo, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useWeb3React } from "@web3-react/core"
import format from "date-fns/format"
import { Currency } from "lib/entities"
import { GuardSpinner } from "react-spinners-kit"
import formatDistanceToNow from "date-fns/formatDistanceToNow"

import { DATE_TIME_FORMAT } from "consts/time"

import { useAllTokenBalances } from "hooks/useBalance"
import { useAllTokens } from "hooks/useToken"

import { AppButton } from "common"
import { ICON_NAMES } from "consts/icon-names"
import ExternalLink from "components/ExternalLink"
import WithPoolAddressValidation from "components/WithPoolAddressValidation"
import DividendsInput from "components/Exchange/DividendsInput"
import Header from "components/Header/Layout"
import { Exchange } from "components/Exchange"
import { Info } from "components/InfoAccordion"
import TokenSelect from "modals/TokenSelect"
import useConvertToDividendsContext, {
  ConvertToDividendsProvider,
} from "modals/ConvertToDividends/useConvertToDividendsContext"

import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"

import {
  Container,
  InfoRow,
  InfoGrey,
  BlueButton,
} from "components/Exchange/styled"

import usePayDividends from "./usePayDividends"

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
    if (!supplies || !supplies.length) return "-"

    return `${formatDistanceToNow(
      new Date(Number(supplies[0].timestamp) * 1000)
    )} ago`
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
    </>
  )

  const exchangeInfo: Info[] = useMemo(() => {
    return [
      {
        title: "Proposal TVL",
        value: `${info.tvl.base} ${info.ticker} ($${info.tvl.usd})`,
        tooltip:
          "Proposal TVL is the total value of all tokens in the proposal",
      },
      {
        title: "APR after dividend",
        value: `${info.APR.percent}% ($${info.APR.usd})`,
        tooltip:
          "APR after dividend is the annual percentage rate of the proposal after paying dividends",
      },
      {
        title: "Last paid dividend",
        value: lastDividends,
        tooltip: "Last paid dividend is the date of the last dividend payment",
        childrens: lastDividendsContent,
      },
    ]
  }, [
    info.APR.percent,
    info.APR.usd,
    info.ticker,
    info.tvl.base,
    info.tvl.usd,
    lastDividends,
    lastDividendsContent,
  ])

  return (
    <>
      <Header>Withdraw funds</Header>
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Exchange
          title="Pay dividends"
          form={form}
          buttons={[button, convertToDividendsButton]}
          info={exchangeInfo}
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
