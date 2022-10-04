import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from "ethers"
import { EthersContractContextV5 } from "ethereum-abi-types-generator"

export type ContractContext = EthersContractContextV5<
  DistributionProposal,
  DistributionProposalMethodNames,
  DistributionProposalEventsContext,
  DistributionProposalEvents
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
export type DistributionProposalEvents = undefined
export interface DistributionProposalEventsContext {}
export type DistributionProposalMethodNames =
  | "__DistributionProposal_init"
  | "claim"
  | "execute"
  | "getPotentialReward"
  | "govAddress"
  | "proposals"
export interface ProposalsResponse {
  rewardAddress: string
  0: string
  rewardAmount: BigNumber
  1: BigNumber
  length: 2
}
export interface DistributionProposal {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _govAddress Type: address, Indexed: false
   */
  __DistributionProposal_init(
    _govAddress: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param voter Type: address, Indexed: false
   * @param proposalIds Type: uint256[], Indexed: false
   */
  claim(
    voter: string,
    proposalIds: BigNumberish[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param proposalId Type: uint256, Indexed: false
   * @param token Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  execute(
    proposalId: BigNumberish,
    token: string,
    amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param proposalId Type: uint256, Indexed: false
   * @param voter Type: address, Indexed: false
   * @param rewardAmount Type: uint256, Indexed: false
   */
  getPotentialReward(
    proposalId: BigNumberish,
    voter: string,
    rewardAmount: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  govAddress(overrides?: ContractCallOverrides): Promise<string>
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
}
