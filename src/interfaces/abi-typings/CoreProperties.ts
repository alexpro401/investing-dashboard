import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from "ethers"
import { EthersContractContextV5 } from "ethereum-abi-types-generator"

export type ContractContext = EthersContractContextV5<
  CoreProperties,
  CorePropertiesMethodNames,
  CorePropertiesEventsContext,
  CorePropertiesEvents
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
export type CorePropertiesEvents = "OwnershipTransferred"
export interface CorePropertiesEventsContext {
  OwnershipTransferred(...parameters: any): EventFilter
}
export type CorePropertiesMethodNames =
  | "__CoreProperties_init"
  | "addBlacklistTokens"
  | "addWhitelistTokens"
  | "coreParameters"
  | "getBlacklistTokens"
  | "getCommissionDuration"
  | "getCommissionEpochByTimestamp"
  | "getCommissionInitTimestamp"
  | "getCommissionTimestampByEpoch"
  | "getDEXECommissionPercentages"
  | "getDelayForRiskyPool"
  | "getFilteredPositions"
  | "getGovVotesLimit"
  | "getInjector"
  | "getInsuranceFactor"
  | "getInsuranceWithdrawalLock"
  | "getMaxInsurancePoolShare"
  | "getMaximumOpenPositions"
  | "getMaximumPoolInvestors"
  | "getMinInsuranceDeposit"
  | "getMinInsuranceProposalAmount"
  | "getTraderCommissions"
  | "getTraderLeverageParams"
  | "getWhitelistTokens"
  | "isBlacklistedToken"
  | "isWhitelistedToken"
  | "owner"
  | "removeBlacklistTokens"
  | "removeWhitelistTokens"
  | "renounceOwnership"
  | "setCommissionDurations"
  | "setCommissionInitTimestamp"
  | "setCoreParameters"
  | "setDEXECommissionPercentages"
  | "setDelayForRiskyPool"
  | "setDependencies"
  | "setGovVotesLimit"
  | "setInjector"
  | "setInsuranceParameters"
  | "setMaximumOpenPositions"
  | "setMaximumPoolInvestors"
  | "setTraderCommissionPercentages"
  | "setTraderLeverageParams"
  | "totalBlacklistTokens"
  | "totalWhitelistTokens"
  | "transferOwnership"
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string
  newOwner: string
}
export interface TraderParamsRequest {
  maxPoolInvestors: BigNumberish
  maxOpenPositions: BigNumberish
  leverageThreshold: BigNumberish
  leverageSlope: BigNumberish
  commissionInitTimestamp: BigNumberish
  commissionDurations: BigNumberish[]
  dexeCommissionPercentage: BigNumberish
  dexeCommissionDistributionPercentages: BigNumberish[]
  minTraderCommission: BigNumberish
  maxTraderCommissions: BigNumberish[]
  delayForRiskyPool: BigNumberish
}
export interface InsuranceParamsRequest {
  insuranceFactor: BigNumberish
  maxInsurancePoolShare: BigNumberish
  minInsuranceDeposit: BigNumberish
  minInsuranceProposalAmount: BigNumberish
  insuranceWithdrawalLock: BigNumberish
}
export interface GovParamsRequest {
  govVotesLimit: BigNumberish
  govCommissionPercentage: BigNumberish
}
export interface __CoreProperties_initRequest {
  traderParams: TraderParamsRequest
  insuranceParams: InsuranceParamsRequest
  govParams: GovParamsRequest
}
export interface TraderParamsResponse {
  maxPoolInvestors: BigNumber
  0: BigNumber
  maxOpenPositions: BigNumber
  1: BigNumber
  leverageThreshold: BigNumber
  2: BigNumber
  leverageSlope: BigNumber
  3: BigNumber
  commissionInitTimestamp: BigNumber
  4: BigNumber
  commissionDurations: BigNumber[]
  5: BigNumber[]
  dexeCommissionPercentage: BigNumber
  6: BigNumber
  dexeCommissionDistributionPercentages: BigNumber[]
  7: BigNumber[]
  minTraderCommission: BigNumber
  8: BigNumber
  maxTraderCommissions: BigNumber[]
  9: BigNumber[]
  delayForRiskyPool: BigNumber
  10: BigNumber
}
export interface InsuranceParamsResponse {
  insuranceFactor: BigNumber
  0: BigNumber
  maxInsurancePoolShare: BigNumber
  1: BigNumber
  minInsuranceDeposit: BigNumber
  2: BigNumber
  minInsuranceProposalAmount: BigNumber
  3: BigNumber
  insuranceWithdrawalLock: BigNumber
  4: BigNumber
}
export interface GovParamsResponse {
  govVotesLimit: BigNumber
  0: BigNumber
  govCommissionPercentage: BigNumber
  1: BigNumber
}
export interface CoreParametersResponse {
  traderParams: TraderParamsResponse
  0: TraderParamsResponse
  insuranceParams: InsuranceParamsResponse
  1: InsuranceParamsResponse
  govParams: GovParamsResponse
  2: GovParamsResponse
  length: 3
}
export interface GetDEXECommissionPercentagesResponse {
  result0: BigNumber
  0: BigNumber
  result1: BigNumber
  1: BigNumber
  result2: BigNumber[]
  2: BigNumber[]
  result3: [string, string, string, string]
  3: [string, string, string, string]
  length: 4
}
export interface GetTraderCommissionsResponse {
  result0: BigNumber
  0: BigNumber
  result1: BigNumber[]
  1: BigNumber[]
  length: 2
}
export interface GetTraderLeverageParamsResponse {
  result0: BigNumber
  0: BigNumber
  result1: BigNumber
  1: BigNumber
  length: 2
}
export interface SetCoreParametersRequest {
  traderParams: TraderParamsRequest
  insuranceParams: InsuranceParamsRequest
  govParams: GovParamsRequest
}
export interface SetInsuranceParametersRequest {
  insuranceFactor: BigNumberish
  maxInsurancePoolShare: BigNumberish
  minInsuranceDeposit: BigNumberish
  minInsuranceProposalAmount: BigNumberish
  insuranceWithdrawalLock: BigNumberish
}
export interface CoreProperties {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _coreParameters Type: tuple, Indexed: false
   */
  __CoreProperties_init(
    _coreParameters: __CoreProperties_initRequest,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokens Type: address[], Indexed: false
   */
  addBlacklistTokens(
    tokens: string[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokens Type: address[], Indexed: false
   */
  addWhitelistTokens(
    tokens: string[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  coreParameters(
    overrides?: ContractCallOverrides
  ): Promise<CoreParametersResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param offset Type: uint256, Indexed: false
   * @param limit Type: uint256, Indexed: false
   */
  getBlacklistTokens(
    offset: BigNumberish,
    limit: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<string[]>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param period Type: uint8, Indexed: false
   */
  getCommissionDuration(
    period: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param timestamp Type: uint256, Indexed: false
   * @param commissionPeriod Type: uint8, Indexed: false
   */
  getCommissionEpochByTimestamp(
    timestamp: BigNumberish,
    commissionPeriod: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getCommissionInitTimestamp(
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param epoch Type: uint256, Indexed: false
   * @param commissionPeriod Type: uint8, Indexed: false
   */
  getCommissionTimestampByEpoch(
    epoch: BigNumberish,
    commissionPeriod: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getDEXECommissionPercentages(
    overrides?: ContractCallOverrides
  ): Promise<GetDEXECommissionPercentagesResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getDelayForRiskyPool(overrides?: ContractCallOverrides): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param positions Type: address[], Indexed: false
   */
  getFilteredPositions(
    positions: string[],
    overrides?: ContractCallOverrides
  ): Promise<string[]>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getGovVotesLimit(overrides?: ContractCallOverrides): Promise<BigNumber>
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
  getInsuranceFactor(overrides?: ContractCallOverrides): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getInsuranceWithdrawalLock(
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getMaxInsurancePoolShare(
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getMaximumOpenPositions(overrides?: ContractCallOverrides): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getMaximumPoolInvestors(overrides?: ContractCallOverrides): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getMinInsuranceDeposit(overrides?: ContractCallOverrides): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getMinInsuranceProposalAmount(
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getTraderCommissions(
    overrides?: ContractCallOverrides
  ): Promise<GetTraderCommissionsResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getTraderLeverageParams(
    overrides?: ContractCallOverrides
  ): Promise<GetTraderLeverageParamsResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param offset Type: uint256, Indexed: false
   * @param limit Type: uint256, Indexed: false
   */
  getWhitelistTokens(
    offset: BigNumberish,
    limit: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<string[]>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param token Type: address, Indexed: false
   */
  isBlacklistedToken(
    token: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param token Type: address, Indexed: false
   */
  isWhitelistedToken(
    token: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  owner(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokens Type: address[], Indexed: false
   */
  removeBlacklistTokens(
    tokens: string[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokens Type: address[], Indexed: false
   */
  removeWhitelistTokens(
    tokens: string[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  renounceOwnership(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param durations Type: uint256[], Indexed: false
   */
  setCommissionDurations(
    durations: BigNumberish[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param timestamp Type: uint256, Indexed: false
   */
  setCommissionInitTimestamp(
    timestamp: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _coreParameters Type: tuple, Indexed: false
   */
  setCoreParameters(
    _coreParameters: SetCoreParametersRequest,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param dexeCommission Type: uint256, Indexed: false
   * @param govCommission Type: uint256, Indexed: false
   * @param distributionPercentages Type: uint256[], Indexed: false
   */
  setDEXECommissionPercentages(
    dexeCommission: BigNumberish,
    govCommission: BigNumberish,
    distributionPercentages: BigNumberish[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param delayForRiskyPool Type: uint256, Indexed: false
   */
  setDelayForRiskyPool(
    delayForRiskyPool: BigNumberish,
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
   * @param newVotesLimit Type: uint256, Indexed: false
   */
  setGovVotesLimit(
    newVotesLimit: BigNumberish,
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
   * @param insuranceParams Type: tuple, Indexed: false
   */
  setInsuranceParameters(
    insuranceParams: SetInsuranceParametersRequest,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param count Type: uint256, Indexed: false
   */
  setMaximumOpenPositions(
    count: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param count Type: uint256, Indexed: false
   */
  setMaximumPoolInvestors(
    count: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param minTraderCommission Type: uint256, Indexed: false
   * @param maxTraderCommissions Type: uint256[], Indexed: false
   */
  setTraderCommissionPercentages(
    minTraderCommission: BigNumberish,
    maxTraderCommissions: BigNumberish[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param threshold Type: uint256, Indexed: false
   * @param slope Type: uint256, Indexed: false
   */
  setTraderLeverageParams(
    threshold: BigNumberish,
    slope: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  totalBlacklistTokens(overrides?: ContractCallOverrides): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  totalWhitelistTokens(overrides?: ContractCallOverrides): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param newOwner Type: address, Indexed: false
   */
  transferOwnership(
    newOwner: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
}
