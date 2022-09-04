import { ITopMembersFilters } from "constants/interfaces"
import { PoolType } from "constants/interfaces_v2"
//-----------------------------------------------------------------------------
// # PRICE HISTORY
//-----------------------------------------------------------------------------

const PRICE_HISTORY = `
  usdTVL
  baseTVL
  supply
  absPNL
  percPNL
  timestamp
  aggregationType
`

const PRICE_HISTORY_LAST = `
  priceHistory(
    first: 1,
    orderBy: timestamp,
    orderDirection: desc,
    where: {
      isLast: true,
      aggregationType_gte: 0,
      aggregationType_lte: 0,
    }) {
    ${PRICE_HISTORY}
  }
`

const PRICE_HISTORY_FULL = (startDate) => `
  priceHistory(
    first: $limit, 
    orderBy: timestamp, orderDirection: asc, 
    where: { 
      aggregationType_gte: $minTimeframe,
      aggregationType_lte: $maxTimeframe,
      ${startDate !== 0 ? "timestamp_gte: $startDate" : ""}
    }
  ) {
    ${PRICE_HISTORY}
  }
`

const PriceHistoryQuery = (startDate) => `
  query ($address: String!, $minTimeframe: Int!, $maxTimeframe: Int!, $limit: Int!, $startDate: Int!) {
    traderPool(id: $address) {
      ${PRICE_HISTORY_FULL(startDate)}
    }
  }
`

//-----------------------------------------------------------------------------
// # POOL
//-----------------------------------------------------------------------------

const POOL = `
  id
  baseToken
  name
  type
  ticker
  trader
  creationTime
  descriptionURL
  maxLoss
  totalTrades
  totalClosedPositions
  averageTrades
  averagePositionTime
  investorsCount
  admins
  privateInvestors {
    id
    activePools
    allPools
  }
  ${PRICE_HISTORY_LAST}
`

const PoolQuery = `
  query ($address: String!) {
    traderPool(id: $address) {
      ${POOL}
    }
  }
`

const OwnedPoolsQuery = `
  query ($address: String!) {
    traderPools(orderBy: creationTime, first: 100, where: { trader: $address }) {
      ${POOL}
    }
  }
`
const ManagedPoolsQuery = `
  query ($address: String!) {
    traderPools(
      orderBy: creationTime, first: 100, 
      where: { 
        admins_contains_nocase: [$address],
        trader_not: $address
      }
    ) {
      ${POOL}
    }
  }
`

const PoolsQuery = `
  query ($q: String!) {
    traderPools(where: { ticker_contains_nocase: $q } first: 100) {
      ${POOL}
    }
  }
`

const PoolsQueryWithSort = `
  query ($q: String!, $orderBy: String!, $orderDirection: String!) {
    traderPools(where: { ticker_contains_nocase: $q } first: 100 orderBy: $orderBy orderDirection: $orderDirection) {
      ${POOL}
    }
  }
`

const PoolsQueryByType = `
  query ($q: String!, $type: String!) {
    traderPools(where: { ticker_contains_nocase: $q, type: $type } first: 100) {
      ${POOL}
    }
  }
`

const PoolsQueryByTypeWithSort = `
  query ($q: String!, $type: String!, $orderBy: String!, $orderDirection: String!) {
    traderPools(where: { ticker_contains_nocase: $q, type: $type } first: 100 orderBy: $orderBy orderDirection: $orderDirection) {
      ${POOL}
    }
  }
`

// Basic pool positions
const POSITION_EXCHANGE = `
  id
  hash
  fromToken
  toToken
  fromVolume
  toVolume
  usdVolume
  timestamp
  opening
`

const POSITION = `
  id
  closed
  positionToken
  totalUSDOpenVolume
  totalUSDCloseVolume
  totalBaseOpenVolume
  totalBaseCloseVolume
  totalPositionOpenVolume
  totalPositionCloseVolume
  exchanges(orderBy: timestamp, orderDirection: desc) {
    ${POSITION_EXCHANGE}
  }
  traderPool {
    id
    trader
    ticker
    baseToken
    descriptionURL
  }
`

