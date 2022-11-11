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

export { GovPoolQuery, GovPoolsQuery }
