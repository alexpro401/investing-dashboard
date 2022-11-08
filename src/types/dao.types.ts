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
