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

const InvestorPositionsQuery = `
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
const InvestorPoolsInvestedForQuery = `
  query ($address: String!, $poolType: String!) {
    investors(where: { id: $address }) {
      activePools(where: { type: $poolType }) { id }
    }
  }
`

// Investor claims
const InvestorClaims = `
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
const InsurancDueDay = `
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

export {
  InvestorPositionsQuery,
  InvestorPoolsInvestedForQuery,
  InvestorClaims,
  InsurancDueDay,
}
