import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from "ethers"
import { EthersContractContextV5 } from "ethereum-abi-types-generator"
import { RiskyProposalLimitsRequest } from "./ProposalLimits"

export type ContractContext = EthersContractContextV5<
  TraderPoolRiskyProposal,
  TraderPoolRiskyProposalMethodNames,
  TraderPoolRiskyProposalEventsContext,
  TraderPoolRiskyProposalEvents
>

export declare type EventFilter = {
  address?: string
  topics?: Array<string>
  fromBlock?: string | number
  toBlock?: string | number
}

export interface ContractTransactionOverrides {
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number
  /**
   * The price (in wei) per unit of gas
   */
  gasPrice?: BigNumber | string | number | Promise<any>
  /**
   * The nonce to use in the transaction
   */
  nonce?: number
  /**
   * The amount to send with the transaction (i.e. msg.value)
   */
  value?: BigNumber | string | number | Promise<any>
  /**
   * The chain ID (or network ID) to use
   */
  chainId?: number
}

export interface ContractCallOverrides {
  /**
   * The address to execute the call as
   */
  from?: string
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number
}
export type TraderPoolRiskyProposalEvents =
  | "ApprovalForAll"
  | "ProposalActivePortfolioExchanged"
  | "ProposalCreated"
  | "ProposalDivested"
  | "ProposalExchanged"
  | "ProposalInvested"
  | "ProposalInvestorAdded"
  | "ProposalInvestorRemoved"
  | "ProposalPositionClosed"
  | "ProposalRestrictionsChanged"
  | "TransferBatch"
  | "TransferSingle"
  | "URI"
export interface TraderPoolRiskyProposalEventsContext {
  ApprovalForAll(...parameters: any): EventFilter
  ProposalActivePortfolioExchanged(...parameters: any): EventFilter
  ProposalCreated(...parameters: any): EventFilter
  ProposalDivested(...parameters: any): EventFilter
  ProposalExchanged(...parameters: any): EventFilter
  ProposalInvested(...parameters: any): EventFilter
  ProposalInvestorAdded(...parameters: any): EventFilter
  ProposalInvestorRemoved(...parameters: any): EventFilter
  ProposalPositionClosed(...parameters: any): EventFilter
  ProposalRestrictionsChanged(...parameters: any): EventFilter
  TransferBatch(...parameters: any): EventFilter
  TransferSingle(...parameters: any): EventFilter
  URI(...parameters: any): EventFilter
}
export type TraderPoolRiskyProposalMethodNames =
  | "__TraderPoolProposal_init"
  | "__TraderPoolRiskyProposal_init"
  | "balanceOf"
  | "balanceOfBatch"
  | "changeProposalRestrictions"
  | "create"
  | "divest"
  | "exchange"
  | "exists"
  | "getActiveInvestmentsInfo"
  | "getBaseToken"
  | "getCreationTokens"
  | "getDivestAmounts"
  | "getExchangeAmount"
  | "getInjector"
  | "getInvestTokens"
  | "getInvestedBaseInUSD"
  | "getInvestmentPercentage"
  | "getProposalInfos"
  | "getTotalActiveInvestments"
  | "getUserInvestmentsLimits"
  | "invest"
  | "investedBase"
  | "isApprovedForAll"
  | "priceFeed"
  | "proposalsTotalNum"
  | "safeBatchTransferFrom"
  | "safeTransferFrom"
  | "setApprovalForAll"
  | "setDependencies"
  | "setInjector"
  | "supportsInterface"
  | "totalLPBalances"
  | "totalLockedLP"
  | "totalSupply"
  | "uri"
