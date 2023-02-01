import { useCallback, useMemo } from "react"
import { useParams } from "react-router-dom"
import { BigNumber } from "@ethersproject/bignumber"

import { Center, Flex } from "theme"
import SwapPrice from "components/SwapPrice"
import Header from "components/Header/Layout"
import ExchangeDivider from "components/Exchange/Divider"
import { AppButton } from "common"
import ExchangeInput from "components/Exchange/ExchangeInput"

import { useUserAgreement } from "state/user/hooks"

import {
  Container,
  InfoRow,
  InfoGrey,
  InfoWhite,
} from "components/Exchange/styled"

import useWithdrawInvestmentProposal from "./useWithdrawInvestmentProposal"
import WithPoolAddressValidation from "components/WithPoolAddressValidation"
import { GuardSpinner } from "react-spinners-kit"
import { Exchange } from "components/Exchange"
import { Info } from "components/InfoAccordion"

function WithdrawInvestmentProposal() {
  const { poolAddress, proposalId } = useParams()
  const [
    {
      info,
      form: { from, to },
      gasPrice,
      baseTokenPrice,
    },
    { handleFromChange, handleSubmit, handlePercentageChange },
  ] = useWithdrawInvestmentProposal(poolAddress, proposalId)

  const [{ agreed }, { setShowAgreement }] = useUserAgreement()

  const onSubmit = useCallback(() => {
    agreed ? handleSubmit() : setShowAgreement(true)
  }, [agreed, handleSubmit, setShowAgreement])

  const button = useMemo(() => {
    if (from.amount === "0") {
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

    if (BigNumber.from(from.amount).gt(from.balance)) {
      return (
        <AppButton
          disabled
          size="large"
          color="secondary"
          onClick={() => {}}
          text="Inuficient funds"
          full
        />
      )
    }

    return (
      <AppButton
        size="large"
        color="primary"
        onClick={onSubmit}
        text="Confirm withdraw"
        full
      />
    )
  }, [onSubmit, from.amount, from.balance])

  const lastWithdrawContent = useMemo(() => {
    return info.withdrawals.map((withdraw) => (
      <InfoRow key={withdraw.id}>
        <InfoGrey>{withdraw.date}</InfoGrey>
        <Flex gap="4">
          <InfoWhite>{withdraw.amount}</InfoWhite>
          <InfoGrey>{from.symbol}</InfoGrey>
        </Flex>
      </InfoRow>
    ))
  }, [from.symbol, info.withdrawals])

  const form = (
    <>
      <ExchangeInput
        price={from.price}
        amount={from.amount}
        balance={from.balance}
        address={from.address}
        symbol={from.symbol}
        customIcon={from.icon}
        decimal={from.decimals}
        onChange={handleFromChange}
      />

      <ExchangeDivider changeAmount={handlePercentageChange} />

      <ExchangeInput
        price={to.price}
        amount={to.amount}
        balance={to.balance}
        address={to.address}
        symbol={to.symbol}
        customIcon={to.icon}
        decimal={to.decimals}
        customBalance={<InfoGrey>My address wallet</InfoGrey>}
      />
    </>
  )

  const withdrawInfo: Info[] = useMemo(() => {
    return [
      {
        title: "Fullness",
        value: `${info.tvl.current} ${from.symbol} / ${info.tvl.max} ${from.symbol}`,
        tooltip: "Current fullness of the pool",
      },
      {
        title: "Average LP price",
        value: `${info.avgPriceLP.base} ${from.symbol} = ${info.avgPriceLP.usd} USD`,
        tooltip: "Average price of LP tokens in USD",
      },
      {
        title: "Expiration date",
        value: info.expirationDate,
        tooltip: "Date when the pool will be closed",
      },
      {
        title: "Last withdraw",
        value: info.withdrawals.length ? info.withdrawals[0].date : "-",
        tooltip: "Date of the last withdraw",
        childrens: lastWithdrawContent,
      },
    ]
  }, [
    from.symbol,
    info.avgPriceLP.base,
    info.avgPriceLP.usd,
    info.expirationDate,
    info.tvl,
    info.withdrawals,
    lastWithdrawContent,
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
          title="Withdraw to address"
          info={withdrawInfo}
          form={form}
          buttons={[button]}
        >
          <SwapPrice
            gasPrice={gasPrice}
            toSymbol={from.symbol}
            fromSymbol="USD"
            tokensCost={baseTokenPrice}
          />
        </Exchange>
      </Container>
    </>
  )
}

const WithdrawInvestmentProposalWithProvider = () => {
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
      <WithdrawInvestmentProposal />
    </WithPoolAddressValidation>
  )
}

export default WithdrawInvestmentProposalWithProvider
