import { BigNumberish } from "@ethersproject/bignumber"

export interface IGovDistributionProposal {
  id: string
  token: string
  amount: BigNumberish
  proposal: { id: string }
}

export interface IGovPoolVoterQuery {
  id: string
  receivedDelegation: string
  receivedNFTDelegation: string[]
  totalDPClaimed: string
  totalClaimedUSD: string
  claimedDPs: IGovDistributionProposal[]

  currentDelegatorsCount: string
}

export interface IGovPoolVoterInProposalQuery {
  id: string
  totalVoteAmount: BigNumberish
  totalDelegatedVoteAmount: BigNumberish
  claimedReward: BigNumberish
  claimedDpRewardUSD: BigNumberish
  proposal: { id: string }
}

export interface IGovPoolSettingsQuery {
  id: string
  settingsId: string
  executorDescription: string
}

export interface IGovPoolExecutor {
  id: string
  executorAddress: string
  settings: IGovPoolSettingsQuery
}

export interface IGovPoolQuery {
  id: string
  name: string
  votersCount: string
  creationTime: string
  creationBlock: string
  voters: IGovPoolVoterQuery[]
  settings: IGovPoolSettingsQuery[]
  executors: IGovPoolExecutor[]
}

export interface IGovPoolDelegationHistoryQuery {
  id: string
  pool: {
    id: string
  }
  timestamp: string
  from: {
    id: string
  }
  to: {
    id: string
  }
  isDelegate: boolean
  amount: BigNumberish
  nfts: string[]
}

export interface IGovVoterInPoolPairsQuery {
  id: string
  from: {
    id: string
    pool: { id: string }
    voter: {
      id: string
    }
  }
  to: {
    id: string
    voter: {
      id: string
    }
  }
  delegateAmount: BigNumberish
  delegateNfts: BigNumberish[]
  history?: IGovPoolDelegationHistoryQuery[]
}

export interface IGovProposalVoteQuery {
  id: string
  hash: string
  timestamp: BigNumberish
  personalAmount: BigNumberish
  delegatedAmount: BigNumberish
  voter: { id: string }
  proposal: { id: string }
}

export interface IGovProposalQuery {
  id: string
  proposalId: BigNumberish
  isDP: boolean
  creator: string
  executor?: string
  executionTimestamp: BigNumberish
  currentVotes: BigNumberish
  quorum: BigNumberish
  description: string
  votersVoted: BigNumberish
  pool: { id: string }
  distributionProposal?: IGovDistributionProposal[]
  settings: IGovPoolSettingsQuery
  voters: { id: string }[]
  votes: IGovProposalVoteQuery[]
}

export interface IGovProposalQuery {
  id: string
  proposalId: BigNumberish
  isDP: boolean
  creator: string
  executor?: string
  executionTimestamp: BigNumberish
  currentVotes: BigNumberish
  quorum: BigNumberish
  description: string
  votersVoted: BigNumberish
  pool: { id: string }
  distributionProposal?: IGovDistributionProposal[]
  settings: IGovPoolSettingsQuery
  voters: { id: string }[]
  votes: IGovProposalVoteQuery[]
}
