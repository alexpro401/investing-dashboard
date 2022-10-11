import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from "ethers"
import { EthersContractContextV5 } from "ethereum-abi-types-generator"

export type ContractContext = EthersContractContextV5<
  Insurance,
  InsuranceMethodNames,
  InsuranceEventsContext,
  InsuranceEvents
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
export type InsuranceEvents =
  | "Deposited"
  | "OwnershipTransferred"
  | "Paidout"
  | "ProposedClaim"
  | "Withdrawn"
export interface InsuranceEventsContext {
  Deposited(...parameters: any): EventFilter
  OwnershipTransferred(...parameters: any): EventFilter
  Paidout(...parameters: any): EventFilter
  ProposedClaim(...parameters: any): EventFilter
  Withdrawn(...parameters: any): EventFilter
}
export type InsuranceMethodNames =
  | "__Insurance_init"
  | "acceptClaim"
  | "buyInsurance"
  | "finishedClaimsCount"
  | "getInjector"
  | "getInsurance"
  | "getMaxTreasuryPayout"
  | "getReceivedInsurance"
  | "listFinishedClaims"
  | "listOngoingClaims"
  | "ongoingClaimsCount"
  | "owner"
  | "proposeClaim"
  | "rejectClaim"
  | "renounceOwnership"
  | "setDependencies"
  | "setInjector"
  | "transferOwnership"
  | "userInfos"
  | "withdraw"
export interface DepositedEventEmittedResponse {
  amount: BigNumberish
  investor: string
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string
  newOwner: string
}
export interface PaidoutEventEmittedResponse {
  insurancePayout: BigNumberish
  userStakePayout: BigNumberish
  investor: string
}
export interface ProposedClaimEventEmittedResponse {
  sender: string
  url: string
}
export interface WithdrawnEventEmittedResponse {
  amount: BigNumberish
  investor: string
}
export interface GetInsuranceResponse {
  result0: BigNumber
  0: BigNumber
  result1: BigNumber
  1: BigNumber
  length: 2
}
export interface InfoResponse {
  claimers: string[]
  0: string[]
  amounts: BigNumber[]
  1: BigNumber[]
  status: number
  2: number
}
export interface ListFinishedClaimsResponse {
  urls: string[]
  0: string[]
  info: InfoResponse[]
  1: InfoResponse[]
  length: 2
}
export interface UserInfosResponse {
  stake: BigNumber
  0: BigNumber
  lastDepositTimestamp: BigNumber
  1: BigNumber
  lastProposalTimestamp: BigNumber
  2: BigNumber
  length: 3
}
export interface Insurance {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  __Insurance_init(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param url Type: string, Indexed: false
   * @param users Type: address[], Indexed: false
   * @param amounts Type: uint256[], Indexed: false
   */
  acceptClaim(
    url: string,
    users: string[],
    amounts: BigNumberish[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param deposit Type: uint256, Indexed: false
   */
  buyInsurance(
    deposit: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  finishedClaimsCount(overrides?: ContractCallOverrides): Promise<BigNumber>
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
   * @param user Type: address, Indexed: false
   */
  getInsurance(
    user: string,
    overrides?: ContractCallOverrides
  ): Promise<GetInsuranceResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getMaxTreasuryPayout(overrides?: ContractCallOverrides): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param deposit Type: uint256, Indexed: false
   */
  getReceivedInsurance(
    deposit: BigNumberish,
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
  listFinishedClaims(
    offset: BigNumberish,
    limit: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<ListFinishedClaimsResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param offset Type: uint256, Indexed: false
   * @param limit Type: uint256, Indexed: false
   */
  listOngoingClaims(
    offset: BigNumberish,
    limit: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<string[]>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  ongoingClaimsCount(overrides?: ContractCallOverrides): Promise<BigNumber>
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
   * @param url Type: string, Indexed: false
   */
  proposeClaim(
    url: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param url Type: string, Indexed: false
   */
  rejectClaim(
    url: string,
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
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param amountToWithdraw Type: uint256, Indexed: false
   */
  withdraw(
    amountToWithdraw: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
}
