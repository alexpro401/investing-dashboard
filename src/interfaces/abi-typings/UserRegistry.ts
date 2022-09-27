import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from "ethers"
import { EthersContractContextV5 } from "ethereum-abi-types-generator"

export type ContractContext = EthersContractContextV5<
  UserRegistry,
  UserRegistryMethodNames,
  UserRegistryEventsContext,
  UserRegistryEvents
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
export type UserRegistryEvents =
  | "Agreed"
  | "OwnershipTransferred"
  | "UpdatedProfile"
export interface UserRegistryEventsContext {
  Agreed(...parameters: any): EventFilter
  OwnershipTransferred(...parameters: any): EventFilter
  UpdatedProfile(...parameters: any): EventFilter
}
export type UserRegistryMethodNames =
  | "__UserRegistry_init"
  | "agreeToPrivacyPolicy"
  | "agreed"
  | "changeProfile"
  | "changeProfileAndAgreeToPrivacyPolicy"
  | "documentHash"
  | "owner"
  | "renounceOwnership"
  | "setPrivacyPolicyDocumentHash"
  | "transferOwnership"
  | "userInfos"
export interface AgreedEventEmittedResponse {
  user: string
  documentHash: Arrayish
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string
  newOwner: string
}
export interface UpdatedProfileEventEmittedResponse {
  user: string
  url: string
}
export interface UserInfosResponse {
  profileURL: string
  0: string
  signatureHash: string
  1: string
  length: 2
}
export interface UserRegistry {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param name Type: string, Indexed: false
   */
  __UserRegistry_init(
    name: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param signature Type: bytes, Indexed: false
   */
  agreeToPrivacyPolicy(
    signature: Arrayish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param user Type: address, Indexed: false
   */
  agreed(user: string, overrides?: ContractCallOverrides): Promise<boolean>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param url Type: string, Indexed: false
   */
  changeProfile(
    url: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param url Type: string, Indexed: false
   * @param signature Type: bytes, Indexed: false
   */
  changeProfileAndAgreeToPrivacyPolicy(
    url: string,
    signature: Arrayish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  documentHash(overrides?: ContractCallOverrides): Promise<string>
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
   * @param hash Type: bytes32, Indexed: false
   */
  setPrivacyPolicyDocumentHash(
    hash: Arrayish,
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
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   */
  userInfos(
    parameter0: string,
    overrides?: ContractCallOverrides
  ): Promise<UserInfosResponse>
}
