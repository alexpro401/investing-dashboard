const DISTRIBUTION_PROPOSAL = `
  id
  token
  amount
  proposal { id }
`

const POOL_VOTER = `
  id
  receivedDelegation
  receivedNFTDelegation
  totalDPClaimed
  totalClaimedUSD
  claimedDPs {${DISTRIBUTION_PROPOSAL}}
`

const POOL_SETTINGS = `
  id
  settingsId
  executorDescription
`

const POOL_EXECUTOR = `
  id
  executorAddress
  settings {${POOL_SETTINGS}}
`

const POOL = `
  id
  name
  votersCount
  creationTime
  creationBlock
  voters {${POOL_VOTER}}
  settings {${POOL_SETTINGS}}
  executors {${POOL_EXECUTOR}}
`

const PROPOSAL_VOTE = `
  id
  hash
  timestamp
  personalAmount
  delegatedAmount
  voter { id }
  proposal { id }
`

const PROPOSAL = `
  id
  proposalId
  isDP
  creator
  executor
  executionTimestamp
  currentVotes
  quorum
  description
  votersVoted
  pool { id }
  distributionProposal {${DISTRIBUTION_PROPOSAL}}
  settings {${POOL_SETTINGS}}
  voters { id }
  votes {${PROPOSAL_VOTE}}
`

const GovPoolQuery = `
  query ($address: String!) {
    traderPool(id: $address) {
      ${POOL}
    }
  }
`

const GovPoolsQuery = `
  query {
    daoPools(first: 100, orderBy: creationTime, orderDirection: asc) {
      ${POOL}
    }
  }
`

const GovPoolExecutorsQuery = `
  query ($address: String!) {
    daoPools(id: $address) {
      executors {${POOL_EXECUTOR}}
    }
  }
`

const GovVoterInPoolQuery = `
  query ($voter: String!, $pool: String!) {
    voterInPools(where: { pool: $pool, voter: $voter }) {
      ${POOL_VOTER}
    }
  }
`

const GovProposalsWithDistributionQuery = `
  query (
    $offset: Int!, $limit: Int!, 
    $isDP: Boolean!, $pool: String!,
    $excludeIds: [String]!, $voters: [String]!, $executorExclude: String! 
  ) {
    proposals(
      skip: $offset, first: $limit, 
      orderBy: id, orderDirection: asc, 
      where: {
        isDP: $isDP, pool: $pool,
        id_not_in: $excludeIds, voters_contains: $voters, executor_not: $executorExclude
      }
    ) {${PROPOSAL}}
  }
`

const GovProposalsWithRewardsQuery = `
  query(
    $offset: Int!, $limit: Int!, 
    $executorExclude: String!, $voters: [String]!, $pool: String!
  ) {
    proposals(
      skip: $offset, first: $limit,
      orderBy: id, orderDirection: asc,
      where: { executor_not: $executorExclude, voters_contains: $voters, pool: $pool }
    ) {
      voters {
        pools {
          proposals(where: { claimedReward: 0 }) {
            id 
            totalVoteAmount
            totalDelegatedVoteAmount
            claimedReward
            claimedDpRewardUSD
            proposal { id }
          }
        }
      }
    }
  }
`

export {
  GovPoolQuery,
  GovPoolsQuery,
  GovPoolExecutorsQuery,
  GovVoterInPoolQuery,
  GovProposalsWithRewardsQuery,
  GovProposalsWithDistributionQuery,
}
