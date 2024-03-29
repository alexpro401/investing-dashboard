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
  currentDelegatorsCount
`

const POOL_SETTINGS = `
  id
  settingsId
  executorDescription
`

const POOL_EXECUTOR = `
  id
  executorAddress
  settings {
    ${POOL_SETTINGS}
}
`

const POOL = `
  id
  name
  erc20Token
  erc721Token
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

export const GovPoolQuery = `
  query ($address: String!) {
    daoPool(id: $address) {
      ${POOL}
    }
  }
`

export const GovPoolsQuery = `
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

export const GovPoolDelegationHistoryByUserQuery = (isUserDelegator = true) => `
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

export const GovPoolActiveDelegationsQuery = (isUserDelegator = true) => `
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

export const GovPoolExecutorQuery = `
  query ($address: String!, $executorAddress: String!) {
    daoPool(id: $address) {
      executors(where: { executorAddress: $executorAddress }) {${POOL_EXECUTOR}}
    }
  }
`

export const GovPoolExecutorsQuery = `
  query ($address: String!) {
    daoPool(id: $address) {
      executors {${POOL_EXECUTOR}}
    }
  }
`

export const GovPoolExecutorsBySettingIdQuery = `
  query ($address: String!, $settingsId: String!) {
    daoPool(id: $address) {
      executors(where: { settings_: { settingsId: $settingsId } }) {${POOL_EXECUTOR}}
    }
  }
`

export const GovVoterInPoolQuery = `
  query ($voter: String!, $pool: String!) {
    voterInPools(where: { pool: $pool, voter: $voter }) {
      ${POOL_VOTER}
    }
  }
`

export const GovProposalsWithDistributionQuery = `
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

export const GovMemberProposalsHistoryCountQuery = `
  query($address: String!, $voters: [String]!) {
    proposals(where: { pool_: { id: $address }, voters_contains: $voters }) {
      proposalId
    }
  }
`

export const GovProposalsByPoolInMiscQuery = `
  query($offset: Int!, $limit: Int!, $misc: String!, $pool: String!) {
    proposals(
      skip: $offset, first: $limit, 
      where: { misc: $misc, pool: $pool, executionTimestamp: 0 }
    ) {
      ${PROPOSAL}
    }
  }
`

export const DaoPoolDaoProfileTotalDelegationsQuery = `
  query($address: String!) {
    daoPool(id: $address) {
      totalCurrentTokenDelegated,
      totalCurrentNFTDelegated
    }
  }
`

export const DaoPoolProfileTopTokenDelegateeQuery = `
  query($offset: Int!, $limit: Int, $pool: String!) {
    voterInPools(where: { pool_: { id: $pool } }, skip: $offset, first: $limit, orderBy: receivedDelegation, orderDirection: desc) {
      id,
      receivedDelegation
    }
  }
`

export const DaoPoolProfileTopNftDelegateeQuery = `
  query($offset: Int!, $limit: Int, $pool: String!) {
    voterInPools(where: { pool_: { id: $pool } }, skip: $offset, first: $limit, orderBy: receivedNFTDelegation, orderDirection: desc) {
      id,
      receivedNFTDelegation
    }
  }
`

export const GovPoolProposalQuery = `
  query($govPoolAddress: String!, $proposalId: Int!) {
    proposals(where: { pool: $govPoolAddress, proposalId: $proposalId }) {
      id
      executor
      creator
      voters
      distributionProposal {
        token
        amount
      }
    }
  }
`
export const GovPoolProposalVotesQuery = `
  query($proposalId: String!, $offset: Int!, $limit: Int!) {
    proposalVotes(where:{ proposal: $proposalId }, first: $limit, skip: $offset) {
      voter {
        voter {
          voter {
            id
          }
        }
      }
      personalAmount
      timestamp
      proposal {
        votesCount
      }
    }
  }
`

export const GovPoolTokenSaleQuery = `
  query($address: String!) {
    daoPool(id: $address) {
      tokenSales {
        id
      }
    }
  }
`
