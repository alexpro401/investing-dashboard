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

const DELEGATION_HISTORY = `
  id
  pool { id }
  timestamp
  from { id }
  to { id }
  isDelegate
  amount
  nfts
`

const VOTER_IN_POOL_PAIR = `
  id
  from { id, pool { id }, voter { id } }
  to { id, voter { id } }
  delegateAmount
  delegateNfts
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
    daoPool(id: $address) {
      ${POOL}
    }
  }
`

const GovPoolsQuery = `
  query($offset: Int!, $limit: Int!, $excludeIds: [String]!) {
    daoPools(
    skip: $offset, first: $limit, 
    orderBy: creationTime, orderDirection: desc, 
    where: { id_not_in: $excludeIds }
  ) {
      ${POOL}
    }
  }
`

const GovPoolDelegationHistoryByUserQuery = (isUserDelegator = true) => `
  query ($offset: Int!, $limit: Int!, $address: String!, $account: String!) {
    delegationHistories(
      skip: $offset, first: $limit, 
      orderBy: timestamp, orderDirection: asc,
      where: {
        pool: $address,
        ${isUserDelegator ? "from: $account," : "to: $account,"}
      }
    ) {
      ${DELEGATION_HISTORY}
    }
  }
`

const GovPoolActiveDelegations = (isUserDelegator = true) => `
  query ($offset: Int!, $limit: Int!, $account: String!) {
    voterInPoolPairs(
      skip: $offset, first: $limit, 
      orderBy: id, orderDirection: asc,
      where: { 
        ${isUserDelegator ? "from: $account" : "to: $account"},
      }
    ) { ${VOTER_IN_POOL_PAIR} }
  }
`

const GovPoolExecutorQuery = `
  query ($address: String!, $executorAddress: String!) {
    daoPool(id: $address) {
      executors(where: { executorAddress: $executorAddress }) {${POOL_EXECUTOR}}
    }
  }
`

const GovPoolExecutorsQuery = `
  query ($address: String!) {
    daoPool(id: $address) {
      executors {${POOL_EXECUTOR}}
    }
  }
`

const GovPoolExecutorsBySettingIdQuery = `
  query ($address: String!, $settingsId: String!) {
    daoPool(id: $address) {
      executors(where: { settings_: { settingsId: $settingsId } }) {${POOL_EXECUTOR}}
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
  GovVoterInPoolQuery,
  GovPoolDelegationHistoryByUserQuery,
  GovPoolExecutorQuery,
  GovPoolExecutorsQuery,
  GovPoolExecutorsBySettingIdQuery,
  GovPoolActiveDelegations,
  GovProposalsWithRewardsQuery,
  GovProposalsWithDistributionQuery,
}
