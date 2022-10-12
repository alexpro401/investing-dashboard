//-----------------------------------------------------------------------------
// # PRICE HISTORY
//-----------------------------------------------------------------------------

const PRICE_HISTORY = `
  id
  APY
  block
  usdTVL
  baseTVL
  supply
  absPNL
  percPNL
  timestamp
  traderUSD
  aggregationType
`

const PRICE_HISTORY_LAST = `
  priceHistory(
    first: 1,
    orderBy: timestamp,
    orderDirection: desc,
    where: {
      aggregationType_gte: 0,
      aggregationType_lte: 0,
    }) {
    ${PRICE_HISTORY}
  }
`

const PRICE_HISTORY_FULL = (startDate, block) => `
  priceHistory(
    first: $limit, 
    orderBy: timestamp, orderDirection: asc, 
    where: { 
      aggregationType_gte: $minTimeframe,
      aggregationType_lte: $maxTimeframe,
      ${startDate !== 0 ? "timestamp_gte: $startDate," : ""}
      ${block !== undefined ? `block_gte: ${block}` : ""}
    }
  ) {
    ${PRICE_HISTORY}
  }
`

const PriceHistoryQuery = (startDate, block?) => `
  query ($address: String!, $minTimeframe: Int!, $maxTimeframe: Int!, $limit: Int!, $startDate: Int!) {
    traderPool(id: $address) {
      ${PRICE_HISTORY_FULL(startDate, block)}
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
  orderSize
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

const PoolsByInvestorsQuery = `
  query ($investors: [String]!) {
    traderPools(
      where: { investors_contains: $investors },
      first: 1000,
      orderBy: creationTime,
      orderDirection: desc
    ) {
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

const POSITION_DATA = `
  id
  closed
  positionToken
  totalUSDOpenVolume
  totalUSDCloseVolume
  totalBaseOpenVolume
  totalBaseCloseVolume
  totalPositionOpenVolume
  totalPositionCloseVolume
`

const POSITION = `
  ${POSITION_DATA}
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

const PositionsByIdsQuery = `
  query ($idList: [String]!) {
    positions(first: 25, where: { id_in: $idList }) {
      ${POSITION_DATA}
    }
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

export {
  PoolQuery,
  PoolsQuery,
  PoolsQueryByType,
  PriceHistoryQuery,
  OwnedPoolsQuery,
  ManagedPoolsQuery,
  PoolsQueryWithSort,
  PoolsQueryByTypeWithSort,
  PoolPositionLast,
  BasicPositionsQuery,
  FundFeeHistoryQuery,
  PositionsByIdsQuery,
  PoolsByInvestorsQuery,
}
