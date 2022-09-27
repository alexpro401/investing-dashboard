import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from "ethers"
import { EthersContractContextV5 } from "ethereum-abi-types-generator"

export type ContractContext = EthersContractContextV5<
  PoolFactory,
  PoolFactoryMethodNames,
  PoolFactoryEventsContext,
  PoolFactoryEvents
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
export type PoolFactoryEvents = "TraderPoolDeployed"
export interface PoolFactoryEventsContext {
  TraderPoolDeployed(...parameters: any): EventFilter
}
export type PoolFactoryMethodNames =
  | "deployBasicPool"
  | "deployGovPool"
  | "deployInvestPool"
  | "getInjector"
  | "setDependencies"
  | "setInjector"
export interface TraderPoolDeployedEventEmittedResponse {
  poolType: string
  symbol: string
  name: string
  at: string
  proposalContract: string
  trader: string
  basicToken: string
  commission: BigNumberish
  descriptionURL: string
}
export interface DeployBasicPoolRequest {
  descriptionURL: string
  trader: string
  privatePool: boolean
  totalLPEmission: BigNumberish
  baseToken: string
  minimalInvestment: BigNumberish
  commissionPeriod: BigNumberish
  commissionPercentage: BigNumberish
}
export interface SettingsParamsRequestRequest {
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
export interface ValidatorsParamsRequest {
  name: string
  symbol: string
  duration: BigNumberish
  quorum: BigNumberish
  validators: string[]
  balances: BigNumberish[]
}
export interface UserKeeperParamsRequest {
  tokenAddress: string
  nftAddress: string
  totalPowerInTokens: BigNumberish
  nftsTotalSupply: BigNumberish
}
export interface DeployGovPoolRequest {
  settingsParams: SettingsParamsRequest
  validatorsParams: ValidatorsParamsRequest
  userKeeperParams: UserKeeperParamsRequest
  descriptionURL: string
}
export interface DeployInvestPoolRequest {
  descriptionURL: string
  trader: string
  privatePool: boolean
  totalLPEmission: BigNumberish
  baseToken: string
  minimalInvestment: BigNumberish
  commissionPeriod: BigNumberish
  commissionPercentage: BigNumberish
}
export interface PoolFactory {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param name Type: string, Indexed: false
   * @param symbol Type: string, Indexed: false
   * @param parameters Type: tuple, Indexed: false
   */
  deployBasicPool(
    name: string,
    symbol: string,
    parameters: DeployBasicPoolRequest,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param parameters Type: tuple, Indexed: false
   */
  deployGovPool(
    parameters: DeployGovPoolRequest,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param name Type: string, Indexed: false
   * @param symbol Type: string, Indexed: false
   * @param parameters Type: tuple, Indexed: false
   */
  deployInvestPool(
    name: string,
    symbol: string,
    parameters: DeployInvestPoolRequest,
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
}