export interface ApprovalForAllEventEmittedResponse {
  account: string
  operator: string
  approved: boolean
}
export interface ProposalActivePortfolioExchangedEventEmittedResponse {
  proposalId: BigNumberish
  fromToken: string
  toToken: string
  fromVolume: BigNumberish
  toVolume: BigNumberish
}
export interface ProposalCreatedEventEmittedResponse {
  proposalId: BigNumberish
  token: string
  proposalLimits: RiskyProposalLimitsRequest
}
export interface ProposalDivestedEventEmittedResponse {
  proposalId: BigNumberish
  user: string
  divestedLP2: BigNumberish
  receivedLP: BigNumberish
  receivedBase: BigNumberish
}
export interface ProposalExchangedEventEmittedResponse {
  proposalId: BigNumberish
  sender: string
  fromToken: string
  toToken: string
  fromVolume: BigNumberish
  toVolume: BigNumberish
}
export interface ProposalInvestedEventEmittedResponse {
  proposalId: BigNumberish
  user: string
  investedLP: BigNumberish
  investedBase: BigNumberish
  receivedLP2: BigNumberish
}
export interface ProposalInvestorAddedEventEmittedResponse {
  proposalId: BigNumberish
  investor: string
}
export interface ProposalInvestorRemovedEventEmittedResponse {
  proposalId: BigNumberish
  investor: string
}
export interface ProposalPositionClosedEventEmittedResponse {
  proposalId: BigNumberish
  positionToken: string
}
export interface ProposalRestrictionsChangedEventEmittedResponse {
  proposalId: BigNumberish
  sender: string
}
export interface TransferBatchEventEmittedResponse {
  operator: string
  from: string
  to: string
  ids: BigNumberish[]
  values: BigNumberish[]
}
export interface TransferSingleEventEmittedResponse {
  operator: string
  from: string
  to: string
  id: BigNumberish
  value: BigNumberish
}
export interface URIEventEmittedResponse {
  value: string
  id: BigNumberish
}
export interface __TraderPoolProposal_initRequest {
  parentPoolAddress: string
  trader: string
  baseToken: string
  baseTokenDecimals: BigNumberish
}
export interface __TraderPoolRiskyProposal_initRequest {
  parentPoolAddress: string
  trader: string
  baseToken: string
  baseTokenDecimals: BigNumberish
}
export interface ChangeProposalRestrictionsRequest {
  timestampLimit: BigNumberish
  investLPLimit: BigNumberish
  maxTokenPriceLimit: BigNumberish
}
export interface CreateRequest {
  timestampLimit: BigNumberish
  investLPLimit: BigNumberish
  maxTokenPriceLimit: BigNumberish
}
export interface InvestmentsResponse {
  proposalId: BigNumber
  0: BigNumber
  lp2Balance: BigNumber
  1: BigNumber
  baseInvested: BigNumber
  2: BigNumber
  lpInvested: BigNumber
  3: BigNumber
  baseShare: BigNumber
  4: BigNumber
  positionShare: BigNumber
  5: BigNumber
}
export interface GetCreationTokensResponse {
  positionTokens: BigNumber
  0: BigNumber
  positionTokenPrice: BigNumber
  1: BigNumber
  path: string[]
  2: string[]
  length: 3
}
export interface ReceptionsResponse {
  baseAmount: BigNumber
  0: BigNumber
  positions: string[]
  1: string[]
  givenAmounts: BigNumber[]
  2: BigNumber[]
  receivedAmounts: BigNumber[]
  3: BigNumber[]
}
export interface GetExchangeAmountResponse {
  result0: BigNumber
  0: BigNumber
  result1: string[]
  1: string[]
  length: 2
}
export interface GetInvestTokensResponse {
  baseAmount: BigNumber
  0: BigNumber
  positionAmount: BigNumber
  1: BigNumber
  lp2Amount: BigNumber
  2: BigNumber
  length: 3
}
export interface ProposalLimitsResponse {
  timestampLimit: BigNumber
  0: BigNumber
  investLPLimit: BigNumber
  1: BigNumber
  maxTokenPriceLimit: BigNumber
  2: BigNumber
}
export interface ProposalInfoResponse {
  token: string
  0: ProposalInfoResponse
  tokenDecimals: BigNumber
  1: ProposalInfoResponse
  proposalLimits: ProposalLimitsResponse
  2: ProposalInfoResponse
  lpLocked: BigNumber
  3: ProposalInfoResponse
  balanceBase: BigNumber
  4: ProposalInfoResponse
  balancePosition: BigNumber
  5: ProposalInfoResponse
}
export interface ProposalsResponse {
  proposalInfo: ProposalInfoResponse
  0: ProposalInfoResponse
  totalProposalUSD: BigNumber
  1: BigNumber
  totalProposalBase: BigNumber
  2: BigNumber
  lp2Supply: BigNumber
  3: BigNumber
  totalInvestors: BigNumber
  4: BigNumber
  positionTokenPrice: BigNumber
  5: BigNumber
}
export interface TraderPoolRiskyProposal {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param parentTraderPoolInfo Type: tuple, Indexed: false
   */
  __TraderPoolProposal_init(
    parentTraderPoolInfo: __TraderPoolProposal_initRequest,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param parentTraderPoolInfo Type: tuple, Indexed: false
   */
  __TraderPoolRiskyProposal_init(
    parentTraderPoolInfo: __TraderPoolRiskyProposal_initRequest,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param account Type: address, Indexed: false
   * @param id Type: uint256, Indexed: false
   */
  balanceOf(
    account: string,
    id: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param accounts Type: address[], Indexed: false
   * @param ids Type: uint256[], Indexed: false
   */
  balanceOfBatch(
    accounts: string[],
    ids: BigNumberish[],
    overrides?: ContractCallOverrides
  ): Promise<BigNumber[]>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param proposalId Type: uint256, Indexed: false
   * @param proposalLimits Type: tuple, Indexed: false
   */
  changeProposalRestrictions(
    proposalId: BigNumberish,
    proposalLimits: ChangeProposalRestrictionsRequest,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param token Type: address, Indexed: false
   * @param proposalLimits Type: tuple, Indexed: false
   * @param lpInvestment Type: uint256, Indexed: false
   * @param baseInvestment Type: uint256, Indexed: false
   * @param instantTradePercentage Type: uint256, Indexed: false
   * @param minPositionOut Type: uint256, Indexed: false
   * @param optionalPath Type: address[], Indexed: false
   */
  create(
    token: string,
    proposalLimits: CreateRequest,
    lpInvestment: BigNumberish,
    baseInvestment: BigNumberish,
    instantTradePercentage: BigNumberish,
    minPositionOut: BigNumberish,
    optionalPath: string[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param proposalId Type: uint256, Indexed: false
   * @param user Type: address, Indexed: false
   * @param lp2 Type: uint256, Indexed: false
   * @param minPositionOut Type: uint256, Indexed: false
   */
  divest(
    proposalId: BigNumberish,
    user: string,
    lp2: BigNumberish,
    minPositionOut: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param proposalId Type: uint256, Indexed: false
   * @param from Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   * @param amountBound Type: uint256, Indexed: false
   * @param optionalPath Type: address[], Indexed: false
   * @param exType Type: uint8, Indexed: false
   */
  exchange(
    proposalId: BigNumberish,
    from: string,
    amount: BigNumberish,
    amountBound: BigNumberish,
    optionalPath: string[],
    exType: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param id Type: uint256, Indexed: false
   */
  exists(id: BigNumberish, overrides?: ContractCallOverrides): Promise<boolean>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param user Type: address, Indexed: false
   * @param offset Type: uint256, Indexed: false
   * @param limit Type: uint256, Indexed: false
   */
  getActiveInvestmentsInfo(
    user: string,
    offset: BigNumberish,
    limit: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<InvestmentsResponse[]>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getBaseToken(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param token Type: address, Indexed: false
   * @param baseInvestment Type: uint256, Indexed: false
   * @param instantTradePercentage Type: uint256, Indexed: false
   * @param optionalPath Type: address[], Indexed: false
   */
  getCreationTokens(
    token: string,
    baseInvestment: BigNumberish,
    instantTradePercentage: BigNumberish,
    optionalPath: string[],
    overrides?: ContractCallOverrides
  ): Promise<GetCreationTokensResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param proposalIds Type: uint256[], Indexed: false
   * @param lp2s Type: uint256[], Indexed: false
   */
  getDivestAmounts(
    proposalIds: BigNumberish[],
    lp2s: BigNumberish[],
    overrides?: ContractCallOverrides
  ): Promise<ReceptionsResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param proposalId Type: uint256, Indexed: false
   * @param from Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   * @param optionalPath Type: address[], Indexed: false
   * @param exType Type: uint8, Indexed: false
   */
  getExchangeAmount(
    proposalId: BigNumberish,
    from: string,
    amount: BigNumberish,
    optionalPath: string[],
    exType: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<GetExchangeAmountResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getInjector(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param proposalId Type: uint256, Indexed: false
   * @param baseInvestment Type: uint256, Indexed: false
   */
  getInvestTokens(
    proposalId: BigNumberish,
    baseInvestment: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<GetInvestTokensResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getInvestedBaseInUSD(overrides?: ContractCallOverrides): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param proposalId Type: uint256, Indexed: false
   * @param user Type: address, Indexed: false
   * @param toBeInvested Type: uint256, Indexed: false
   */
  getInvestmentPercentage(
    proposalId: BigNumberish,
    user: string,
    toBeInvested: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param offset Type: uint256, Indexed: false
   * @param limit Type: uint256, Indexed: false
   */
  getProposalInfos(
    offset: BigNumberish,
    limit: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<ProposalsResponse[]>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param user Type: address, Indexed: false
   */
  getTotalActiveInvestments(
    user: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param user Type: address, Indexed: false
   * @param proposalIds Type: uint256[], Indexed: false
   */
  getUserInvestmentsLimits(
    user: string,
    proposalIds: BigNumberish[],
    overrides?: ContractCallOverrides
  ): Promise<BigNumber[]>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param proposalId Type: uint256, Indexed: false
   * @param user Type: address, Indexed: false
   * @param lpInvestment Type: uint256, Indexed: false
   * @param baseInvestment Type: uint256, Indexed: false
   * @param minPositionOut Type: uint256, Indexed: false
   */
  invest(
    proposalId: BigNumberish,
    user: string,
    lpInvestment: BigNumberish,
    baseInvestment: BigNumberish,
    minPositionOut: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  investedBase(overrides?: ContractCallOverrides): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param account Type: address, Indexed: false
   * @param operator Type: address, Indexed: false
   */
  isApprovedForAll(
    account: string,
    operator: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  priceFeed(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  proposalsTotalNum(overrides?: ContractCallOverrides): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param from Type: address, Indexed: false
   * @param to Type: address, Indexed: false
   * @param ids Type: uint256[], Indexed: false
   * @param amounts Type: uint256[], Indexed: false
   * @param data Type: bytes, Indexed: false
   */
  safeBatchTransferFrom(
    from: string,
    to: string,
    ids: BigNumberish[],
    amounts: BigNumberish[],
    data: Arrayish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param from Type: address, Indexed: false
   * @param to Type: address, Indexed: false
   * @param id Type: uint256, Indexed: false
   * @param amount Type: uint256, Indexed: false
   * @param data Type: bytes, Indexed: false
   */
  safeTransferFrom(
    from: string,
    to: string,
    id: BigNumberish,
    amount: BigNumberish,
    data: Arrayish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param operator Type: address, Indexed: false
   * @param approved Type: bool, Indexed: false
   */
  setApprovalForAll(
    operator: string,
    approved: boolean,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param contractsRegistry Type: address, Indexed: false
   */
  setDependencies(
    contractsRegistry: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _injector Type: address, Indexed: false
   */
  setInjector(
    _injector: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param interfaceId Type: bytes4, Indexed: false
   */
  supportsInterface(
    interfaceId: Arrayish,
    overrides?: ContractCallOverrides
  ): Promise<boolean>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   */
  totalLPBalances(
    parameter0: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  totalLockedLP(overrides?: ContractCallOverrides): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param id Type: uint256, Indexed: false
   */
  totalSupply(
    id: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   */
  uri(
    parameter0: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<string>
}
