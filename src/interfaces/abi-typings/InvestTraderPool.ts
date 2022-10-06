import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from "ethers"
import { EthersContractContextV5 } from "ethereum-abi-types-generator"

export type ContractContext = EthersContractContextV5<
  InvestTraderPool,
  InvestTraderPoolMethodNames,
  InvestTraderPoolEventsContext,
  InvestTraderPoolEvents
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
export type InvestTraderPoolEvents =
  | "ActivePortfolioExchanged"
  | "Approval"
  | "CommissionClaimed"
  | "DescriptionURLChanged"
  | "Divested"
  | "Invested"
  | "InvestorAdded"
  | "InvestorRemoved"
  | "ModifiedAdmins"
  | "ModifiedPrivateInvestors"
  | "ProposalDivested"
  | "Transfer"
export interface InvestTraderPoolEventsContext {
  ActivePortfolioExchanged(...parameters: any): EventFilter
  Approval(...parameters: any): EventFilter
  CommissionClaimed(...parameters: any): EventFilter
  DescriptionURLChanged(...parameters: any): EventFilter
  Divested(...parameters: any): EventFilter
  Invested(...parameters: any): EventFilter
  InvestorAdded(...parameters: any): EventFilter
  InvestorRemoved(...parameters: any): EventFilter
  ModifiedAdmins(...parameters: any): EventFilter
  ModifiedPrivateInvestors(...parameters: any): EventFilter
  ProposalDivested(...parameters: any): EventFilter
  Transfer(...parameters: any): EventFilter
}
export type InvestTraderPoolMethodNames =
  | "__InvestTraderPool_init"
  | "__TraderPool_init"
  | "allowance"
  | "approve"
  | "balanceOf"
  | "canRemovePrivateInvestor"
  | "changePoolParameters"
  | "checkNewInvestor"
  | "checkRemoveInvestor"
  | "coreProperties"
  | "createProposal"
  | "decimals"
  | "decreaseAllowance"
  | "divest"
  | "exchange"
  | "getDivestAmountsAndCommissions"
  | "getExchangeAmount"
  | "getInjector"
  | "getInvestDelayEnd"
  | "getInvestTokens"
  | "getLeverageInfo"
  | "getNextCommissionEpoch"
  | "getPoolInfo"
  | "getReinvestCommissions"
  | "getUsersInfo"
  | "increaseAllowance"
  | "invest"
  | "investProposal"
  | "investorsInfo"
  | "isPrivateInvestor"
  | "isTrader"
  | "isTraderAdmin"
  | "modifyAdmins"
  | "modifyPrivateInvestors"
  | "name"
  | "openPositions"
  | "priceFeed"
  | "proposalPoolAddress"
  | "reinvestCommission"
  | "reinvestProposal"
  | "setDependencies"
  | "setInjector"
  | "symbol"
  | "totalEmission"
  | "totalInvestors"
  | "totalSupply"
  | "transfer"
  | "transferFrom"
