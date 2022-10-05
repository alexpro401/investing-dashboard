import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from "ethers"
import { EthersContractContextV5 } from "ethereum-abi-types-generator"

export type ContractContext = EthersContractContextV5<
  ContractsRegistry,
  ContractsRegistryMethodNames,
  ContractsRegistryEventsContext,
  ContractsRegistryEvents
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
export type ContractsRegistryEvents = "OwnershipTransferred"
export interface ContractsRegistryEventsContext {
  OwnershipTransferred(...parameters: any): EventFilter
}
export type ContractsRegistryMethodNames =
  | "CORE_PROPERTIES_NAME"
  | "DEXE_NAME"
  | "DIVIDENDS_NAME"
  | "INSURANCE_NAME"
  | "POOL_FACTORY_NAME"
  | "POOL_REGISTRY_NAME"
  | "PRICE_FEED_NAME"
  | "TREASURY_NAME"
  | "UNISWAP_V2_FACTORY_NAME"
  | "UNISWAP_V2_ROUTER_NAME"
  | "USD_NAME"
  | "USER_REGISTRY_NAME"
  | "__OwnableContractsRegistry_init"
  | "addContract"
  | "addProxyContract"
  | "getContract"
  | "getCorePropertiesContract"
  | "getDEXEContract"
  | "getDividendsContract"
  | "getImplementation"
  | "getInsuranceContract"
  | "getPoolFactoryContract"
  | "getPoolRegistryContract"
  | "getPriceFeedContract"
  | "getProxyUpgrader"
  | "getTreasuryContract"
  | "getUSDContract"
  | "getUniswapV2FactoryContract"
  | "getUniswapV2RouterContract"
  | "getUserRegistryContract"
  | "hasContract"
  | "injectDependencies"
  | "justAddProxyContract"
  | "owner"
  | "removeContract"
  | "renounceOwnership"
  | "transferOwnership"
  | "upgradeContract"
  | "upgradeContractAndCall"
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string
  newOwner: string
}
export interface ContractsRegistry {
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  CORE_PROPERTIES_NAME(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  DEXE_NAME(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  DIVIDENDS_NAME(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  INSURANCE_NAME(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  POOL_FACTORY_NAME(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  POOL_REGISTRY_NAME(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  PRICE_FEED_NAME(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  TREASURY_NAME(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  UNISWAP_V2_FACTORY_NAME(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  UNISWAP_V2_ROUTER_NAME(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  USD_NAME(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  USER_REGISTRY_NAME(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  __OwnableContractsRegistry_init(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param name Type: string, Indexed: false
   * @param contractAddress Type: address, Indexed: false
   */
  addContract(
    name: string,
    contractAddress: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param name Type: string, Indexed: false
   * @param contractAddress Type: address, Indexed: false
   */
  addProxyContract(
    name: string,
    contractAddress: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param name Type: string, Indexed: false
   */
  getContract(name: string, overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getCorePropertiesContract(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getDEXEContract(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getDividendsContract(overrides?: ContractCallOverrides): Promise<string>
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
  getInsuranceContract(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getPoolFactoryContract(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getPoolRegistryContract(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getPriceFeedContract(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getProxyUpgrader(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getTreasuryContract(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getUSDContract(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getUniswapV2FactoryContract(
    overrides?: ContractCallOverrides
  ): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getUniswapV2RouterContract(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getUserRegistryContract(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param name Type: string, Indexed: false
   */
  hasContract(name: string, overrides?: ContractCallOverrides): Promise<boolean>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param name Type: string, Indexed: false
   */
  injectDependencies(
    name: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param name Type: string, Indexed: false
   * @param contractAddress Type: address, Indexed: false
   */
  justAddProxyContract(
    name: string,
    contractAddress: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
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
   * @param name Type: string, Indexed: false
   */
  removeContract(
    name: string,
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
   * @param newOwner Type: address, Indexed: false
   */
  transferOwnership(
    newOwner: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param name Type: string, Indexed: false
   * @param newImplementation Type: address, Indexed: false
   */
  upgradeContract(
    name: string,
    newImplementation: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param name Type: string, Indexed: false
   * @param newImplementation Type: address, Indexed: false
   * @param data Type: bytes, Indexed: false
   */
  upgradeContractAndCall(
    name: string,
    newImplementation: string,
    data: Arrayish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
}
