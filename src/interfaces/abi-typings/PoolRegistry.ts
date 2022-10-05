import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from "ethers"
import { EthersContractContextV5 } from "ethereum-abi-types-generator"

export type ContractContext = EthersContractContextV5<
  PoolRegistry,
  PoolRegistryMethodNames,
  PoolRegistryEventsContext,
  PoolRegistryEvents
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
export type PoolRegistryEvents = "OwnershipTransferred"
export interface PoolRegistryEventsContext {
  OwnershipTransferred(...parameters: any): EventFilter
}
export type PoolRegistryMethodNames =
  | "BASIC_POOL_NAME"
  | "DISTRIBUTION_PROPOSAL_NAME"
  | "GOV_POOL_NAME"
  | "INVEST_POOL_NAME"
  | "INVEST_PROPOSAL_NAME"
  | "RISKY_PROPOSAL_NAME"
  | "SETTINGS_NAME"
  | "USER_KEEPER_NAME"
  | "VALIDATORS_NAME"
  | "__OwnablePoolContractsRegistry_init"
  | "addProxyPool"
  | "associateUserWithPool"
  | "countAssociatedPools"
  | "countPools"
  | "getImplementation"
  | "getInjector"
  | "getProxyBeacon"
  | "injectDependenciesToExistingPools"
  | "isBasicPool"
  | "isInvestPool"
  | "isTraderPool"
  | "listAssociatedPools"
  | "listPools"
  | "listTraderPoolsWithInfo"
  | "owner"
  | "renounceOwnership"
  | "setDependencies"
  | "setInjector"
  | "setNewImplementations"
  | "transferOwnership"
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string
  newOwner: string
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
export interface PoolInfosResponse {
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
export interface LeverageInfosResponse {
  totalPoolUSDWithProposals: BigNumber
  0: BigNumber
  traderLeverageUSDTokens: BigNumber
  1: BigNumber
  freeLeverageUSD: BigNumber
  2: BigNumber
  freeLeverageBase: BigNumber
  3: BigNumber
}
export interface ListTraderPoolsWithInfoResponse {
  pools: string[]
  0: string[]
  poolInfos: PoolInfosResponse[]
  1: PoolInfosResponse[]
  leverageInfos: LeverageInfosResponse[]
  2: LeverageInfosResponse[]
  length: 3
}
export interface PoolRegistry {
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  BASIC_POOL_NAME(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  DISTRIBUTION_PROPOSAL_NAME(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  GOV_POOL_NAME(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  INVEST_POOL_NAME(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  INVEST_PROPOSAL_NAME(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  RISKY_PROPOSAL_NAME(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  SETTINGS_NAME(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  USER_KEEPER_NAME(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  VALIDATORS_NAME(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  __OwnablePoolContractsRegistry_init(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param name Type: string, Indexed: false
   * @param poolAddress Type: address, Indexed: false
   */
  addProxyPool(
    name: string,
    poolAddress: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param user Type: address, Indexed: false
   * @param name Type: string, Indexed: false
   * @param poolAddress Type: address, Indexed: false
   */
  associateUserWithPool(
    user: string,
    name: string,
    poolAddress: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param user Type: address, Indexed: false
   * @param name Type: string, Indexed: false
   */
  countAssociatedPools(
    user: string,
    name: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param name Type: string, Indexed: false
   */
  countPools(
    name: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param name Type: string, Indexed: false
   */
  getImplementation(
    name: string,
    overrides?: ContractCallOverrides
  ): Promise<string>
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
   * @param name Type: string, Indexed: false
   */
  getProxyBeacon(
    name: string,
    overrides?: ContractCallOverrides
  ): Promise<string>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param name Type: string, Indexed: false
   * @param offset Type: uint256, Indexed: false
   * @param limit Type: uint256, Indexed: false
   */
  injectDependenciesToExistingPools(
    name: string,
    offset: BigNumberish,
    limit: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param potentialPool Type: address, Indexed: false
   */
  isBasicPool(
    potentialPool: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param potentialPool Type: address, Indexed: false
   */
  isInvestPool(
    potentialPool: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param potentialPool Type: address, Indexed: false
   */
  isTraderPool(
    potentialPool: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param user Type: address, Indexed: false
   * @param name Type: string, Indexed: false
   * @param offset Type: uint256, Indexed: false
   * @param limit Type: uint256, Indexed: false
   */
  listAssociatedPools(
    user: string,
    name: string,
    offset: BigNumberish,
    limit: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<string[]>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param name Type: string, Indexed: false
   * @param offset Type: uint256, Indexed: false
   * @param limit Type: uint256, Indexed: false
   */
  listPools(
    name: string,
    offset: BigNumberish,
    limit: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<string[]>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param name Type: string, Indexed: false
   * @param offset Type: uint256, Indexed: false
   * @param limit Type: uint256, Indexed: false
   */
  listTraderPoolsWithInfo(
    name: string,
    offset: BigNumberish,
    limit: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<ListTraderPoolsWithInfoResponse>
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
   */
  renounceOwnership(
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
   * @param names Type: string[], Indexed: false
   * @param newImplementations Type: address[], Indexed: false
   */
  setNewImplementations(
    names: string[],
    newImplementations: string[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
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
