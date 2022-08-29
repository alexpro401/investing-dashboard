import { useSelector } from "react-redux"
import { BigNumber } from "@ethersproject/bignumber"

import {
  TransactionType,
  ApproveTransactionInfo,
  ExactInputSwapTransactionInfo,
  ExactOutputSwapTransactionInfo,
  DepositLiquidityTransactionInfo,
  WithdrawLiquidityTransactionInfo,
  FundCreateTransactionInfo,
  FundEditTransactionInfo,
  FundUpdateInvestorsTransactionInfo,
  FundUpdateManagersTransactionInfo,
  CreateRiskyProposalTransactionInfo,
  EditRiskyProposalTransactionInfo,
  DepositRiskyProposalTransactionInfo,
  WithdrawRiskyProposalTransactionInfo,
  SwapRiskyProposalTransactionInfo,
  CreateInvestmentProposalTransactionInfo,
  EditInvestProposalTransactionInfo,
  StakeInsuranceTransactionInfo,
  UnstakeInsuranceTransactionInfo,
  TraderGetPerformanceFeeTransactionInfo,
  TransactionInfo,
} from "state/transactions/types"
import { TradeType, UpdateListType } from "constants/types"

import FormattedCurrencyAmount from "./FormattedCurrencyAmount"

import { selectWhitelistItem } from "state/pricefeed/selectors"
import { formatBigNumber } from "utils"

interface IProps {
  info: TransactionInfo
}

const ApprovalSummary: React.FC<{ info: ApproveTransactionInfo }> = ({
  info: { tokenAddress },
}) => {
  const token = useSelector(selectWhitelistItem(tokenAddress))

  return <>Approve {token?.symbol}</>
}

const SwapSummaryInput: React.FC<{ info: ExactInputSwapTransactionInfo }> = ({
  info,
}) => {
  return (
    <>
      Swap from{" "}
      <FormattedCurrencyAmount
        rawAmount={info.inputCurrencyAmountRaw}
        rawCurrencyId={info.inputCurrencyId}
      />{" "}
      to{" "}
      <FormattedCurrencyAmount
        rawAmount={info.expectedOutputCurrencyAmountRaw}
        rawCurrencyId={info.outputCurrencyId}
      />
    </>
  )
}
const SwapSummaryOutput: React.FC<{ info: ExactOutputSwapTransactionInfo }> = ({
  info,
}) => {
  return (
    <>
      Swap from{" "}
      <FormattedCurrencyAmount
        rawAmount={info.outputCurrencyAmountRaw}
        rawCurrencyId={info.inputCurrencyId}
      />{" "}
      to{" "}
      <FormattedCurrencyAmount
        rawAmount={info.expectedInputCurrencyAmountRaw}
        rawCurrencyId={info.outputCurrencyId}
      />
    </>
  )
}

const SwapSummary: React.FC<{
  info: ExactInputSwapTransactionInfo | ExactOutputSwapTransactionInfo
}> = ({ info }) => {
  if (info.tradeType === TradeType.EXACT_INPUT) {
    return <SwapSummaryInput info={info} />
  } else {
    return <SwapSummaryOutput info={info} />
  }
}

const DepositLiquiditySummary: React.FC<{
  info: DepositLiquidityTransactionInfo
}> = ({ info: { currencyId, amount } }) => {
  return (
    <>
      Deposit liquidity{" "}
      <FormattedCurrencyAmount rawAmount={amount} rawCurrencyId={currencyId} />
    </>
  )
}

const WithdrawLiquiditySummary: React.FC<{
  info: WithdrawLiquidityTransactionInfo
}> = ({ info: { currencyId, amount } }) => {
  return (
    <>
      Withdraw liquidity{" "}
      <FormattedCurrencyAmount rawAmount={amount} rawCurrencyId={currencyId} />
    </>
  )
}

const FundCreateSummary: React.FC<{ info: FundCreateTransactionInfo }> = ({
  info: { fundName, baseCurrencyId },
}) => {
  const baseCurrency = useSelector(selectWhitelistItem(baseCurrencyId))

  return (
    <>
      Create &ldquo;{fundName}&rdquo; fund with {baseCurrency?.symbol} base
      currency.
    </>
  )
}

const FundEditSummary: React.FC<{ info: FundEditTransactionInfo }> = ({
  info: { fundName, baseCurrencyId },
}) => {
  const baseCurrency = useSelector(selectWhitelistItem(baseCurrencyId))

  return (
    <>
      Update &ldquo;{fundName}&rdquo; fund with {baseCurrency?.symbol} base
      currency.
    </>
  )
}

const FundUpdateUnvestorsSummary: React.FC<{
  info: FundUpdateInvestorsTransactionInfo
}> = ({ info }) => {
  const action = info.editType === UpdateListType.ADD ? "add" : "remove"
  return <>Successlully {action} investors</>
}

const FundUpdateManagersSummary: React.FC<{
  info: FundUpdateManagersTransactionInfo
}> = ({ info }) => {
  const action = info.editType === UpdateListType.ADD ? "add" : "remove"
  return <>Successlully {action} managers</>
}

const CredentialsUpdateSummary: React.FC = () => {
  return <>Successfully update Credentials</>
}