const BasicPositionsQuery = `
  query ($offset: Int!, $limit: Int!, $address: String!, $closed: Boolean!) {
    positions(
      skip: $offset, first: $limit, 
      where: { 
        closed: $closed, 
        traderPool_: { id: $address }
      },
      orderBy: startTimestamp, orderDirection: desc
    ) {
      ${POSITION}
    }
  }
`

const PoolPositionLast = `
query ($poolId: String!, $tokenId: String!) {
  positions(
    first: 1, 
    where: {
      traderPool_: { id: $poolId }
      positionToken: $tokenId
    },
    orderBy: startTimestamp, orderDirection: desc
  ) {
    ${POSITION}
  }
}
`

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

const RiskyProposalPositionQuery = `
  query ($proposalAddress: String!, $closed: Boolean!) {
    proposal(id: $proposalAddress) {
      positions (where: { isClosed: $closed }) {
        ${RISKY_PROPOSAL_POSITION}
      }
    }
  }
`

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

// Fund fee history
const FundFeeHistoryQuery = `
  query($offset: Int!, $limit: Int!, $address: String!) {
    feeHistories(
      skip: $offset, first: $limit, 
      orderBy: day, orderDirection: desc, 
      where: { traderPool_: { id: $address }}
    ) {
      id
      PNL
      day
      fundProfit
      perfomanceFee
      traderPool {
        id
        baseToken
      }
    }
  }
`

const UserTransactionsQuery = `
  query($offset: Int!, $limit: Int!, $address: String!, $transactionTypes: [Int]!) {
    transactions(
      skip: $offset, first: $limit, 
      where: {user: $address, type_contains: $transactionTypes}, 
      orderBy: timestamp, orderDirection: desc
    ) {
      id
      timestamp
      type
      user
      interactionsCount

      exchange { id fromToken toToken }
      vest { id pool baseAmount }
      poolCreate { id }
      proposalEdit { id }
      riskyProposalCreate { id }
      riskyProposalExchange { id }
      riskyProposalVest { id }
      investProposalClaimSupply { id }
      investProposalCreate { id }
      investProposalWithdraw { id }
      insuranceStake { id }
      getPerfomanceFee { id }
      onlyPool { id }
    }
  }
`

const getPoolsQueryVariables = (
  filters: ITopMembersFilters,
  poolType: PoolType
) => {
  const isAllPools = poolType === "ALL_POOL"
  const isSorting = filters.sort.direction !== ""

  if (!isAllPools && !isSorting) {
    return {
      query: PoolsQueryByType,
      variables: { q: filters.query, type: poolType },
    }
  }

  if (isAllPools && isSorting) {
    return {
      query: PoolsQueryWithSort,
      variables: {
        q: filters.query,
        orderBy: filters.sort.key,
        orderDirection: filters.sort.direction,
      },
    }
  }

  if (!isAllPools && isSorting) {
    return {
      query: PoolsQueryByTypeWithSort,
      variables: {
        q: filters.query,
        type: poolType,
        orderBy: filters.sort.key,
        orderDirection: filters.sort.direction,
      },
    }
  }

  return {
    query: PoolsQuery,
    variables: { q: filters.query },
  }
}

export {
  PoolQuery,
  PoolsQuery,
  PoolsQueryByType,
  PriceHistoryQuery,
  OwnedPoolsQuery,
  ManagedPoolsQuery,
  BasicPositionsQuery,
  PoolsQueryWithSort,
  PoolsQueryByTypeWithSort,
  InvestProposalQuery,
  InvestorPositionsQuery,
  InvestorPoolsInvestedForQuery,
  InvestorRiskyProposalsQuery,
  InvestorInvestProposalsQuery,
  RiskyPositionsQuery,
  FundFeeHistoryQuery,
  UserTransactionsQuery,
  getPoolsQueryVariables,
  RiskyProposalPositionQuery,
  PoolPositionLast,
}
