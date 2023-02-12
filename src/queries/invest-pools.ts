// InvestedFund invnest proposals

const INVEST_PROPOSAL = `
  id
  timestampLimit
  investLPLimit
  leftTokens
  leftAmounts
  totalUSDSupply
  firstSupplyTimestamp
  APR
  investPool {
    id
    baseToken
  }
`

export const InvestProposalQuery = `
  query ($proposalId: String!) {
    proposal(id: $proposalId) {
      ${INVEST_PROPOSAL}
    }
  }
`
export const PoolInvestProposalsQuery = `
  query ($offset: Int!, $limit: Int!, $poolAddress: String!) {
    proposals(
      skip: $offset, first: $limit, 
      orderBy: id, orderDirection: asc,
      where: {investPool: $poolAddress}
    ) {
      ${INVEST_PROPOSAL}
    }
  }
`

const INVESTOR_INVEST_PROPOSAL = `
  id
  timestampLimit
  investLPLimit
  leftTokens
  leftAmounts
  totalUSDSupply
  firstSupplyTimestamp
  APR
  
  investPool {
    id
    baseToken
  }
`
export const InvestorInvestProposalsQuery = (invested) => {
  const condition = invested ? "investPool_in" : "investPool_not_in"
  return `
  query ($activePools: [String]!, $offset: Int!, $limit: Int!) {
    proposals(skip: $offset, first: $limit, where: { ${condition}: $activePools }){
      ${INVESTOR_INVEST_PROPOSAL}
    }
  }
`
}

export const InvestProposalWithdrawalsQuery = `
  query ($id: String!) {
    proposal(id: $id) {
      withdraws (orderBy: timestamp, orderDirection: desc) {
        id
        timestamp
        amountBase
      }
    }
  }
`

export const InvestProposalSuppliesQuery = `
  query ($id: String!) {
    proposal(id: $id) {
      APR
      supplies (orderBy: timestamp, orderDirection: desc) {
        id
        hash
        timestamp
        dividendsTokens
        amountDividendsTokens
      }
    }
  }
`
