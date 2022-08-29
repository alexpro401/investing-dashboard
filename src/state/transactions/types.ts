import { BigNumber } from "@ethersproject/bignumber"
import { TradeType, UpdateListType } from "constants/types"

interface SerializableTransactionReceipt {
  to: string
  from: string
  contractAddress: string
  transactionIndex: number
  blockHash: string
  transactionHash: string
  blockNumber: number
  status?: number
}

export enum TransactionType {
  APPROVAL = 0,
  SWAP = 1,
  INVEST = 2, // deposit liquidity staking
  DIVEST = 3, // withdraw liquidity staking

  POOL_CREATE = 4,
  POOL_EDIT = 5,
  POOL_UPDATE_MANAGERS = 6,
  POOL_UPDATE_INVESTORS = 7,

  UPDATED_USER_CREDENTIALS = 8,

  RISKY_PROPOSAL_CREATE = 9,
  RISKY_PROPOSAL_EDIT = 10,
  RISKY_PROPOSAL_INVEST = 11,
  RISKY_PROPOSAL_DIVEST = 12,
  RISKY_PROPOSAL_SWAP = 13,

  INVEST_PROPOSAL_CREATE = 14,
  INVEST_PROPOSAL_EDIT = 15,
  INVEST_PROPOSAL_INVEST = 16,
  INVEST_PROPOSAL_WITHDRAW = 17,
  INVEST_PROPOSAL_SUPPLY = 18,
  INVEST_PROPOSAL_CLAIM = 19,

  INSURANCE_STAKE = 20,
  INSURANCE_UNSTAKE = 21,

  INSURANCE_REGISTER_PROPOSAL_CLAIM = 22,

  TRADER_GET_PERFORMANCE_FEE = 23,
  USER_AGREED_TO_PRIVACY_POLICY = 24,
}

export interface ApproveTransactionInfo {
  type: TransactionType.APPROVAL
  tokenAddress: string
  spender: string
}

export interface DepositLiquidityTransactionInfo {
  type: TransactionType.INVEST
  currencyId: string
  poolAddress: string
  amount: string
}

export interface WithdrawLiquidityTransactionInfo {
  type: TransactionType.DIVEST
  currencyId: string
  poolAddress: string
  amount: string
}

interface BaseSwapTransactionInfo {
  type: TransactionType.SWAP
  tradeType: TradeType
  inputCurrencyId: string
  outputCurrencyId: string
}

export interface ExactInputSwapTransactionInfo extends BaseSwapTransactionInfo {
  tradeType: TradeType.EXACT_INPUT
  inputCurrencyAmountRaw: string
  expectedOutputCurrencyAmountRaw: string
  minimumOutputCurrencyAmountRaw: string
}
export interface ExactOutputSwapTransactionInfo
  extends BaseSwapTransactionInfo {
  tradeType: TradeType.EXACT_OUTPUT
  outputCurrencyAmountRaw: string
  expectedInputCurrencyAmountRaw: string
  maximumInputCurrencyAmountRaw: string
}

export interface FundCreateTransactionInfo {
  type: TransactionType.POOL_CREATE
  baseCurrencyId: string
  fundName: string
}

export interface FundEditTransactionInfo {
  type: TransactionType.POOL_EDIT
  baseCurrencyId: string
  fundName: string
}
export interface FundUpdateManagersTransactionInfo {
  type: TransactionType.POOL_UPDATE_MANAGERS
  editType: UpdateListType
  poolId: string
}
export interface FundUpdateInvestorsTransactionInfo {
  type: TransactionType.POOL_UPDATE_INVESTORS
  editType: UpdateListType
  poolId: string
}

export interface UpdateCredentialsTransactionInfo {
  type: TransactionType.UPDATED_USER_CREDENTIALS
}

export interface CreateRiskyProposalTransactionInfo {
  type: TransactionType.RISKY_PROPOSAL_CREATE
}
export interface EditRiskyProposalTransactionInfo {
  type: TransactionType.RISKY_PROPOSAL_EDIT
}
export interface DepositRiskyProposalTransactionInfo {
  type: TransactionType.RISKY_PROPOSAL_INVEST
  inputCurrencyAmountRaw: string
  inputCurrencySymbol: string
  expectedOutputCurrencyAmountRaw: string
  expectedOutputCurrencySymbol: string
}
export interface WithdrawRiskyProposalTransactionInfo {
  type: TransactionType.RISKY_PROPOSAL_DIVEST
  outputCurrencyAmountRaw: string
  outputCurrencySymbol: string
  expectedInputCurrencyAmountRaw: string
  expectedInputCurrencySymbol: string
}
export interface SwapRiskyProposalTransactionInfo {
  type: TransactionType.RISKY_PROPOSAL_SWAP
  tradeType: TradeType
  inputCurrencyId: string
  inputCurrencyAmountRaw: string
  expectedOutputCurrencyAmountRaw: string
  outputCurrencyId: string
  minimumOutputCurrencyAmountRaw: string
}

export interface CreateInvestmentProposalTransactionInfo {
  type: TransactionType.INVEST_PROPOSAL_CREATE
  amount: string
  ipfsPath: string
  investLpAmountRaw: string
}
export interface EditInvestProposalTransactionInfo {
  type: TransactionType.INVEST_PROPOSAL_EDIT
  amount: string
  ipfsPath: string
  investLpAmountRaw: string
}

export interface StakeInsuranceTransactionInfo {
  type: TransactionType.INSURANCE_STAKE
  amount: number
}

export interface UnstakeInsuranceTransactionInfo {
  type: TransactionType.INSURANCE_UNSTAKE
  amount: number
}

interface TraderGetPerformanceFee_UI {
  _baseTokenSymbol: string
}
export interface TraderGetPerformanceFee {
  baseAmount: BigNumber
  lpAmount: BigNumber
}
export interface TraderGetPerformanceFeeTransactionInfo
  extends TraderGetPerformanceFee,
    TraderGetPerformanceFee_UI {
  type: TransactionType.TRADER_GET_PERFORMANCE_FEE
}

export type TransactionInfo =
  | ApproveTransactionInfo
  | DepositLiquidityTransactionInfo
  | WithdrawLiquidityTransactionInfo
  | ExactInputSwapTransactionInfo
  | ExactOutputSwapTransactionInfo
  | FundCreateTransactionInfo
  | FundEditTransactionInfo
  | FundUpdateManagersTransactionInfo
  | FundUpdateInvestorsTransactionInfo
  | UpdateCredentialsTransactionInfo
  | CreateRiskyProposalTransactionInfo
  | EditRiskyProposalTransactionInfo
  | DepositRiskyProposalTransactionInfo
  | WithdrawRiskyProposalTransactionInfo
  | SwapRiskyProposalTransactionInfo
  | CreateInvestmentProposalTransactionInfo
  | EditInvestProposalTransactionInfo
  | StakeInsuranceTransactionInfo
  | UnstakeInsuranceTransactionInfo
  | TraderGetPerformanceFeeTransactionInfo

export interface TransactionDetails {
  hash: string
  receipt?: SerializableTransactionReceipt
  lastCheckedBlockNumber?: number
  addedTime: number
  confirmedTime?: number
  from: string
  info: TransactionInfo
}