export interface ActivePortfolioExchangedEventEmittedResponse {
  fromToken: string
  toToken: string
  fromVolume: BigNumberish
  toVolume: BigNumberish
}
export interface ApprovalEventEmittedResponse {
  owner: string
  spender: string
  value: BigNumberish
}
export interface CommissionClaimedEventEmittedResponse {
  sender: string
  traderLpClaimed: BigNumberish
  traderBaseClaimed: BigNumberish
}
export interface DescriptionURLChangedEventEmittedResponse {
  sender: string
  descriptionURL: string
}
export interface DivestedEventEmittedResponse {
  user: string
  divestedLP: BigNumberish
  receivedBase: BigNumberish
}
export interface InvestedEventEmittedResponse {
  user: string
  investedBase: BigNumberish
  receivedLP: BigNumberish
}
export interface InvestorAddedEventEmittedResponse {
  investor: string
}
export interface InvestorRemovedEventEmittedResponse {
  investor: string
}
export interface ModifiedAdminsEventEmittedResponse {
  sender: string
  admins: string[]
  add: boolean
}
export interface ModifiedPrivateInvestorsEventEmittedResponse {
  sender: string
  privateInvestors: string[]
  add: boolean
}
export interface ProposalDivestedEventEmittedResponse {
  proposalId: BigNumberish
  user: string
  divestedLP2: BigNumberish
  receivedLP: BigNumberish
  receivedBase: BigNumberish
}
export interface TransferEventEmittedResponse {
  from: string
  to: string
  value: BigNumberish
}
export interface __InvestTraderPool_initRequest {
  descriptionURL: string
  trader: string
  privatePool: boolean
  totalLPEmission: BigNumberish
  baseToken: string
  baseTokenDecimals: BigNumberish
  minimalInvestment: BigNumberish
  commissionPeriod: BigNumberish
  commissionPercentage: BigNumberish
}
export interface __TraderPool_initRequest {
  descriptionURL: string
  trader: string
  privatePool: boolean
  totalLPEmission: BigNumberish
  baseToken: string
  baseTokenDecimals: BigNumberish
  minimalInvestment: BigNumberish
  commissionPeriod: BigNumberish
  commissionPercentage: BigNumberish
}
export interface CreateProposalRequest {
  timestampLimit: BigNumberish
  investLPLimit: BigNumberish
}
export interface ReceptionsResponse {
  baseAmount: BigNumber
  0: BigNumber
  lpAmount: BigNumber
  1: BigNumber
  positions: string[]
  2: string[]
  givenAmounts: BigNumber[]
  3: BigNumber[]
  receivedAmounts: BigNumber[]
  4: BigNumber[]
}
export interface CommissionsResponse {
  traderBaseCommission: BigNumber
  0: BigNumber
  traderLPCommission: BigNumber
  1: BigNumber
  traderUSDCommission: BigNumber
  2: BigNumber
  dexeBaseCommission: BigNumber
  3: BigNumber
  dexeLPCommission: BigNumber
  4: BigNumber
  dexeUSDCommission: BigNumber
  5: BigNumber
  dexeDexeCommission: BigNumber
  6: BigNumber
}
export interface GetDivestAmountsAndCommissionsResponse {
  receptions: ReceptionsResponse
  0: ReceptionsResponse
  commissions: CommissionsResponse
  1: CommissionsResponse
  length: 2
}
export interface GetExchangeAmountResponse {
  result0: BigNumber
  0: BigNumber
  result1: string[]
  1: string[]
  length: 2
}
export interface LeverageInfoResponse {
  totalPoolUSDWithProposals: BigNumber
  0: BigNumber
  traderLeverageUSDTokens: BigNumber
  1: BigNumber
  freeLeverageUSD: BigNumber
  2: BigNumber
  freeLeverageBase: BigNumber
  3: BigNumber
}
export interface ParametersResponse {
  descriptionURL: string
  0: ParametersResponse
  trader: string
  1: ParametersResponse
  privatePool: boolean
  2: ParametersResponse
  totalLPEmission: BigNumber
  3: ParametersResponse
  baseToken: string
  4: ParametersResponse
  baseTokenDecimals: BigNumber
  5: ParametersResponse
  minimalInvestment: BigNumber
  6: ParametersResponse
  commissionPeriod: number
  7: ParametersResponse
  commissionPercentage: BigNumber
  8: ParametersResponse
}
export interface PoolInfoResponse {
  ticker: string
  0: string
  name: string
  1: string
  parameters: ParametersResponse
  2: ParametersResponse
  openPositions: string[]
  3: string[]
  baseAndPositionBalances: BigNumber[]
  4: BigNumber[]
  totalBlacklistedPositions: BigNumber
  5: BigNumber
  totalInvestors: BigNumber
  6: BigNumber
  totalPoolUSD: BigNumber
  7: BigNumber
  totalPoolBase: BigNumber
  8: BigNumber
  lpSupply: BigNumber
  9: BigNumber
  lpLockedInProposals: BigNumber
  10: BigNumber
  traderUSD: BigNumber
  11: BigNumber
  traderBase: BigNumber
  12: BigNumber
  traderLPBalance: BigNumber
  13: BigNumber
}
export interface UsersInfoResponse {
  commissionUnlockTimestamp: BigNumber
  0: BigNumber
  poolLPBalance: BigNumber
  1: BigNumber
  investedBase: BigNumber
  2: BigNumber
  poolUSDShare: BigNumber
  3: BigNumber
  poolBaseShare: BigNumber
  4: BigNumber
  owedBaseCommission: BigNumber
  5: BigNumber
  owedLPCommission: BigNumber
  6: BigNumber
}
export interface InvestorsInfoResponse {
  investedBase: BigNumber
  0: BigNumber
  commissionUnlockEpoch: BigNumber
  1: BigNumber
  length: 2
}
export interface InvestTraderPool {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param name Type: string, Indexed: false
   * @param symbol Type: string, Indexed: false
   * @param _poolParameters Type: tuple, Indexed: false
   * @param traderPoolProposal Type: address, Indexed: false
   */
  __InvestTraderPool_init(
    name: string,
    symbol: string,
    _poolParameters: __InvestTraderPool_initRequest,
    traderPoolProposal: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param name Type: string, Indexed: false
   * @param symbol Type: string, Indexed: false
   * @param poolParameters Type: tuple, Indexed: false
   */
  __TraderPool_init(
    name: string,
    symbol: string,
    poolParameters: __TraderPool_initRequest,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param owner Type: address, Indexed: false
   * @param spender Type: address, Indexed: false
   */
  allowance(
    owner: string,
    spender: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param spender Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  approve(
    spender: string,
    amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param account Type: address, Indexed: false
   */
  balanceOf(
    account: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param investor Type: address, Indexed: false
   */
  canRemovePrivateInvestor(
    investor: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param descriptionURL Type: string, Indexed: false
   * @param privatePool Type: bool, Indexed: false
   * @param totalLPEmission Type: uint256, Indexed: false
   * @param minimalInvestment Type: uint256, Indexed: false
   */
  changePoolParameters(
    descriptionURL: string,
    privatePool: boolean,
    totalLPEmission: BigNumberish,
    minimalInvestment: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param user Type: address, Indexed: false
   */
  checkNewInvestor(
    user: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param user Type: address, Indexed: false
   */
  checkRemoveInvestor(
    user: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  coreProperties(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param descriptionURL Type: string, Indexed: false
   * @param lpAmount Type: uint256, Indexed: false
   * @param proposalLimits Type: tuple, Indexed: false
   * @param minPositionsOut Type: uint256[], Indexed: false
   */
  createProposal(
    descriptionURL: string,
    lpAmount: BigNumberish,
    proposalLimits: CreateProposalRequest,
    minPositionsOut: BigNumberish[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  decimals(overrides?: ContractCallOverrides): Promise<number>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param spender Type: address, Indexed: false
   * @param subtractedValue Type: uint256, Indexed: false
   */
  decreaseAllowance(
    spender: string,
    subtractedValue: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param amountLP Type: uint256, Indexed: false
   * @param minPositionsOut Type: uint256[], Indexed: false
   * @param minDexeCommissionOut Type: uint256, Indexed: false
   */
  divest(
    amountLP: BigNumberish,
    minPositionsOut: BigNumberish[],
    minDexeCommissionOut: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param from Type: address, Indexed: false
   * @param to Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   * @param amountBound Type: uint256, Indexed: false
   * @param optionalPath Type: address[], Indexed: false
   * @param exType Type: uint8, Indexed: false
   */
  exchange(
    from: string,
    to: string,
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
   * @param user Type: address, Indexed: false
   * @param amountLP Type: uint256, Indexed: false
   */
  getDivestAmountsAndCommissions(
    user: string,
    amountLP: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<GetDivestAmountsAndCommissionsResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param from Type: address, Indexed: false
   * @param to Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   * @param optionalPath Type: address[], Indexed: false
   * @param exType Type: uint8, Indexed: false
   */
  getExchangeAmount(
    from: string,
    to: string,
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
   */
  getInvestDelayEnd(overrides?: ContractCallOverrides): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param amountInBaseToInvest Type: uint256, Indexed: false
   */
  getInvestTokens(
    amountInBaseToInvest: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<ReceptionsResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getLeverageInfo(
    overrides?: ContractCallOverrides
  ): Promise<LeverageInfoResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getNextCommissionEpoch(overrides?: ContractCallOverrides): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getPoolInfo(overrides?: ContractCallOverrides): Promise<PoolInfoResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param offsetLimits Type: uint256[], Indexed: false
   */
  getReinvestCommissions(
    offsetLimits: BigNumberish[],
    overrides?: ContractCallOverrides
  ): Promise<CommissionsResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param user Type: address, Indexed: false
   * @param offset Type: uint256, Indexed: false
   * @param limit Type: uint256, Indexed: false
   */
  getUsersInfo(
    user: string,
    offset: BigNumberish,
    limit: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<UsersInfoResponse[]>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param spender Type: address, Indexed: false
   * @param addedValue Type: uint256, Indexed: false
   */
  increaseAllowance(
    spender: string,
    addedValue: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param amountInBaseToInvest Type: uint256, Indexed: false
   * @param minPositionsOut Type: uint256[], Indexed: false
   */
  invest(
    amountInBaseToInvest: BigNumberish,
    minPositionsOut: BigNumberish[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param proposalId Type: uint256, Indexed: false
   * @param lpAmount Type: uint256, Indexed: false
   * @param minPositionsOut Type: uint256[], Indexed: false
   */
  investProposal(
    proposalId: BigNumberish,
    lpAmount: BigNumberish,
    minPositionsOut: BigNumberish[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   */
  investorsInfo(
    parameter0: string,
    overrides?: ContractCallOverrides
  ): Promise<InvestorsInfoResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param who Type: address, Indexed: false
   */
  isPrivateInvestor(
    who: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param who Type: address, Indexed: false
   */
  isTrader(who: string, overrides?: ContractCallOverrides): Promise<boolean>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param who Type: address, Indexed: false
   */
  isTraderAdmin(
    who: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param admins Type: address[], Indexed: false
   * @param add Type: bool, Indexed: false
   */
  modifyAdmins(
    admins: string[],
    add: boolean,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param privateInvestors Type: address[], Indexed: false
   * @param add Type: bool, Indexed: false
   */
  modifyPrivateInvestors(
    privateInvestors: string[],
    add: boolean,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  name(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  openPositions(overrides?: ContractCallOverrides): Promise<string[]>
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
  proposalPoolAddress(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param offsetLimits Type: uint256[], Indexed: false
   * @param minDexeCommissionOut Type: uint256, Indexed: false
   */
  reinvestCommission(
    offsetLimits: BigNumberish[],
    minDexeCommissionOut: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param proposalId Type: uint256, Indexed: false
   * @param minPositionsOut Type: uint256[], Indexed: false
   */
  reinvestProposal(
    proposalId: BigNumberish,
    minPositionsOut: BigNumberish[],
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
   */
  symbol(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  totalEmission(overrides?: ContractCallOverrides): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  totalInvestors(overrides?: ContractCallOverrides): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  totalSupply(overrides?: ContractCallOverrides): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param to Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  transfer(
    to: string,
    amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param from Type: address, Indexed: false
   * @param to Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  transferFrom(
    from: string,
    to: string,
    amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
}
