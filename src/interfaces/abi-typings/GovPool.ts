import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from "ethers"
import { EthersContractContextV5 } from "ethereum-abi-types-generator"

export type ContractContext = EthersContractContextV5<
  GovPool,
  GovPoolMethodNames,
  GovPoolEventsContext,
  GovPoolEvents
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
export type GovPoolEvents =
  | "DPCreated"
  | "Delegated"
  | "ProposalCreated"
  | "ProposalExecuted"
  | "RewardClaimed"
  | "Voted"
export interface GovPoolEventsContext {
  DPCreated(...parameters: any): EventFilter
  Delegated(...parameters: any): EventFilter
  ProposalCreated(...parameters: any): EventFilter
  ProposalExecuted(...parameters: any): EventFilter
  RewardClaimed(...parameters: any): EventFilter
  Voted(...parameters: any): EventFilter
}
export type GovPoolMethodNames =
  | "__GovPool_init"
  | "claimRewards"
  | "createProposal"
  | "delegate"
  | "deposit"
  | "descriptionURL"
  | "distributionProposal"
  | "editDescriptionURL"
  | "execute"
  | "executeAndClaim"
  | "getInjector"
  | "getProposalInfo"
  | "getProposalState"
  | "getTotalVotes"
  | "getUndelegateableAssets"
  | "getUnlockedNfts"
  | "getUserProposals"
  | "getWithdrawableAssets"
  | "govSetting"
  | "govUserKeeper"
  | "govValidators"
  | "moveProposalToValidators"
  | "onERC1155BatchReceived"
  | "onERC1155Received"
  | "onERC721Received"
  | "pendingRewards"
  | "proposals"
  | "setDependencies"
  | "setInjector"
  | "supportsInterface"
  | "undelegate"
  | "unlock"
  | "unlockInProposals"
  | "vote"
  | "voteDelegated"
  | "withdraw"
