// Pool invnest proposals

const INVEST_PROPOSAL = `
  id
  timestampLimit
  investLPLimit
  leftTokens
  leftAmounts
  totalUSDSupply
  firstSupplyTimestamp
  APR
`

const InvestProposalQuery = `
  query ($proposalId: String!) {
    proposal(id: $proposalId) {
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
const InvestorInvestProposalsQuery = (invested) => {
  const condition = invested ? "investPool_in" : "investPool_not_in"
  return `
  query ($activePools: [String]!, $offset: Int!, $limit: Int!) {
    proposals(skip: $offset, first: $limit, where: { ${condition}: $activePools }){
      ${INVESTOR_INVEST_PROPOSAL}
    }
  }
`
}

const InvestProposalWithdrawals = `
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

const InvestProposalSupplies = `
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

export {
  InvestProposalQuery,
  InvestorInvestProposalsQuery,
  InvestProposalWithdrawals,
  InvestProposalSupplies,
}
