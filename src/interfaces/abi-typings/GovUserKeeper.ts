import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from "ethers"
import { EthersContractContextV5 } from "ethereum-abi-types-generator"

export type ContractContext = EthersContractContextV5<
  GovUserKeeper,
  GovUserKeeperMethodNames,
  GovUserKeeperEventsContext,
  GovUserKeeperEvents
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
export type GovUserKeeperEvents = "OwnershipTransferred"
export interface GovUserKeeperEventsContext {
  OwnershipTransferred(...parameters: any): EventFilter
}
export type GovUserKeeperMethodNames =
  | "__GovUserKeeper_init"
  | "canParticipate"
  | "createNftPowerSnapshot"
  | "delegateNfts"
  | "delegateTokens"
  | "depositNfts"
  | "depositTokens"
  | "getNftsPowerInTokens"
  | "getTotalVoteWeight"
  | "getUndelegateableAssets"
  | "getWithdrawableAssets"
  | "lockNfts"
  | "lockTokens"
  | "maxLockedAmount"
  | "nftAddress"
  | "nftBalance"
  | "nftExactBalance"
  | "nftInfo"
  | "nftSnapshot"
  | "onERC721Received"
  | "owner"
  | "renounceOwnership"
  | "setERC20Address"
  | "setERC721Address"
  | "tokenAddress"
  | "tokenBalance"
  | "transferOwnership"
  | "undelegateNfts"
  | "undelegateTokens"
  | "unlockNfts"
  | "unlockTokens"
  | "updateMaxTokenLockedAmount"
  | "withdrawNfts"
  | "withdrawTokens"
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string
  newOwner: string
}
export interface GetUndelegateableAssetsRequest {
  values: BigNumberish[]
  length: BigNumberish
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
export interface GetWithdrawableAssetsRequest {
  values: BigNumberish[]
  length: BigNumberish
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
export interface NftInfoResponse {
  isSupportPower: boolean
  0: boolean
  isSupportTotalSupply: boolean
  1: boolean
  totalPowerInTokens: BigNumber
  2: BigNumber
  totalSupply: BigNumber
  3: BigNumber
  length: 4
}
export interface NftSnapshotResponse {
  totalSupply: BigNumber
  0: BigNumber
  totalNftsPower: BigNumber
  1: BigNumber
  length: 2
}
export interface GovUserKeeper {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _tokenAddress Type: address, Indexed: false
   * @param _nftAddress Type: address, Indexed: false
   * @param totalPowerInTokens Type: uint256, Indexed: false
   * @param nftsTotalSupply Type: uint256, Indexed: false
   */
  __GovUserKeeper_init(
    _tokenAddress: string,
    _nftAddress: string,
    totalPowerInTokens: BigNumberish,
    nftsTotalSupply: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param voter Type: address, Indexed: false
   * @param isMicropool Type: bool, Indexed: false
   * @param useDelegated Type: bool, Indexed: false
   * @param requiredVotes Type: uint256, Indexed: false
   * @param snapshotId Type: uint256, Indexed: false
   */
  canParticipate(
    voter: string,
    isMicropool: boolean,
    useDelegated: boolean,
    requiredVotes: BigNumberish,
    snapshotId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<boolean>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  createNftPowerSnapshot(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param delegator Type: address, Indexed: false
   * @param delegatee Type: address, Indexed: false
   * @param nftIds Type: uint256[], Indexed: false
   */
  delegateNfts(
    delegator: string,
    delegatee: string,
    nftIds: BigNumberish[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param delegator Type: address, Indexed: false
   * @param delegatee Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  delegateTokens(
    delegator: string,
    delegatee: string,
    amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param payer Type: address, Indexed: false
   * @param receiver Type: address, Indexed: false
   * @param nftIds Type: uint256[], Indexed: false
   */
  depositNfts(
    payer: string,
    receiver: string,
    nftIds: BigNumberish[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param payer Type: address, Indexed: false
   * @param receiver Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  depositTokens(
    payer: string,
    receiver: string,
    amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param nftIds Type: uint256[], Indexed: false
   * @param snapshotId Type: uint256, Indexed: false
   */
  getNftsPowerInTokens(
    nftIds: BigNumberish[],
    snapshotId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getTotalVoteWeight(overrides?: ContractCallOverrides): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param delegator Type: address, Indexed: false
   * @param delegatee Type: address, Indexed: false
   * @param lockedProposals Type: tuple, Indexed: false
   * @param unlockedNfts Type: uint256[], Indexed: false
   */
  getUndelegateableAssets(
    delegator: string,
    delegatee: string,
    lockedProposals: GetUndelegateableAssetsRequest,
    unlockedNfts: BigNumberish[],
    overrides?: ContractCallOverrides
  ): Promise<GetUndelegateableAssetsResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param voter Type: address, Indexed: false
   * @param lockedProposals Type: tuple, Indexed: false
   * @param unlockedNfts Type: uint256[], Indexed: false
   */
  getWithdrawableAssets(
    voter: string,
    lockedProposals: GetWithdrawableAssetsRequest,
    unlockedNfts: BigNumberish[],
    overrides?: ContractCallOverrides
  ): Promise<GetWithdrawableAssetsResponse>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param voter Type: address, Indexed: false
   * @param isMicropool Type: bool, Indexed: false
   * @param useDelegated Type: bool, Indexed: false
   * @param nftIds Type: uint256[], Indexed: false
   */
  lockNfts(
    voter: string,
    isMicropool: boolean,
    useDelegated: boolean,
    nftIds: BigNumberish[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param proposalId Type: uint256, Indexed: false
   * @param voter Type: address, Indexed: false
   * @param isMicropool Type: bool, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  lockTokens(
    proposalId: BigNumberish,
    voter: string,
    isMicropool: boolean,
    amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param voter Type: address, Indexed: false
   * @param isMicropool Type: bool, Indexed: false
   */
  maxLockedAmount(
    voter: string,
    isMicropool: boolean,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  nftAddress(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param voter Type: address, Indexed: false
   * @param isMicropool Type: bool, Indexed: false
   * @param useDelegated Type: bool, Indexed: false
   */
  nftBalance(
    voter: string,
    isMicropool: boolean,
    useDelegated: boolean,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param voter Type: address, Indexed: false
   * @param isMicropool Type: bool, Indexed: false
   * @param useDelegated Type: bool, Indexed: false
   */
  nftExactBalance(
    voter: string,
    isMicropool: boolean,
    useDelegated: boolean,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber[]>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  nftInfo(overrides?: ContractCallOverrides): Promise<NftInfoResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   */
  nftSnapshot(
    parameter0: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<NftSnapshotResponse>
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
   * @param _tokenAddress Type: address, Indexed: false
   */
  setERC20Address(
    _tokenAddress: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _nftAddress Type: address, Indexed: false
   * @param totalPowerInTokens Type: uint256, Indexed: false
   * @param nftsTotalSupply Type: uint256, Indexed: false
   */
  setERC721Address(
    _nftAddress: string,
    totalPowerInTokens: BigNumberish,
    nftsTotalSupply: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  tokenAddress(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param voter Type: address, Indexed: false
   * @param isMicropool Type: bool, Indexed: false
   * @param useDelegated Type: bool, Indexed: false
   */
  tokenBalance(
    voter: string,
    isMicropool: boolean,
    useDelegated: boolean,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>
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
   * @param delegator Type: address, Indexed: false
   * @param delegatee Type: address, Indexed: false
   * @param nftIds Type: uint256[], Indexed: false
   */
  undelegateNfts(
    delegator: string,
    delegatee: string,
    nftIds: BigNumberish[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param delegator Type: address, Indexed: false
   * @param delegatee Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  undelegateTokens(
    delegator: string,
    delegatee: string,
    amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param nftIds Type: uint256[], Indexed: false
   */
  unlockNfts(
    nftIds: BigNumberish[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param proposalId Type: uint256, Indexed: false
   * @param voter Type: address, Indexed: false
   * @param isMicropool Type: bool, Indexed: false
   */
  unlockTokens(
    proposalId: BigNumberish,
    voter: string,
    isMicropool: boolean,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param lockedProposals Type: uint256[], Indexed: false
   * @param voter Type: address, Indexed: false
   * @param isMicropool Type: bool, Indexed: false
   */
  updateMaxTokenLockedAmount(
    lockedProposals: BigNumberish[],
    voter: string,
    isMicropool: boolean,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param payer Type: address, Indexed: false
   * @param receiver Type: address, Indexed: false
   * @param nftIds Type: uint256[], Indexed: false
   */
  withdrawNfts(
    payer: string,
    receiver: string,
    nftIds: BigNumberish[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param payer Type: address, Indexed: false
   * @param receiver Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  withdrawTokens(
    payer: string,
    receiver: string,
    amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
}
