import { GovPoolFormOptions } from "types"
import { BigNumber } from "@ethersproject/bignumber"
import { Buffer } from "buffer"
import { utils } from "ethers"

export const INITIAL_DAO_PROPOSAL: GovPoolFormOptions = {
  _isErc20: true,
  _isErc721: false,
  _isCustomVoting: false,
  _isDistributionProposal: false,
  _isValidator: false,
  _avatarUrl: "",
  _daoName: "",
  _websiteUrl: "",
  _description: "",
  _socialLinks: [],
  _documents: [{ name: "", url: "" }],
  _userKeeperParams: {
    tokenAddress: "",
    nftAddress: "",
    totalPowerInTokens: 0,
    nftsTotalSupply: 0,
  },
  tokenCreation: {
    name: "",
    symbol: "",
    totalSupply: BigNumber.from(0),
    treasury: BigNumber.from(0),
    initialDistribution: BigNumber.from(0),
    recipients: [],
  },
  _validatorsParams: {
    name: "",
    symbol: "",
    duration: 0,
    quorum: 0,
    validators: [""],
    balances: [0],
  },
  _internalProposalForm: {
    earlyCompletion: false,
    delegatedVotingAllowed: false,
    validatorsVote: true,
    duration: BigNumber.from(0),
    durationValidators: BigNumber.from(0),
    quorum: BigNumber.from(0),
    quorumValidators: BigNumber.from(0),
    minVotesForVoting: BigNumber.from(0),
    minVotesForCreating: BigNumber.from(0),
    rewardToken: "",
    creationReward: BigNumber.from(0),
    executionReward: BigNumber.from(0),
    voteRewardsCoefficient: BigNumber.from(0),
    executorDescription: "internal",
  },
  _distributionProposalSettingsForm: {
    earlyCompletion: false,
    delegatedVotingAllowed: false,
    validatorsVote: true,
    duration: BigNumber.from(0),
    durationValidators: BigNumber.from(0),
    quorum: BigNumber.from(0),
    quorumValidators: BigNumber.from(0),
    minVotesForVoting: BigNumber.from(0),
    minVotesForCreating: BigNumber.from(0),
    rewardToken: "",
    creationReward: BigNumber.from(0),
    executionReward: BigNumber.from(0),
    voteRewardsCoefficient: BigNumber.from(0),
    executorDescription: "DP",
  },
  _validatorsBalancesSettingsForm: {
    earlyCompletion: false,
    delegatedVotingAllowed: false,
    validatorsVote: true,
    duration: BigNumber.from(0),
    durationValidators: BigNumber.from(0),
    quorum: BigNumber.from(0),
    quorumValidators: BigNumber.from(0),
    minVotesForVoting: BigNumber.from(0),
    minVotesForCreating: BigNumber.from(0),
    rewardToken: "",
    creationReward: BigNumber.from(0),
    executionReward: BigNumber.from(0),
    voteRewardsCoefficient: BigNumber.from(0),
    executorDescription: "validators",
  },
  _defaultProposalSettingForm: {
    earlyCompletion: false,
    delegatedVotingAllowed: false,
    validatorsVote: true,
    duration: BigNumber.from(0),
    durationValidators: BigNumber.from(0),
    quorum: BigNumber.from(0),
    quorumValidators: BigNumber.from(0),
    minVotesForVoting: BigNumber.from(0),
    minVotesForCreating: BigNumber.from(0),
    rewardToken: "",
    creationReward: BigNumber.from(0),
    executionReward: BigNumber.from(0),
    voteRewardsCoefficient: BigNumber.from(0),
    executorDescription: "default",
  },
}

const bytes = Buffer.from(JSON.stringify(INITIAL_DAO_PROPOSAL))
const hash = utils.sha512(bytes)

const savedHash = localStorage.getItem("fund-dao-creating-form-hash")

if (savedHash && hash !== savedHash) {
  localStorage.removeItem("fund-dao-creating-form")
}

localStorage.setItem("fund-dao-creating-form-hash", hash)
