import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from "ethers"
import { EthersContractContextV5 } from "ethereum-abi-types-generator"

export type ContractContext = EthersContractContextV5<
  TraderPoolInvestProposal,
  TraderPoolInvestProposalMethodNames,
  TraderPoolInvestProposalEventsContext,
  TraderPoolInvestProposalEvents
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
export type TraderPoolInvestProposalEvents =
  | "ApprovalForAll"
  | "ProposalClaimed"
  | "ProposalCreated"
  | "ProposalDivested"
  | "ProposalInvested"
  | "ProposalInvestorAdded"
  | "ProposalInvestorRemoved"
  | "ProposalRestrictionsChanged"
  | "ProposalSupplied"
  | "ProposalWithdrawn"
  | "TransferBatch"
  | "TransferSingle"
  | "URI"
export interface TraderPoolInvestProposalEventsContext {
  ApprovalForAll(...parameters: any): EventFilter
  ProposalClaimed(...parameters: any): EventFilter
  ProposalCreated(...parameters: any): EventFilter
  ProposalDivested(...parameters: any): EventFilter
  ProposalInvested(...parameters: any): EventFilter
  ProposalInvestorAdded(...parameters: any): EventFilter
  ProposalInvestorRemoved(...parameters: any): EventFilter
  ProposalRestrictionsChanged(...parameters: any): EventFilter
  ProposalSupplied(...parameters: any): EventFilter
  ProposalWithdrawn(...parameters: any): EventFilter
  TransferBatch(...parameters: any): EventFilter
  TransferSingle(...parameters: any): EventFilter
  URI(...parameters: any): EventFilter
}
export type TraderPoolInvestProposalMethodNames =
  | "__TraderPoolInvestProposal_init"
  | "__TraderPoolProposal_init"
  | "balanceOf"
  | "balanceOfBatch"
  | "changeProposalRestrictions"
  | "convertInvestedBaseToDividends"
  | "create"
  | "divest"
  | "exists"
  | "getActiveInvestmentsInfo"
  | "getBaseToken"
  | "getInjector"
  | "getInvestedBaseInUSD"
  | "getProposalInfos"
  | "getRewards"
  | "getTotalActiveInvestments"
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
  | "supply"
  | "supportsInterface"
  | "totalLPBalances"
  | "totalLockedLP"
  | "totalSupply"
  | "uri"
  | "withdraw"
export interface ApprovalForAllEventEmittedResponse {
  account: string
  operator: string
  approved: boolean
}
export interface ProposalClaimedEventEmittedResponse {
  proposalId: BigNumberish
  user: string
  amounts: BigNumberish[]
  tokens: string[]
}
export interface ProposalCreatedEventEmittedResponse {
  proposalId: BigNumberish
  proposalLimits: ProposalLimitsRequest
}
export interface ProposalDivestedEventEmittedResponse {
  proposalId: BigNumberish
  user: string
  divestedLP2: BigNumberish
  receivedLP: BigNumberish
  receivedBase: BigNumberish
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
export interface ProposalRestrictionsChangedEventEmittedResponse {
  proposalId: BigNumberish
  sender: string
}
export interface ProposalSuppliedEventEmittedResponse {
  proposalId: BigNumberish
  sender: string
  amounts: BigNumberish[]
  tokens: string[]
}
export interface ProposalWithdrawnEventEmittedResponse {
  proposalId: BigNumberish
  sender: string
  amount: BigNumberish
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
export interface __TraderPoolInvestProposal_initRequest {
  parentPoolAddress: string
  trader: string
  baseToken: string
  baseTokenDecimals: BigNumberish
}
export interface __TraderPoolProposal_initRequest {
  parentPoolAddress: string
  trader: string
  baseToken: string
  baseTokenDecimals: BigNumberish
}
export interface ChangeProposalRestrictionsRequest {
  timestampLimit: BigNumberish
  investLPLimit: BigNumberish
}
export interface CreateRequest {
  timestampLimit: BigNumberish
  investLPLimit: BigNumberish
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
}
export interface ProposalLimitsResponse {
  timestampLimit: BigNumber
  0: BigNumber
  investLPLimit: BigNumber
  1: BigNumber
}
export interface ProposalInfoResponse {
  descriptionURL: string
  0: ProposalInfoResponse
  proposalLimits: ProposalLimitsResponse
  1: ProposalInfoResponse
  lpLocked: BigNumber
  2: ProposalInfoResponse
  investedBase: BigNumber
  3: ProposalInfoResponse
  newInvestedBase: BigNumber
  4: ProposalInfoResponse
}
export interface ProposalsResponse {
  proposalInfo: ProposalInfoResponse
  0: ProposalInfoResponse
  lp2Supply: BigNumber
  1: BigNumber
  totalInvestors: BigNumber
  2: BigNumber
}
export interface RewardsResponse {
  amounts: BigNumber[]
  0: RewardsResponse[]
  tokens: string[]
  1: RewardsResponse[]
}
export interface ReceptionsResponse {
  totalUsdAmount: BigNumber
  0: BigNumber
  totalBaseAmount: BigNumber
  1: BigNumber
  baseAmountFromRewards: BigNumber
  2: BigNumber
  rewards: RewardsResponse[]
  3: RewardsResponse[]
}
export interface TraderPoolInvestProposal {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param parentTraderPoolInfo Type: tuple, Indexed: false
   */
  __TraderPoolInvestProposal_init(
    parentTraderPoolInfo: __TraderPoolInvestProposal_initRequest,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
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
   * @param proposalId Type: uint256, Indexed: false
   */
  convertInvestedBaseToDividends(
    proposalId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param descriptionURL Type: string, Indexed: false
   * @param proposalLimits Type: tuple, Indexed: false
   * @param lpInvestment Type: uint256, Indexed: false
   * @param baseInvestment Type: uint256, Indexed: false
   */
  create(
    descriptionURL: string,
    proposalLimits: CreateRequest,
    lpInvestment: BigNumberish,
    baseInvestment: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param proposalId Type: uint256, Indexed: false
   * @param user Type: address, Indexed: false
   */
  divest(
    proposalId: BigNumberish,
    user: string,
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
   */
  getInjector(overrides?: ContractCallOverrides): Promise<string>
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
   * @param proposalIds Type: uint256[], Indexed: false
   * @param user Type: address, Indexed: false
   */
  getRewards(
    proposalIds: BigNumberish[],
    user: string,
    overrides?: ContractCallOverrides
  ): Promise<ReceptionsResponse>
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
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param proposalId Type: uint256, Indexed: false
   * @param user Type: address, Indexed: false
   * @param lpInvestment Type: uint256, Indexed: false
   * @param baseInvestment Type: uint256, Indexed: false
   */
  invest(
    proposalId: BigNumberish,
    user: string,
    lpInvestment: BigNumberish,
    baseInvestment: BigNumberish,
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
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param proposalId Type: uint256, Indexed: false
   * @param amounts Type: uint256[], Indexed: false
   * @param addresses Type: address[], Indexed: false
   */
  supply(
    proposalId: BigNumberish,
    amounts: BigNumberish[],
    addresses: string[],
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
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param proposalId Type: uint256, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  withdraw(
    proposalId: BigNumberish,
    amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
}
