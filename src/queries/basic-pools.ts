// Pool risky proposals
const RISKY_PROPOSAL_EXCHANGE = `
  id
  hash
  timestamp
  fromToken
  toToken
  fromVolume
  toVolume
  usdVolume
`
const RISKY_PROPOSAL_POSITION = `
  id
  isClosed
  totalBaseOpenVolume
  totalBaseCloseVolume
  totalPositionOpenVolume
  totalPositionCloseVolume
  totalUSDOpenVolume
  totalUSDCloseVolume
  proposal {
    token
    basicPool {
      id
      baseToken
    }
    exchanges {
      exchanges(orderBy: timestamp, orderDirection: desc) {
        ${RISKY_PROPOSAL_EXCHANGE}
      }
    }
  }
`

const RiskyPositionsQuery = `
  query ($poolAddressList: [String]!, $closed: Boolean!, $offset: Int!, $limit: Int!) {
    proposalPositions(
      skip: $offset, first: $limit, 
      where: { 
        isClosed: $closed, 
        proposal_: { basicPool_in: $poolAddressList }
      }
    ) {
      ${RISKY_PROPOSAL_POSITION}
    }
  }
`

const InvestorRiskyPositionByIdQuery = `
  query ($id: String!) {
    proposalPosition(id: $id) {
      id
      totalBaseOpenVolume
      totalBaseCloseVolume
      totalPositionOpenVolume
      totalPositionCloseVolume
      totalUSDOpenVolume
      totalUSDCloseVolume
      proposal {
        token
        basicPool {
          id
          baseToken
        }
      }
    }
  }
`

const RiskyProposalPositionQuery = `
  query ($proposalAddress: String!, $closed: Boolean!) {
    proposal(id: $proposalAddress) {
      positions (where: { isClosed: $closed }) {
        ${RISKY_PROPOSAL_POSITION}
      }
    }
  }
`

const InvestorRiskyProposalsQuery = `
  query ($offset: Int!, $limit: Int!, $activePools: [String]!) {
    proposals(skip: $offset, first: $limit, where: { basicPool_in: $activePools }){
      id
      basicPool {
        id 
      }
    }
  }
`

export {
  RiskyProposalPositionQuery,
  RiskyPositionsQuery,
  InvestorRiskyPositionByIdQuery,
  InvestorRiskyProposalsQuery,
}
