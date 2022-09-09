import { Flex } from "theme"
import { useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { createClient, Provider as GraphProvider } from "urql"

import IconButton from "components/IconButton"
import DividendsInput from "components/Exchange/DividendsInput"
import ExchangeDivider from "components/Exchange/Divider"
import Button, { SecondaryButton } from "components/Button"
import CircularProgress from "components/CircularProgress"
import Header from "components/Header/Layout"
import TokenSelect from "modals/TokenSelect"
import LockedIcon from "assets/icons/LockedIcon"

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

import usePayDividends from "./usePayDividends"
import { Token } from "interfaces"

const poolsClient = createClient({
  url: process.env.REACT_APP_ALL_POOLS_API_URL || "",
})

function PayDividends() {
  const { poolAddress, proposalId } = useParams()
  const [isOpen, setTokenSelectOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const [
    { tokens },
    {
      handleFromChange,
      handleSubmit,
      handleDividendTokenSelect,
      updateAllowance,
    },
  ] = usePayDividends(poolAddress, proposalId)

  const openTokenSelect = (index: number) => {
    setTokenSelectOpen(true)
    setActiveIndex(index)
  }

  const closeTokenSelect = () => {
    setTokenSelectOpen(false)
  }

  const onTokenSelect = (token: Token) => {
    handleDividendTokenSelect(token, activeIndex)
  }

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
  }, [handleSubmit, tokens])

  const lastDividends = useMemo(() => {
    return (
      <Flex gap="4">
        <InfoGrey>0 DEXE</InfoGrey>
      </Flex>
    )
  }, [])

  const lastDividendsContent = useMemo(() => {
    return (
      <>
        <InfoRow>
          <InfoGrey>Feb 12,2021</InfoGrey>
          <Flex gap="4">
            <InfoWhite>0</InfoWhite>
            <InfoGrey>DEXE</InfoGrey>
          </Flex>
        </InfoRow>
      </>
    )
  }, [])

  const proposalTVL = useMemo(() => {
    return (
      <InfoRow>
        <InfoGrey>Proposal TVL</InfoGrey>
        <Flex gap="4">
          <InfoWhite>0 DEXE</InfoWhite>
          <InfoGrey>($0)</InfoGrey>
        </Flex>
      </InfoRow>
    )
  }, [])

  const APR = useMemo(() => {
    return (
      <InfoRow>
        <InfoGrey>APR after dividend</InfoGrey>
        <Flex gap="4">
          <InfoWhite>13.32%</InfoWhite>
          <InfoGrey>($134)</InfoGrey>
        </Flex>
      </InfoRow>
    )
  }, [])

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
          left={<InfoGrey>Last paid dividend Jun 12,2022</InfoGrey>}
          right={lastDividends}
        >
          {lastDividendsContent}
        </InfoDropdown>
      </InfoCard>
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
        onSelect={onTokenSelect}
        isOpen={isOpen}
        onClose={closeTokenSelect}
      />
    </>
  )
}

const PayDividendsWithProvider = () => {
  return (
    <GraphProvider value={poolsClient}>
      <PayDividends />
    </GraphProvider>
  )
}

export default PayDividendsWithProvider
