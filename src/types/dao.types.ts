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

export type ProposalSettings = {
  earlyCompletion: boolean
  delegatedVotingAllowed: boolean
  validatorsVote: boolean
  duration: number
  durationValidators: number
  quorum: number
  quorumValidators: number
  minVotesForVoting: number
  minVotesForCreating: number
  rewardToken: string
  creationReward: number
  executionReward: number
  voteRewardsCoefficient: number
  executorDescription: string
}

export type ProposalCore = {
  settings: ProposalSettings
  executed: boolean
  voteEnd: number
  votesFor: number
  nftPowerSnapshotId: number
  proposalId: number
}

export type Proposal = {
  core: ProposalCore
  descriptionURL: string
  executors: string[]
  values: number[]
  data: string
}

export type ExternalProposalCore = {
  executed: boolean
  voteEnd: number
  quorum: number
  votesFor: number
  snapshotId: number
}

export type ExternalProposal = {
  core: ExternalProposalCore
}

export type ProposalView = {
  proposal: Proposal
  validatorProposal: ExternalProposal
}
