import { SUPPORTED_SOCIALS } from "constants/socials"

export type ExternalFileDocument = {
  name: string
  url: string
}

export type DaoVotingSettings = {
  earlyCompletion: boolean
  delegatedVotingAllowed: boolean
  validatorsVote: boolean
  duration: number
  durationValidators: number
  quorum: string
  quorumValidators: string
  minVotesForVoting: string
  minVotesForCreating: string
  rewardToken: string
  creationReward: string
  executionReward: string
  voteRewardsCoefficient: string
  executorDescription: string
}

export type DaoProposal = {
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
  _internalProposalForm: DaoVotingSettings
  _distributionProposalSettingsForm: DaoVotingSettings
  _validatorsBalancesSettingsForm: DaoVotingSettings
  _defaultProposalSettingForm: DaoVotingSettings
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

export enum ExecutorType {
  DEFAULT = "0",
  INTERNAL = "1",
  DISTRIBUTION = "2",
  VALIDATORS = "3",
}

export const govPoolProposals = {
  [ExecutorType.INTERNAL]: {
    changeInternalDuration: "change-internal-duration",
    changeInternalQuorum: "change-internal-quorum",
    changeInternalDurationAndQuorum: "change-internal-duration-and-quorum",
    changeInternalBalances: "change-internal-balances",
  },
}
