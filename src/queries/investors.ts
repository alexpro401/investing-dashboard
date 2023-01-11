// Investor positions
const INVESTOR_POSITION_VEST = `
  id
  hash
  isInvest
  timestamp
  volumeBase
  volumeLP
  volumeUSD
`

export const InvestorPositionsQuery = `
  query ($address: String!, $closed: Boolean!, $offset: Int!, $limit: Int!) {
    investorPoolPositions(skip: $offset, first: $limit, where: {investor: $address, isClosed: $closed}) {
      id
      isClosed
      totalBaseInvestVolume
      totalBaseDivestVolume
      totalLPInvestVolume
      totalLPDivestVolume
      totalUSDInvestVolume
      totalUSDDivestVolume
      pool {
        id
        type
        token
      }
      vest(first: 100) {
        ${INVESTOR_POSITION_VEST}
      }
    }
  }
`

// Investor proposals
export const InvestorPoolsInvestedForQuery = `
  query ($address: String!, $poolType: String!) {
    investors(where: { id: $address }) {
      activePools(where: { type: $poolType }) { id }
    }
  }
`

// Investor claims
export const InvestorClaimsQuery = `
  query ($id: String!) {
    proposalClaims (orderBy: timestamp, orderDirection: desc, where: {
       proposal_in: [$id]
    }) {
      id
      timestamp
      dividendsTokens
      amountDividendsTokens
    }
  }
`

// Insurances
const INSURANCE_HISTORY = `
  id
  day
  stake
  claimedAmount
  investor { id }
`

// Insurance to day
export const InsuranceDueDayQuery = `
  query ($account: String!, $day: String!) {
    insuranceHistories (
      first: 1,
      orderBy:day, orderDirection:desc, 
      where: { day_lte: $day, investor: $account }
    ) {
      ${INSURANCE_HISTORY}
    }
  }
`

// Investor pool position
const INVESTOR_POOL_POSITION = `
  id
  pool { id token }
  investor { id }
  isClosed
  totalBaseInvestVolume
  totalBaseDivestVolume
  totalLPInvestVolume
  totalLPDivestVolume
  totalUSDInvestVolume
  totalUSDDivestVolume
`

const INVESTOR_POOL_LP_HISTORY = `
  id
  day
  currentLpAmount
`

/**
 * Investor pool position by pool and investor
 * @param { string } pool - pool address
 * @param { string } investor - investor acccount
 **/
export const InvestorPoolPositionQuery = `
  query ($pool: String!, $investors: [String]!) {
    investorPoolPositions (
      first: 1000,
      where: { pool: $pool, investor_in: $investors }
    ) {
      ${INVESTOR_POOL_POSITION}
    }
  }
`

/**
 * LP history by pools, investors and days
 * @param { string } day - day
 * @param { string } pools - pools address list
 * @param { string } investors - investors acccounts list
 **/
export const InvestorsPoolsLpHistoryQuery = `
 query ($day: String!, $pools: [String]!, $investors: [String]!) {
  investorPoolPositions(
    where: { 
      investor_in: $investors,
      pool_in: $pools
    }) {
    ${INVESTOR_POOL_POSITION}
    lpHistory(where: { day_lte: $day }) {
      ${INVESTOR_POOL_LP_HISTORY}
    }
  }
 }
`

export const TraderPoolHistoriesQuery = `
  query ($day: String!, $pool: String!) {
    traderPoolHistories(
      first: 1,
      orderBy: day, orderDirection: desc,
      where: { day_lte: $day, pool: $pool }
    ) {
      investors
    }
  }
`

export const InvestorsInsuranceHistoriesQuery = `
  query ($day: String!, $investors: [String]!) {
    investors(where: { id_in: $investors }) {
      insuranceHistory(
        first: 1000,
        orderBy: day, orderDirection: desc, 
        where: { day_lte: $day, stake_gte: 100 }
      ) {
        ${INSURANCE_HISTORY}
      }
    }
  }
`

const INVESTOR_PROPOSAL_POSITION_VEST = `
  id
  hash
  isInvest
  timestamp
  baseVolume
  lpVolume
  lp2Volume
  usdVolume
`

const INVESTOR_PROPOSAL_POSITION = `
  id
  isClosed
  proposalId
  totalBaseOpenVolume
  totalBaseCloseVolume
  totalLPOpenVolume
  totalLPCloseVolume
  totalLP2OpenVolume
  totalLP2CloseVolume
  totalUSDOpenVolume
  totalUSDCloseVolume
  proposalContract { id }
  investor { id }
  vests {
    ${INVESTOR_PROPOSAL_POSITION_VEST}
  }
`

export const InvestorProposalsPositionsQuery = `
  query ($address: String!, $type: String!, $closed: Boolean!, $offset: Int!, $limit: Int!) {
    proposalPositions(
      skip: $offset, first: $limit, 
      where: { 
        isClosed: $closed, 
        investor: $address,
        proposalContract_: { proposalType: $type }
      }
    ) {
      ${INVESTOR_PROPOSAL_POSITION}
    }
  }
`

const INVESTOR = `
  id
  activePools { id type token }
  allPools { id type token }
`

export const InvestorQuery = `
  query ($address: String!) {
    investor(id: $address) {
      ${INVESTOR}
    }
  }
`

export const InvestorPoolsPositionsQuery = `
  query ($address: String!, $offset: Int!, $limit: Int!) {
    investorPoolPositions(skip: $offset, first: $limit, where: {investor: $address}) {
      ${INVESTOR_POOL_POSITION}
    }
  }
`
