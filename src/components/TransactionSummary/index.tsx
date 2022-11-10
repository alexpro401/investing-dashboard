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
  DepositInvestProposalTransactionInfo,
  StakeInsuranceTransactionInfo,
  UnstakeInsuranceTransactionInfo,
  InsuranceRegisterProposalClaimTransactionInfo,
  PrivacyPolicyAgreeTransactionInfo,
  TraderGetPerformanceFeeTransactionInfo,
  TransactionInfo,
  WithdrawInvestProposalTransactionInfo,
  SupplyInvestProposalTransactionInfo,
  ClaimInvestProposalTransactionInfo,
  ConvertInvestProposalToDividendsTransactionInfo,
  GovPoolCreateTransactionInfo,
  GovPoolDepositTransactionInfo,
  GovPoolCreateProposalTypeTransactionInfo,
  GovPoolCreateIntenalProposalTransactionInfo,
  GovPoolCreateValidatorProposalTransactionInfo,
  GovPoolCreateChangeDaoSettingsProposalTransactionInfo,
} from "state/transactions/types"
import { formatBigNumber } from "utils"
import { useERC20Data } from "state/erc20/hooks"
import { TradeType, UpdateListType } from "constants/types"
import { selectWhitelistItem } from "state/pricefeed/selectors"

import FormattedCurrencyAmount from "./FormattedCurrencyAmount"
import { usePoolQuery } from "hooks/usePool"

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
}> = ({ info }) => {
  const [token] = useERC20Data(info.token)
  return <>Successfully create Risky Proposal for {token?.symbol}</>
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
const DepositInvestProposalSummary: React.FC<{
  info: DepositInvestProposalTransactionInfo
}> = ({ info: { investLpAmountRaw } }) => {
  const amount = formatBigNumber(BigNumber.from(investLpAmountRaw))
  return <>Stake Invest Proposal LP2 tokens with {amount} LP tokens</>
}
const WithdrawInvestProposalSummary: React.FC<{
  info: WithdrawInvestProposalTransactionInfo
}> = ({ info: { amountRaw, symbol } }) => {
  const amount = formatBigNumber(BigNumber.from(amountRaw))
  return (
    <>
      Withdraw {amount} {symbol} from Invest Proposal
    </>
  )
}
const SupplyInvestProposalSummary: React.FC<{
  info: SupplyInvestProposalTransactionInfo
}> = ({ info: { amount } }) => {
  return <>Supply transaction completed. Tokens paid: {amount}</>
}
const ClaimInvestProposalSummary: React.FC<{
  info: ClaimInvestProposalTransactionInfo
}> = () => {
  return <>Claim invest proposal dividends</>
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

const InsuranceRegisterProposalClaimSummary: React.FC<{
  info: InsuranceRegisterProposalClaimTransactionInfo
}> = ({ info: { pool } }) => {
  const [poolData] = usePoolQuery(pool)

  return <>Created insurance proposal for &quot;{poolData?.name}&quot; pool</>
}

const PrivacyPolicyAgreeSummary: React.FC<{
  info: PrivacyPolicyAgreeTransactionInfo
}> = () => {
  return <>Successfully sign privacy policy.</>
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

const ConvertInvestProposalToDividendsSummary: React.FC<{
  info: ConvertInvestProposalToDividendsTransactionInfo
}> = () => {
  return <>Convert Invest Proposal balance to Dividends.</>
}

const GovPoolCreateSummary: React.FC<{
  info: GovPoolCreateTransactionInfo
}> = () => {
  return <>Create DAO pool.</>
}

const GovPoolDepositSummary: React.FC<{
  info: GovPoolDepositTransactionInfo
}> = () => {
  return <>Successfully deposited.</>
}

const GovPoolCreateProposalTypeSummary: React.FC<{
  info: GovPoolCreateProposalTypeTransactionInfo
}> = ({ info: { title } }) => {
  return <>Successfully created new proposal: {`"${title}"`}</>
}

const GovPoolCreateInternalProposal: React.FC<{
  info: GovPoolCreateIntenalProposalTransactionInfo
}> = ({ info }) => {
  return <>Successfully created new internal proposal</>
}

const GovPoolCreateValidatorProposal: React.FC<{
  info: GovPoolCreateValidatorProposalTransactionInfo
}> = ({ info }) => {
  return <>Successfully created new validator proposal</>
}

const GovPoolCreateChangeDaoSettingsProposal: React.FC<{
  info: GovPoolCreateChangeDaoSettingsProposalTransactionInfo
}> = ({ info }) => {
  return <>Successfully created new proposal for changing DAO settings</>
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
    case TransactionType.INVEST_PROPOSAL_INVEST:
      return <DepositInvestProposalSummary info={info} />
    case TransactionType.INVEST_PROPOSAL_WITHDRAW:
      return <WithdrawInvestProposalSummary info={info} />
    case TransactionType.INVEST_PROPOSAL_SUPPLY:
      return <SupplyInvestProposalSummary info={info} />
    case TransactionType.INVEST_PROPOSAL_CLAIM:
      return <ClaimInvestProposalSummary info={info} />
    case TransactionType.INSURANCE_STAKE:
      return <StakeInsuranceSummary info={info} />
    case TransactionType.INSURANCE_UNSTAKE:
      return <UnstakeInsuranceSummary info={info} />
    case TransactionType.INSURANCE_REGISTER_PROPOSAL_CLAIM:
      return <InsuranceRegisterProposalClaimSummary info={info} />
    case TransactionType.USER_AGREED_TO_PRIVACY_POLICY:
      return <PrivacyPolicyAgreeSummary info={info} />
    case TransactionType.TRADER_GET_PERFORMANCE_FEE:
      return <TraderGetPerformanceFeeSummary info={info} />
    case TransactionType.INVEST_PROPOSAL_CONVERT_TO_DIVIDENDS:
      return <ConvertInvestProposalToDividendsSummary info={info} />
    case TransactionType.GOV_POOL_CREATE:
      return <GovPoolCreateSummary info={info} />
    case TransactionType.GOV_POOL_DEPOSIT:
      return <GovPoolDepositSummary info={info} />
    case TransactionType.GOV_POOL_CREATE_PROPOSAL_TYPE:
      return <GovPoolCreateProposalTypeSummary info={info} />
    case TransactionType.GOV_POOL_CREATE_INTERNAL_PROPOSAL:
      return <GovPoolCreateInternalProposal info={info} />
    case TransactionType.GOV_POOL_CREATE_VALIDATOR_PROPOSAL:
      return <GovPoolCreateValidatorProposal info={info} />
    case TransactionType.GOV_POOL_CREATE_CHANGE_DAO_SETTINGS_PROPOSAL:
      return <GovPoolCreateChangeDaoSettingsProposal info={info} />
    default:
      return null
  }
}

export default TransactionSummary
