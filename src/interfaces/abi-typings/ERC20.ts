import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from "ethers"
import { EthersContractContextV5 } from "ethereum-abi-types-generator"

export type ContractContext = EthersContractContextV5<
  ERC20,
  ERC20MethodNames,
  ERC20EventsContext,
  ERC20Events
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
export type ERC20Events = "Approval" | "Transfer" | "Deposit" | "Withdrawal"
export interface ERC20EventsContext {
  Approval(...parameters: any): EventFilter
  Transfer(...parameters: any): EventFilter
  Deposit(...parameters: any): EventFilter
  Withdrawal(...parameters: any): EventFilter
}
export type ERC20MethodNames =
  | "name"
  | "approve"
  | "totalSupply"
  | "transferFrom"
  | "withdraw"
  | "decimals"
  | "balanceOf"
  | "symbol"
  | "transfer"
  | "deposit"
  | "allowance"
export interface ApprovalEventEmittedResponse {
  src: string
  guy: string
  wad: BigNumberish
}
export interface TransferEventEmittedResponse {
  src: string
  dst: string
  wad: BigNumberish
}
export interface DepositEventEmittedResponse {
  dst: string
  wad: BigNumberish
}
export interface WithdrawalEventEmittedResponse {
  src: string
  wad: BigNumberish
}
export interface ERC20 {
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  name(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param guy Type: address, Indexed: false
   * @param wad Type: uint256, Indexed: false
   */
  approve(
    guy: string,
    wad: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
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
   * @param src Type: address, Indexed: false
   * @param dst Type: address, Indexed: false
   * @param wad Type: uint256, Indexed: false
   */
  transferFrom(
    src: string,
    dst: string,
    wad: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param wad Type: uint256, Indexed: false
   */
  withdraw(
    wad: BigNumberish,
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
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   */
  balanceOf(
    parameter0: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  symbol(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param dst Type: address, Indexed: false
   * @param wad Type: uint256, Indexed: false
   */
  transfer(
    dst: string,
    wad: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   */
  deposit(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   * @param parameter1 Type: address, Indexed: false
   */
  allowance(
    parameter0: string,
    parameter1: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>
}