const CreateRiskyProposalSummary: React.FC<{
  info: CreateRiskyProposalTransactionInfo
}> = () => {
  return <>Successfully create Risky Proposal</>
}
const EditRiskyProposalSummary: React.FC<{
  info: EditRiskyProposalTransactionInfo
}> = () => {
  return <>Successfully update Risky Proposal</>
}
const DepositRiskyProposalSummary: React.FC<{
  info: DepositRiskyProposalTransactionInfo
}> = ({ info }) => {
  return (
    <>
      Deposit in risky proposal from{" "}
      <FormattedCurrencyAmount
        rawAmount={info.inputCurrencyAmountRaw}
        rawCurrencySymbol={info.inputCurrencySymbol}
      />{" "}
      to{" "}
      <FormattedCurrencyAmount
        rawAmount={info.expectedOutputCurrencyAmountRaw}
        rawCurrencySymbol={info.expectedOutputCurrencySymbol}
      />
    </>
  )
}
const WithdrawRiskyProposalSummary: React.FC<{
  info: WithdrawRiskyProposalTransactionInfo
}> = ({ info }) => {
  return (
    <>
      Withdraw from risky proposal from{" "}
      <FormattedCurrencyAmount
        rawAmount={info.outputCurrencyAmountRaw}
        rawCurrencySymbol={info.outputCurrencySymbol}
      />{" "}
      to{" "}
      <FormattedCurrencyAmount
        rawAmount={info.expectedInputCurrencyAmountRaw}
        rawCurrencySymbol={info.expectedInputCurrencySymbol}
      />
    </>
  )
}
const SwapRiskyProposalSummary: React.FC<{
  info: SwapRiskyProposalTransactionInfo
}> = ({ info }) => {
  return (
    <>
      Swap in risky proposal from{" "}
      <FormattedCurrencyAmount
        rawAmount={info.inputCurrencyAmountRaw}
        rawCurrencyId={info.inputCurrencyId}
      />{" "}
      to{" "}
      <FormattedCurrencyAmount
        rawAmount={info.expectedOutputCurrencyAmountRaw}
        rawCurrencyId={info.outputCurrencyId}
      />
    </>
  )
}

const CreateInvestmentProposalSummary: React.FC<{
  info: CreateInvestmentProposalTransactionInfo
}> = ({ info: { investLpAmountRaw } }) => {
  const amount = formatBigNumber(BigNumber.from(investLpAmountRaw))
  return <>Create Invest Proposal for {amount} LP tokens</>
}
const EditInvestProposalSummary: React.FC<{
  info: EditInvestProposalTransactionInfo
}> = ({ info: { investLpAmountRaw } }) => {
  const amount = formatBigNumber(BigNumber.from(investLpAmountRaw))
  return <>Update Invest Proposal with {amount} of LP tokens</>
}

const StakeInsuranceSummary: React.FC<{
  info: StakeInsuranceTransactionInfo
}> = ({ info: { amount } }) => {
  const fromAmount = formatBigNumber(BigNumber.from(amount))

  return <>Stake insurance {fromAmount} DEXE</>
}

const UnstakeInsuranceSummary: React.FC<{
  info: UnstakeInsuranceTransactionInfo
}> = ({ info: { amount } }) => {
  const toAmount = formatBigNumber(BigNumber.from(amount))

  return <>Unstake insurance {toAmount} DEXE-LP</>
}

const TraderGetPerformanceFeeSummary: React.FC<{
  info: TraderGetPerformanceFeeTransactionInfo
}> = ({ info: { baseAmount, _baseTokenSymbol } }) => {
  return (
    <>
      Withdraw commission {formatBigNumber(baseAmount, 18, 6)}{" "}
      {_baseTokenSymbol}.
    </>
  )
}

const TransactionSummary: React.FC<IProps> = ({ info }) => {
  switch (info.type) {
    case TransactionType.APPROVAL:
      return <ApprovalSummary info={info} />
    case TransactionType.SWAP:
      return <SwapSummary info={info} />
    case TransactionType.INVEST:
      return <DepositLiquiditySummary info={info} />
    case TransactionType.DIVEST:
      return <WithdrawLiquiditySummary info={info} />
    case TransactionType.POOL_CREATE:
      return <FundCreateSummary info={info} />
    case TransactionType.POOL_EDIT:
      return <FundEditSummary info={info} />
    case TransactionType.POOL_UPDATE_INVESTORS:
      return <FundUpdateUnvestorsSummary info={info} />
    case TransactionType.POOL_UPDATE_MANAGERS:
      return <FundUpdateManagersSummary info={info} />
    case TransactionType.UPDATED_USER_CREDENTIALS:
      return <CredentialsUpdateSummary />
    case TransactionType.RISKY_PROPOSAL_CREATE:
      return <CreateRiskyProposalSummary info={info} />
    case TransactionType.RISKY_PROPOSAL_EDIT:
      return <EditRiskyProposalSummary info={info} />
    case TransactionType.RISKY_PROPOSAL_INVEST:
      return <DepositRiskyProposalSummary info={info} />
    case TransactionType.RISKY_PROPOSAL_DIVEST:
      return <WithdrawRiskyProposalSummary info={info} />
    case TransactionType.RISKY_PROPOSAL_SWAP:
      return <SwapRiskyProposalSummary info={info} />
    case TransactionType.INVEST_PROPOSAL_CREATE:
      return <CreateInvestmentProposalSummary info={info} />
    case TransactionType.INVEST_PROPOSAL_EDIT:
      return <EditInvestProposalSummary info={info} />
    case TransactionType.INSURANCE_STAKE:
      return <StakeInsuranceSummary info={info} />
    case TransactionType.INSURANCE_UNSTAKE:
      return <UnstakeInsuranceSummary info={info} />
    case TransactionType.TRADER_GET_PERFORMANCE_FEE:
      return <TraderGetPerformanceFeeSummary info={info} />

    default:
      return null
  }
}

export default TransactionSummary
