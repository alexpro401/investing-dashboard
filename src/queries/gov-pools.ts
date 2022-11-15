const POOL_VOTER = `
  id
  receivedDelegation
  receivedNFTDelegation
  totalDPClaimed
  totalClaimedUSD
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

const GovPoolDelegationHistoryByUserQuery = (isUserDelegator = true) => `
  query ($offset: Int!, $limit: Int!, $address: String!, $account: String!) {
    delegationHistories(
      skip: $offset, first: $limit, 
      orderBy: timestamp, orderDirection: asc,
      where: {
        pool: $address,
        ${isUserDelegator ? "from: $account" : "to: $account"}
      }
    ) {
      ${DELEGATION_HISTORY}
    }
  }
`

export { GovPoolQuery, GovPoolsQuery, GovPoolDelegationHistoryByUserQuery }
