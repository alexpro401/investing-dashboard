import { BigNumber } from "@ethersproject/bignumber"

import { SUPPORTED_SOCIALS } from "constants/socials"
import { IGovPool } from "interfaces/typechain/GovPool"
import { Dispatch, SetStateAction } from "react"

export type ExternalFileDocument = {
  name: string
  url: string
}

export interface IGovSettingsFromContract {
  earlyCompletion: boolean
  delegatedVotingAllowed: boolean
  validatorsVote: boolean
  duration: BigNumber
  durationValidators: BigNumber
  quorum: BigNumber
  quorumValidators: BigNumber
  minVotesForVoting: BigNumber
  minVotesForCreating: BigNumber
  rewardToken: string
  creationReward: BigNumber
  executionReward: BigNumber
  voteRewardsCoefficient: BigNumber
  executorDescription: string
}

export type GovPoolSettings = {
  earlyCompletion: boolean
  delegatedVotingAllowed: boolean
  validatorsVote: boolean
  duration: BigNumber
  durationValidators: BigNumber
  quorum: BigNumber
  quorumValidators: BigNumber
  minVotesForVoting: BigNumber
  minVotesForCreating: BigNumber
  rewardToken: string
  creationReward: BigNumber
  executionReward: BigNumber
  voteRewardsCoefficient: BigNumber
  executorDescription: string
}

export type GovPoolFormOptions = {
  _isErc20: boolean
  _isErc721: boolean
  _isCustomVoting: boolean
  _isDistributionProposal: boolean
  _isValidator: boolean
  _avatarUrl: string
  _daoName: string
  _websiteUrl: string
  _description: string
  _socialLinks: [SUPPORTED_SOCIALS, string][]
  _documents: ExternalFileDocument[]
  _userKeeperParams: {
    tokenAddress: string
    nftAddress: string
    totalPowerInTokens: number
    nftsTotalSupply: number
  }
  _validatorsParams: {
    name: string
    symbol: string
    duration: number
    quorum: number
    validators: string[]
    balances: number[]
  }
  _internalProposalForm: GovPoolSettings
  _distributionProposalSettingsForm: GovPoolSettings
  _validatorsBalancesSettingsForm: GovPoolSettings
  _defaultProposalSettingForm: GovPoolSettings
}

export interface UserKeeperDeployParamsForm {
  tokenAddress: { get: string; set: Dispatch<SetStateAction<string>> }
  nftAddress: { get: string; set: Dispatch<SetStateAction<string>> }
  totalPowerInTokens: { get: number; set: Dispatch<SetStateAction<number>> }
  nftsTotalSupply: { get: number; set: Dispatch<SetStateAction<number>> }
}

export interface ValidatorsDeployParamsForm {
  name: { get: string; set: Dispatch<SetStateAction<string>> }
  symbol: { get: string; set: Dispatch<SetStateAction<string>> }
  duration: { get: number; set: Dispatch<SetStateAction<number>> }
  quorum: { get: number; set: Dispatch<SetStateAction<number>> }
  validators: { get: string[]; set: (value: any, idx?: number) => void }
  balances: { get: number[]; set: (value: any, idx?: number) => void }
}

export type GovPoolSettingsState = Record<
  keyof GovPoolSettingsForm,
  [unknown, Dispatch<SetStateAction<unknown>>]
>

export interface GovPoolSettingsForm {
  earlyCompletion: { get: boolean; set: Dispatch<SetStateAction<boolean>> }
  delegatedVotingAllowed: {
    get: boolean
    set: Dispatch<SetStateAction<boolean>>
  }
  validatorsVote: { get: boolean; set: Dispatch<SetStateAction<boolean>> }
  duration: { get: number; set: Dispatch<SetStateAction<number>> }
  durationValidators: { get: number; set: Dispatch<SetStateAction<number>> }
  quorum: { get: string; set: Dispatch<SetStateAction<string>> }
  quorumValidators: { get: string; set: Dispatch<SetStateAction<string>> }
  minVotesForVoting: { get: string; set: Dispatch<SetStateAction<string>> }
  minVotesForCreating: { get: string; set: Dispatch<SetStateAction<string>> }
  rewardToken: { get: string; set: Dispatch<SetStateAction<string>> }
  creationReward: { get: string; set: Dispatch<SetStateAction<string>> }
  executionReward: { get: string; set: Dispatch<SetStateAction<string>> }
  voteRewardsCoefficient: { get: string; set: Dispatch<SetStateAction<string>> }
  executorDescription: { get: string; set: Dispatch<SetStateAction<string>> }
}

export interface IGovPoolDescription {
  avatarUrl: string
  daoName: string
  description: string
  documents: ExternalFileDocument[]
  socialLinks: [SUPPORTED_SOCIALS, string][]
  websiteUrl: string
}

export interface IProposalIPFS {
  proposalName: string
  proposalDescription: string
}

export interface IExecutorSettings {
  executorDescription: string
  id: string
  settingsId: string
  __typename: string
}

export interface IExecutor {
  executorAddress: string
  id: string
  settings: IExecutorSettings
  __typename: string
}

export enum ProposalState {
  Voting = "0",
  WaitingForVotingTransfer = "1",
  ValidatorVoting = "2",
  Defeated = "3",
  Succeeded = "4",
  Executed = "5",
  Undefined = "6",
}

export type ProposalStatuses =
  | "opened"
  | "opened-insurance"
  | "ended-passed"
  | "ended-rejected"
  | "completed-all"
  | "completed-rewards"
  | "completed-distribution"

export const proposalStatusToStates: Record<ProposalStatuses, ProposalState[]> =
  {
    opened: [
      ProposalState.Voting,
      ProposalState.WaitingForVotingTransfer,
      ProposalState.ValidatorVoting,
    ],
    "opened-insurance": [
      ProposalState.Voting,
      ProposalState.WaitingForVotingTransfer,
      ProposalState.ValidatorVoting,
    ],
    "ended-passed": [ProposalState.Succeeded],
    "ended-rejected": [ProposalState.Defeated],
    "completed-all": [ProposalState.Executed],
    "completed-rewards": [ProposalState.Executed],
    "completed-distribution": [ProposalState.Succeeded, ProposalState.Executed],
  }

export type IExecutorType =
  | "profile"
  | "change-settings"
  | "change-validator-balances"
  | "distribution"
  | "add-token"
  | "custom"
  | "insurance"

export const proposalTypeDataDecodingMap: Record<IExecutorType, string[]> = {
  ["profile"]: ["string"], // description ipfs path
  ["change-settings"]: [
    "uint256[]",
    "tuple(bool,bool,bool,uint64,uint64,uint128,uint128,uint256,uint256,address,uint256,uint256,uint256,string)[]",
  ],
  ["change-validator-balances"]: ["uint256[]", "address[]"],
  ["distribution"]: [],
  ["add-token"]: [],
  ["custom"]: [],
  ["insurance"]: [],
}

export type WrappedProposalView = IGovPool.ProposalViewStructOutput & {
  proposalId: number
  currentAccountRewards?: BigNumber
}

export enum EDaoProfileTab {
  about = "About DAO",
  my_balance = "My Balance",
  validators = "Validators",
  delegations = "Delegation",
}
