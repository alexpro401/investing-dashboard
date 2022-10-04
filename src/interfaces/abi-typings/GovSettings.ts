import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from "ethers"
import { EthersContractContextV5 } from "ethereum-abi-types-generator"

export type ContractContext = EthersContractContextV5<
  GovSettings,
  GovSettingsMethodNames,
  GovSettingsEventsContext,
  GovSettingsEvents
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
export type GovSettingsEvents = "OwnershipTransferred"
export interface GovSettingsEventsContext {
  OwnershipTransferred(...parameters: any): EventFilter
}
export type GovSettingsMethodNames =
  | "__GovSettings_init"
  | "addSettings"
  | "changeExecutors"
  | "editSettings"
  | "executorInfo"
  | "executorToSettings"
  | "getDefaultSettings"
  | "getSettings"
  | "owner"
  | "renounceOwnership"
  | "settings"
  | "transferOwnership"
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string
  newOwner: string
}
export interface __GovSettings_initRequest {
  earlyCompletion: boolean
  delegatedVotingAllowed: boolean
  validatorsVote: boolean
  duration: BigNumberish
  durationValidators: BigNumberish
  quorum: BigNumberish
  quorumValidators: BigNumberish
  minVotesForVoting: BigNumberish
  minVotesForCreating: BigNumberish
  rewardToken: string
  creationReward: BigNumberish
  executionReward: BigNumberish
  voteRewardsCoefficient: BigNumberish
  executorDescription: string
}
export interface AddSettingsRequest {
  earlyCompletion: boolean
  delegatedVotingAllowed: boolean
  validatorsVote: boolean
  duration: BigNumberish
  durationValidators: BigNumberish
  quorum: BigNumberish
  quorumValidators: BigNumberish
  minVotesForVoting: BigNumberish
  minVotesForCreating: BigNumberish
  rewardToken: string
  creationReward: BigNumberish
  executionReward: BigNumberish
  voteRewardsCoefficient: BigNumberish
  executorDescription: string
}
export interface EditSettingsRequest {
  earlyCompletion: boolean
  delegatedVotingAllowed: boolean
  validatorsVote: boolean
  duration: BigNumberish
  durationValidators: BigNumberish
  quorum: BigNumberish
  quorumValidators: BigNumberish
  minVotesForVoting: BigNumberish
  minVotesForCreating: BigNumberish
  rewardToken: string
  creationReward: BigNumberish
  executionReward: BigNumberish
  voteRewardsCoefficient: BigNumberish
  executorDescription: string
}
export interface ExecutorInfoResponse {
  result0: BigNumber
  0: BigNumber
  result1: number
  1: number
  length: 2
}
export interface ProposalsettingsResponse {
  earlyCompletion: boolean
  0: boolean
  delegatedVotingAllowed: boolean
  1: boolean
  validatorsVote: boolean
  2: boolean
  duration: BigNumber
  3: BigNumber
  durationValidators: BigNumber
  4: BigNumber
  quorum: BigNumber
  5: BigNumber
  quorumValidators: BigNumber
  6: BigNumber
  minVotesForVoting: BigNumber
  7: BigNumber
  minVotesForCreating: BigNumber
  8: BigNumber
  rewardToken: string
  9: string
  creationReward: BigNumber
  10: BigNumber
  executionReward: BigNumber
  11: BigNumber
  voteRewardsCoefficient: BigNumber
  12: BigNumber
  executorDescription: string
  13: string
}
export interface SettingsResponse {
  earlyCompletion: boolean
  0: boolean
  delegatedVotingAllowed: boolean
  1: boolean
  validatorsVote: boolean
  2: boolean
  duration: BigNumber
  3: BigNumber
  durationValidators: BigNumber
  4: BigNumber
  quorum: BigNumber
  5: BigNumber
  quorumValidators: BigNumber
  6: BigNumber
  minVotesForVoting: BigNumber
  7: BigNumber
  minVotesForCreating: BigNumber
  8: BigNumber
  rewardToken: string
  9: string
  creationReward: BigNumber
  10: BigNumber
  executionReward: BigNumber
  11: BigNumber
  voteRewardsCoefficient: BigNumber
  12: BigNumber
  executorDescription: string
  13: string
  length: 14
}
export interface GovSettings {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param govPoolAddress Type: address, Indexed: false
   * @param distributionProposalAddress Type: address, Indexed: false
   * @param validatorsAddress Type: address, Indexed: false
   * @param govUserKeeperAddress Type: address, Indexed: false
   * @param internalProposalSettings Type: tuple, Indexed: false
   * @param distributionProposalSettings Type: tuple, Indexed: false
   * @param validatorsBalancesSettings Type: tuple, Indexed: false
   * @param defaultProposalSettings Type: tuple, Indexed: false
   */
  __GovSettings_init(
    govPoolAddress: string,
    distributionProposalAddress: string,
    validatorsAddress: string,
    govUserKeeperAddress: string,
    internalProposalSettings: __GovSettings_initRequest,
    distributionProposalSettings: __GovSettings_initRequest,
    validatorsBalancesSettings: __GovSettings_initRequest,
    defaultProposalSettings: __GovSettings_initRequest,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _settings Type: tuple[], Indexed: false
   */
  addSettings(
    _settings: AddSettingsRequest[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param executors Type: address[], Indexed: false
   * @param settingsIds Type: uint256[], Indexed: false
   */
  changeExecutors(
    executors: string[],
    settingsIds: BigNumberish[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param settingsIds Type: uint256[], Indexed: false
   * @param _settings Type: tuple[], Indexed: false
   */
  editSettings(
    settingsIds: BigNumberish[],
    _settings: EditSettingsRequest[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param executor Type: address, Indexed: false
   */
  executorInfo(
    executor: string,
    overrides?: ContractCallOverrides
  ): Promise<ExecutorInfoResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   */
  executorToSettings(
    parameter0: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getDefaultSettings(
    overrides?: ContractCallOverrides
  ): Promise<ProposalsettingsResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param executor Type: address, Indexed: false
   */
  getSettings(
    executor: string,
    overrides?: ContractCallOverrides
  ): Promise<ProposalsettingsResponse>
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
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   */
  settings(
    parameter0: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<SettingsResponse>
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
