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
  absPNLUSD
  percPNLUSD
  absPNLBase
  percPNLBase
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

export const PriceHistoryQuery = (startDate, block?) => `
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
  investors {
    id
    activePools
    allPools
  }
  privateInvestors {
    id
    activePools
    allPools
  }
  ${PRICE_HISTORY_LAST}
`

export const PoolQuery = `
  query ($address: String!) {
    traderPool(id: $address) {
      ${POOL}
    }
  }
`

export const OwnedPoolsQuery = `
  query ($address: String!) {
    traderPools(orderBy: creationTime, first: 100, where: { trader: $address }) {
      ${POOL}
    }
  }
`
export const ManagedPoolsQuery = `
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

export const PoolsQuery = `
  query ($q: String!) {
    traderPools(where: { ticker_contains_nocase: $q } first: 100) {
      ${POOL}
    }
  }
`

export const PoolsQueryWithSort = `
  query ($q: String!, $orderBy: String!, $orderDirection: String!) {
    traderPools(where: { ticker_contains_nocase: $q } first: 100 orderBy: $orderBy orderDirection: $orderDirection) {
      ${POOL}
    }
  }
`

export const PoolsQueryByType = `
  query ($q: String!, $type: String!) {
    traderPools(where: { ticker_contains_nocase: $q, type: $type } first: 100) {
      ${POOL}
    }
  }
`

export const PoolsQueryByTypeWithSort = `
  query ($q: String!, $type: String!, $orderBy: String!, $orderDirection: String!) {
    traderPools(where: { ticker_contains_nocase: $q, type: $type } first: 100 orderBy: $orderBy orderDirection: $orderDirection) {
      ${POOL}
    }
  }
`

export const PoolsByInvestorsQuery = `
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
  traderPool {
    id
    trader
    ticker
    baseToken
    descriptionURL
  }
`

export const PositionsByIdsQuery = `
  query ($idList: [String]!) {
    positions(first: 25, where: { id_in: $idList }) {
      ${POSITION_DATA}
    }
  }
`

export const BasicPositionsQuery = `
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

export const BasicPoolPositionExchangesQuery = `
  query ($offset: Int!, $limit: Int!, $positionId: String!) {
    exchanges(
      skip: $offset, first: $limit,
      where: {position_: { id: $positionId }},
      orderBy: timestamp, orderDirection: desc,
    ) {
      ${POSITION_EXCHANGE}
    }
  }
`

export const PoolPositionLastQuery = `
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
export const FundFeeHistoryQuery = `
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
