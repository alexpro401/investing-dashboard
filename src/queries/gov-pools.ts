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

export { GovPoolQuery, GovPoolsQuery }