export interface DPCreatedEventEmittedResponse {
  proposalId: BigNumberish
  sender: string
  token: string
  amount: BigNumberish
}
export interface DelegatedEventEmittedResponse {
  from: string
  to: string
  amount: BigNumberish
  nfts: BigNumberish[]
  isDelegate: boolean
}
export interface ProposalCreatedEventEmittedResponse {
  proposalId: BigNumberish
  sender: string
  quorum: BigNumberish
  mainExecutor: string
}
export interface ProposalExecutedEventEmittedResponse {
  proposalId: BigNumberish
  sender: string
}
export interface RewardClaimedEventEmittedResponse {
  proposalId: BigNumberish
  sender: string
  token: string
  amount: BigNumberish
}
export interface VotedEventEmittedResponse {
  proposalId: BigNumberish
  sender: string
  personalVote: BigNumberish
  delegatedVote: BigNumberish
}
export interface GetProposalInfoResponse {
  result0: string[]
  0: string[]
  result1: string[]
  1: string[]
  length: 2
}
export interface GetTotalVotesResponse {
  result0: BigNumber
  0: BigNumber
  result1: BigNumber
  1: BigNumber
  length: 2
}
export interface UndelegateableNftsResponse {
  values: BigNumber[]
  0: BigNumber[]
  length: BigNumber
  1: BigNumber
}
export interface GetUndelegateableAssetsResponse {
  undelegateableTokens: BigNumber
  0: BigNumber
  undelegateableNfts: UndelegateableNftsResponse
  1: UndelegateableNftsResponse
  length: 2
}
export interface GetUnlockedNftsRequest {
  values: BigNumberish[]
  length: BigNumberish
}
export interface UnlockedIdsResponse {
  values: BigNumber[]
  0: BigNumber[]
  length: BigNumber
  1: BigNumber
}
export interface LockedIdsResponse {
  values: BigNumber[]
  0: BigNumber[]
  length: BigNumber
  1: BigNumber
}
export interface GetUserProposalsResponse {
  unlockedIds: UnlockedIdsResponse
  0: UnlockedIdsResponse
  lockedIds: LockedIdsResponse
  1: LockedIdsResponse
  length: 2
}
export interface WithdrawableNftsResponse {
  values: BigNumber[]
  0: BigNumber[]
  length: BigNumber
  1: BigNumber
}
export interface GetWithdrawableAssetsResponse {
  withdrawableTokens: BigNumber
  0: BigNumber
  withdrawableNfts: WithdrawableNftsResponse
  1: WithdrawableNftsResponse
  length: 2
}
export interface SettingsResponse {
  earlyCompletion: boolean
  0: SettingsResponse
  delegatedVotingAllowed: boolean
  1: SettingsResponse
  validatorsVote: boolean
  2: SettingsResponse
  duration: BigNumber
  3: SettingsResponse
  durationValidators: BigNumber
  4: SettingsResponse
  quorum: BigNumber
  5: SettingsResponse
  quorumValidators: BigNumber
  6: SettingsResponse
  minVotesForVoting: BigNumber
  7: SettingsResponse
  minVotesForCreating: BigNumber
  8: SettingsResponse
  rewardToken: string
  9: SettingsResponse
  creationReward: BigNumber
  10: SettingsResponse
  executionReward: BigNumber
  11: SettingsResponse
  voteRewardsCoefficient: BigNumber
  12: SettingsResponse
  executorDescription: string
  13: SettingsResponse
}
export interface CoreResponse {
  settings: SettingsResponse
  0: SettingsResponse
  executed: boolean
  1: boolean
  voteEnd: BigNumber
  2: BigNumber
  votesFor: BigNumber
  3: BigNumber
  nftPowerSnapshotId: BigNumber
  4: BigNumber
  proposalId: BigNumber
  5: BigNumber
}
export interface ProposalsResponse {
  core: CoreResponse
  0: CoreResponse
  descriptionURL: string
  1: string
  length: 2
}
export interface GovPool {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param govSettingAddress Type: address, Indexed: false
   * @param govUserKeeperAddress Type: address, Indexed: false
   * @param distributionProposalAddress Type: address, Indexed: false
   * @param validatorsAddress Type: address, Indexed: false
   * @param _descriptionURL Type: string, Indexed: false
   */
  __GovPool_init(
    govSettingAddress: string,
    govUserKeeperAddress: string,
    distributionProposalAddress: string,
    validatorsAddress: string,
    _descriptionURL: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param proposalIds Type: uint256[], Indexed: false
   */
  claimRewards(
    proposalIds: BigNumberish[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _descriptionURL Type: string, Indexed: false
   * @param executors Type: address[], Indexed: false
   * @param values Type: uint256[], Indexed: false
   * @param data Type: bytes[], Indexed: false
   */
  createProposal(
    _descriptionURL: string,
    executors: string[],
    values: BigNumberish[],
    data: Arrayish[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param delegatee Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   * @param nftIds Type: uint256[], Indexed: false
   */
  delegate(
    delegatee: string,
    amount: BigNumberish,
    nftIds: BigNumberish[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param receiver Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   * @param nftIds Type: uint256[], Indexed: false
   */
  deposit(
    receiver: string,
    amount: BigNumberish,
    nftIds: BigNumberish[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  descriptionURL(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  distributionProposal(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param newDescriptionURL Type: string, Indexed: false
   */
  editDescriptionURL(
    newDescriptionURL: string,
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
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param proposalId Type: uint256, Indexed: false
   */
  executeAndClaim(
    proposalId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
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
   * @param proposalId Type: uint256, Indexed: false
   */
  getProposalInfo(
    proposalId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<GetProposalInfoResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param proposalId Type: uint256, Indexed: false
   */
  getProposalState(
    proposalId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<number>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param proposalId Type: uint256, Indexed: false
   * @param voter Type: address, Indexed: false
   * @param isMicropool Type: bool, Indexed: false
   */
  getTotalVotes(
    proposalId: BigNumberish,
    voter: string,
    isMicropool: boolean,
    overrides?: ContractCallOverrides
  ): Promise<GetTotalVotesResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param delegator Type: address, Indexed: false
   * @param delegatee Type: address, Indexed: false
   */
  getUndelegateableAssets(
    delegator: string,
    delegatee: string,
    overrides?: ContractCallOverrides
  ): Promise<GetUndelegateableAssetsResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param unlockedIds Type: tuple, Indexed: false
   * @param user Type: address, Indexed: false
   * @param isMicropool Type: bool, Indexed: false
   */
  getUnlockedNfts(
    unlockedIds: GetUnlockedNftsRequest,
    user: string,
    isMicropool: boolean,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber[]>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param user Type: address, Indexed: false
   * @param isMicropool Type: bool, Indexed: false
   */
  getUserProposals(
    user: string,
    isMicropool: boolean,
    overrides?: ContractCallOverrides
  ): Promise<GetUserProposalsResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param user Type: address, Indexed: false
   */
  getWithdrawableAssets(
    user: string,
    overrides?: ContractCallOverrides
  ): Promise<GetWithdrawableAssetsResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  govSetting(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  govUserKeeper(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  govValidators(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param proposalId Type: uint256, Indexed: false
   */
  moveProposalToValidators(
    proposalId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   * @param parameter1 Type: address, Indexed: false
   * @param parameter2 Type: uint256[], Indexed: false
   * @param parameter3 Type: uint256[], Indexed: false
   * @param parameter4 Type: bytes, Indexed: false
   */
  onERC1155BatchReceived(
    parameter0: string,
    parameter1: string,
    parameter2: BigNumberish[],
    parameter3: BigNumberish[],
    parameter4: Arrayish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   * @param parameter1 Type: address, Indexed: false
   * @param parameter2 Type: uint256, Indexed: false
   * @param parameter3 Type: uint256, Indexed: false
   * @param parameter4 Type: bytes, Indexed: false
   */
  onERC1155Received(
    parameter0: string,
    parameter1: string,
    parameter2: BigNumberish,
    parameter3: BigNumberish,
    parameter4: Arrayish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   * @param parameter1 Type: address, Indexed: false
   * @param parameter2 Type: uint256, Indexed: false
   * @param parameter3 Type: bytes, Indexed: false
   */
  onERC721Received(
    parameter0: string,
    parameter1: string,
    parameter2: BigNumberish,
    parameter3: Arrayish,
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
  pendingRewards(
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
   */
  proposals(
    parameter0: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<ProposalsResponse>
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
   * @param interfaceId Type: bytes4, Indexed: false
   */
  supportsInterface(
    interfaceId: Arrayish,
    overrides?: ContractCallOverrides
  ): Promise<boolean>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param delegatee Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   * @param nftIds Type: uint256[], Indexed: false
   */
  undelegate(
    delegatee: string,
    amount: BigNumberish,
    nftIds: BigNumberish[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param user Type: address, Indexed: false
   * @param isMicropool Type: bool, Indexed: false
   */
  unlock(
    user: string,
    isMicropool: boolean,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param proposalIds Type: uint256[], Indexed: false
   * @param user Type: address, Indexed: false
   * @param isMicropool Type: bool, Indexed: false
   */
  unlockInProposals(
    proposalIds: BigNumberish[],
    user: string,
    isMicropool: boolean,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param proposalId Type: uint256, Indexed: false
   * @param depositAmount Type: uint256, Indexed: false
   * @param depositNftIds Type: uint256[], Indexed: false
   * @param voteAmount Type: uint256, Indexed: false
   * @param voteNftIds Type: uint256[], Indexed: false
   */
  vote(
    proposalId: BigNumberish,
    depositAmount: BigNumberish,
    depositNftIds: BigNumberish[],
    voteAmount: BigNumberish,
    voteNftIds: BigNumberish[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param proposalId Type: uint256, Indexed: false
   * @param voteAmount Type: uint256, Indexed: false
   * @param voteNftIds Type: uint256[], Indexed: false
   */
  voteDelegated(
    proposalId: BigNumberish,
    voteAmount: BigNumberish,
    voteNftIds: BigNumberish[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param receiver Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   * @param nftIds Type: uint256[], Indexed: false
   */
  withdraw(
    receiver: string,
    amount: BigNumberish,
    nftIds: BigNumberish[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
}
