import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from "ethers"
import { EthersContractContextV5 } from "ethereum-abi-types-generator"

export type ContractContext = EthersContractContextV5<
  GovValidators,
  GovValidatorsMethodNames,
  GovValidatorsEventsContext,
  GovValidatorsEvents
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
export type GovValidatorsEvents =
  | "ChangedValidatorsBalances"
  | "OwnershipTransferred"
  | "Voted"
export interface GovValidatorsEventsContext {
  ChangedValidatorsBalances(...parameters: any): EventFilter
  OwnershipTransferred(...parameters: any): EventFilter
  Voted(...parameters: any): EventFilter
}
export type GovValidatorsMethodNames =
  | "__GovValidators_init"
  | "addressVotedExternal"
  | "addressVotedInternal"
  | "changeBalances"
  | "createExternalProposal"
  | "createInternalProposal"
  | "execute"
  | "externalProposals"
  | "getProposalState"
  | "govValidatorsToken"
  | "internalProposalSettings"
  | "internalProposals"
  | "isQuorumReached"
  | "owner"
  | "renounceOwnership"
  | "transferOwnership"
  | "validatorsCount"
  | "vote"
export interface ChangedValidatorsBalancesEventEmittedResponse {
  validators: string[]
  newBalance: BigNumberish[]
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string
  newOwner: string
}
export interface VotedEventEmittedResponse {
  proposalId: BigNumberish
  sender: string
  vote: BigNumberish
}
export interface CoreResponse {
  executed: boolean
  0: boolean
  voteEnd: BigNumber
  1: BigNumber
  quorum: BigNumber
  2: BigNumber
  votesFor: BigNumber
  3: BigNumber
  snapshotId: BigNumber
  4: BigNumber
}
export interface InternalProposalSettingsResponse {
  duration: BigNumber
  0: BigNumber
  quorum: BigNumber
  1: BigNumber
  length: 2
}
export interface InternalProposalsResponse {
  proposalType: number
  0: number
  core: CoreResponse
  1: CoreResponse
  length: 2
}
export interface GovValidators {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param name Type: string, Indexed: false
   * @param symbol Type: string, Indexed: false
   * @param duration Type: uint64, Indexed: false
   * @param quorum Type: uint128, Indexed: false
   * @param validators Type: address[], Indexed: false
   * @param balances Type: uint256[], Indexed: false
   */
  __GovValidators_init(
    name: string,
    symbol: string,
    duration: BigNumberish,
    quorum: BigNumberish,
    validators: string[],
    balances: BigNumberish[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   * @param parameter1 Type: address, Indexed: false
   */
  addressVotedExternal(
    parameter0: BigNumberish,
    parameter1: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   * @param parameter1 Type: address, Indexed: false
   */
  addressVotedInternal(
    parameter0: BigNumberish,
    parameter1: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param newValues Type: uint256[], Indexed: false
   * @param userAddresses Type: address[], Indexed: false
   */
  changeBalances(
    newValues: BigNumberish[],
    userAddresses: string[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param proposalId Type: uint256, Indexed: false
   * @param duration Type: uint64, Indexed: false
   * @param quorum Type: uint128, Indexed: false
   */
  createExternalProposal(
    proposalId: BigNumberish,
    duration: BigNumberish,
    quorum: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param proposalType Type: uint8, Indexed: false
   * @param newValues Type: uint256[], Indexed: false
   * @param users Type: address[], Indexed: false
   */
  createInternalProposal(
    proposalType: BigNumberish,
    newValues: BigNumberish[],
    users: string[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param proposalId Type: uint256, Indexed: false
   */
  execute(
    proposalId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   */
  externalProposals(
    parameter0: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<CoreResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param proposalId Type: uint256, Indexed: false
   * @param isInternal Type: bool, Indexed: false
   */
  getProposalState(
    proposalId: BigNumberish,
    isInternal: boolean,
    overrides?: ContractCallOverrides
  ): Promise<number>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  govValidatorsToken(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  internalProposalSettings(
    overrides?: ContractCallOverrides
  ): Promise<InternalProposalSettingsResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   */
  internalProposals(
    parameter0: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<InternalProposalsResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param proposalId Type: uint256, Indexed: false
   * @param isInternal Type: bool, Indexed: false
   */
  isQuorumReached(
    proposalId: BigNumberish,
    isInternal: boolean,
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
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  validatorsCount(overrides?: ContractCallOverrides): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param proposalId Type: uint256, Indexed: false
   * @param amount Type: uint256, Indexed: false
   * @param isInternal Type: bool, Indexed: false
   */
  vote(
    proposalId: BigNumberish,
    amount: BigNumberish,
    isInternal: boolean,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
}
