import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from "ethers"
import { EthersContractContextV5 } from "ethereum-abi-types-generator"

export type ContractContext = EthersContractContextV5<
  PriceFeed,
  PriceFeedMethodNames,
  PriceFeedEventsContext,
  PriceFeedEvents
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
export type PriceFeedEvents = "OwnershipTransferred"
export interface PriceFeedEventsContext {
  OwnershipTransferred(...parameters: any): EventFilter
}
export type PriceFeedMethodNames =
  | "__PriceFeed_init"
  | "addPathTokens"
  | "exchangeFromExact"
  | "exchangeToExact"
  | "getExtendedPriceIn"
  | "getExtendedPriceOut"
  | "getInjector"
  | "getNormalizedExtendedPriceIn"
  | "getNormalizedExtendedPriceOut"
  | "getNormalizedPriceIn"
  | "getNormalizedPriceInDEXE"
  | "getNormalizedPriceInUSD"
  | "getNormalizedPriceOut"
  | "getNormalizedPriceOutDEXE"
  | "getNormalizedPriceOutUSD"
  | "getPathTokens"
  | "getSavedPaths"
  | "isSupportedPathToken"
  | "normalizedExchangeFromExact"
  | "normalizedExchangeToExact"
  | "owner"
  | "removePathTokens"
  | "renounceOwnership"
  | "setDependencies"
  | "setInjector"
  | "totalPathTokens"
  | "transferOwnership"
  | "uniswapFactory"
  | "uniswapV2Router"
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string
  newOwner: string
}
export interface GetExtendedPriceInResponse {
  amountIn: BigNumber
  0: BigNumber
  path: string[]
  1: string[]
  length: 2
}
export interface GetExtendedPriceOutResponse {
  amountOut: BigNumber
  0: BigNumber
  path: string[]
  1: string[]
  length: 2
}
export interface GetNormalizedExtendedPriceInResponse {
  amountIn: BigNumber
  0: BigNumber
  path: string[]
  1: string[]
  length: 2
}
export interface GetNormalizedExtendedPriceOutResponse {
  amountOut: BigNumber
  0: BigNumber
  path: string[]
  1: string[]
  length: 2
}
export interface GetNormalizedPriceInResponse {
  amountIn: BigNumber
  0: BigNumber
  path: string[]
  1: string[]
  length: 2
}
export interface GetNormalizedPriceInDEXEResponse {
  amountIn: BigNumber
  0: BigNumber
  path: string[]
  1: string[]
  length: 2
}
export interface GetNormalizedPriceInUSDResponse {
  amountIn: BigNumber
  0: BigNumber
  path: string[]
  1: string[]
  length: 2
}
export interface GetNormalizedPriceOutResponse {
  amountOut: BigNumber
  0: BigNumber
  path: string[]
  1: string[]
  length: 2
}
export interface GetNormalizedPriceOutDEXEResponse {
  amountOut: BigNumber
  0: BigNumber
  path: string[]
  1: string[]
  length: 2
}
export interface GetNormalizedPriceOutUSDResponse {
  amountOut: BigNumber
  0: BigNumber
  path: string[]
  1: string[]
  length: 2
}
export interface PriceFeed {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  __PriceFeed_init(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param pathTokens Type: address[], Indexed: false
   */
  addPathTokens(
    pathTokens: string[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param inToken Type: address, Indexed: false
   * @param outToken Type: address, Indexed: false
   * @param amountIn Type: uint256, Indexed: false
   * @param optionalPath Type: address[], Indexed: false
   * @param minAmountOut Type: uint256, Indexed: false
   */
  exchangeFromExact(
    inToken: string,
    outToken: string,
    amountIn: BigNumberish,
    optionalPath: string[],
    minAmountOut: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param inToken Type: address, Indexed: false
   * @param outToken Type: address, Indexed: false
   * @param amountOut Type: uint256, Indexed: false
   * @param optionalPath Type: address[], Indexed: false
   * @param maxAmountIn Type: uint256, Indexed: false
   */
  exchangeToExact(
    inToken: string,
    outToken: string,
    amountOut: BigNumberish,
    optionalPath: string[],
    maxAmountIn: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param inToken Type: address, Indexed: false
   * @param outToken Type: address, Indexed: false
   * @param amountOut Type: uint256, Indexed: false
   * @param optionalPath Type: address[], Indexed: false
   */
  getExtendedPriceIn(
    inToken: string,
    outToken: string,
    amountOut: BigNumberish,
    optionalPath: string[],
    overrides?: ContractCallOverrides
  ): Promise<GetExtendedPriceInResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param inToken Type: address, Indexed: false
   * @param outToken Type: address, Indexed: false
   * @param amountIn Type: uint256, Indexed: false
   * @param optionalPath Type: address[], Indexed: false
   */
  getExtendedPriceOut(
    inToken: string,
    outToken: string,
    amountIn: BigNumberish,
    optionalPath: string[],
    overrides?: ContractCallOverrides
  ): Promise<GetExtendedPriceOutResponse>
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
   * @param inToken Type: address, Indexed: false
   * @param outToken Type: address, Indexed: false
   * @param amountOut Type: uint256, Indexed: false
   * @param optionalPath Type: address[], Indexed: false
   */
  getNormalizedExtendedPriceIn(
    inToken: string,
    outToken: string,
    amountOut: BigNumberish,
    optionalPath: string[],
    overrides?: ContractCallOverrides
  ): Promise<GetNormalizedExtendedPriceInResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param inToken Type: address, Indexed: false
   * @param outToken Type: address, Indexed: false
   * @param amountIn Type: uint256, Indexed: false
   * @param optionalPath Type: address[], Indexed: false
   */
  getNormalizedExtendedPriceOut(
    inToken: string,
    outToken: string,
    amountIn: BigNumberish,
    optionalPath: string[],
    overrides?: ContractCallOverrides
  ): Promise<GetNormalizedExtendedPriceOutResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param inToken Type: address, Indexed: false
   * @param outToken Type: address, Indexed: false
   * @param amountOut Type: uint256, Indexed: false
   */
  getNormalizedPriceIn(
    inToken: string,
    outToken: string,
    amountOut: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<GetNormalizedPriceInResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param inToken Type: address, Indexed: false
   * @param amountOut Type: uint256, Indexed: false
   */
  getNormalizedPriceInDEXE(
    inToken: string,
    amountOut: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<GetNormalizedPriceInDEXEResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param inToken Type: address, Indexed: false
   * @param amountOut Type: uint256, Indexed: false
   */
  getNormalizedPriceInUSD(
    inToken: string,
    amountOut: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<GetNormalizedPriceInUSDResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param inToken Type: address, Indexed: false
   * @param outToken Type: address, Indexed: false
   * @param amountIn Type: uint256, Indexed: false
   */
  getNormalizedPriceOut(
    inToken: string,
    outToken: string,
    amountIn: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<GetNormalizedPriceOutResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param inToken Type: address, Indexed: false
   * @param amountIn Type: uint256, Indexed: false
   */
  getNormalizedPriceOutDEXE(
    inToken: string,
    amountIn: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<GetNormalizedPriceOutDEXEResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param inToken Type: address, Indexed: false
   * @param amountIn Type: uint256, Indexed: false
   */
  getNormalizedPriceOutUSD(
    inToken: string,
    amountIn: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<GetNormalizedPriceOutUSDResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getPathTokens(overrides?: ContractCallOverrides): Promise<string[]>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param pool Type: address, Indexed: false
   * @param from Type: address, Indexed: false
   * @param to Type: address, Indexed: false
   */
  getSavedPaths(
    pool: string,
    from: string,
    to: string,
    overrides?: ContractCallOverrides
  ): Promise<string[]>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param token Type: address, Indexed: false
   */
  isSupportedPathToken(
    token: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param inToken Type: address, Indexed: false
   * @param outToken Type: address, Indexed: false
   * @param amountIn Type: uint256, Indexed: false
   * @param optionalPath Type: address[], Indexed: false
   * @param minAmountOut Type: uint256, Indexed: false
   */
  normalizedExchangeFromExact(
    inToken: string,
    outToken: string,
    amountIn: BigNumberish,
    optionalPath: string[],
    minAmountOut: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param inToken Type: address, Indexed: false
   * @param outToken Type: address, Indexed: false
   * @param amountOut Type: uint256, Indexed: false
   * @param optionalPath Type: address[], Indexed: false
   * @param maxAmountIn Type: uint256, Indexed: false
   */
  normalizedExchangeToExact(
    inToken: string,
    outToken: string,
    amountOut: BigNumberish,
    optionalPath: string[],
    maxAmountIn: BigNumberish,
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
   * @param pathTokens Type: address[], Indexed: false
   */
  removePathTokens(
    pathTokens: string[],
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
  totalPathTokens(overrides?: ContractCallOverrides): Promise<BigNumber>
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
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  uniswapFactory(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  uniswapV2Router(overrides?: ContractCallOverrides): Promise<string>
}
