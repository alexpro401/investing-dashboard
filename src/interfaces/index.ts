/* eslint-disable @typescript-eslint/no-namespace */
import { BigNumber } from "@ethersproject/bignumber"

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_NAMESPACE: string
      REACT_APP_UPDATE_INTERVAL: string

      REACT_APP_INFURA_ID: string
      REACT_APP_ETHERSCAN_API_KEY: string

      REACT_APP_CONTRACTS_REGISTRY_ADDRESS: string

      REACT_APP_ALL_POOLS_API_URL: string
      REACT_APP_BASIC_POOLS_API_URL: string
      REACT_APP_INVEST_POOLS_API_URL: string
      REACT_APP_INVESTORS_API_URL: string
      REACT_APP_INTERACTIONS_API_URL: string
      REACT_APP_MAIN_ASSET_ADDRESS: string

      REACT_APP_IPFS_PROJECT_ID: string
      REACT_APP_IPFS_PROJECT_SECRET: string

      REACT_APP_PRIVACY_POLICY_HASH: string
    }
  }
}

export interface WhiteList {
  address: string
  decimals: number
  symbol: string
}

export interface OwnedPools {
  basic: string[]
  invest: string[]
}

export interface IFundFeeHistory {
  id: string
  PNL: BigNumber
  day: BigNumber
  fundProfit: BigNumber
  perfomanceFee: BigNumber
  traderPool: {
    id: string
    baseToken: string
  }
}

// Top traders page reducer payload
export interface IPayload {
  loading: boolean
  error: string | null
  updatedAt: number | null
}

export interface ISortItem {
  label: string
  key: string
  direction: "asc" | "desc" | ""
}

export interface ITopMembersFilters {
  sort: ISortItem
  period: string[]
  query: string
  currency: string
}

export interface PaginationType {
  total: number
  offset: number
  limit: number
}

export interface ITopMembersPagination {
  ALL_POOL: PaginationType
  BASIC_POOL: PaginationType
  INVEST_POOL: PaginationType
}

export interface Token {
  address: string
  name: string
  symbol: string
  decimals: number
}

export interface DividendToken {
  address: string
  amount: BigNumber
  allowance: BigNumber
  data: Token
  price: BigNumber
  balance: BigNumber
}

export interface ITokenBase {
  address: string
  name: string
  symbol: string
  decimals: number
  balance?: BigNumber
  chainId?: number
  logoURI?: string
}

export interface INotification {
  createdAt: string
  description: string
  title: string
  link: string
  __v: number
  _id: string
}

// POOL

export interface ILpPnl {
  lpBasic: string // BigNumber
  lpBasicPercent: number
  lpUsd: string // BigNumber
  lpUsdPercent: number
}

export interface IDetailedChart extends ILpPnl {
  x: string // new Date().toIsoString()
  y: number
}

export interface IPnl extends ILpPnl {
  total: number
  monthly: number[] // length 12 CHART
  detailed: IDetailedChart[] // any length FULL CHART
}

export interface IAvg {
  tradesPerDay: number
  dailyLpProfit: number
  orderSize: number
  timePosition: string
}

export interface ISortino {
  base: number
  btc: number
}

export interface ISupply {
  circulating: string // BigNumber
  total: string // BigNumber
}

export interface IPool {
  firstName: string
  lastName: string
  avatar: string

  ownerAddress: string
  poolAddress: string
  baseAddress: string

  symbol: string
  price: string // BigNumber
  priceUsd: number

  copiers: number
  rank: number
  commision: number
  personalFunds: string // BigNumber
  personalFundsPercent: number
  invested: string // BigNumber
  profitFactor: number
  trades: string // BigNumber
  maxLoss: number

  avg: IAvg
  pnl: IPnl
  sortino: ISortino
  supply: ISupply
}

export interface IUserData {
  id: number
  avatar: string
  createdAt: string
  nickname: string
  updatedAt: string
  wallet: string
}

export interface IPoolTransaction {
  txId: string
  timestamp: Date
  path: string[]
  status: "BUY" | "SELL"
  amount: BigNumber
  basePrice: BigNumber
  stablePrice: BigNumber
}

// END of POOL

export interface ITab {
  title: string
  source: string
  activeSource?: string[]
  amount?: number
}
