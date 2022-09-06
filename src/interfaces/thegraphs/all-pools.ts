import { BigNumber } from "@ethersproject/bignumber"
import { PoolType } from "constants/types"

export interface IPriceHistory {
  usdTVL: number
  baseTVL: number
  supply: number
  absPNL: number
  percPNL: number
  timestamp: number
  aggregationType: number
}

export interface IPriceHistoryQuery {
  priceHistory: IPriceHistory[]
}

export interface Investor {
  id: string
  activePools: string[]
  allPools: string[]
}

export interface IPoolQuery {
  id: string
  baseToken: string
  type: PoolType
  name: string
  ticker: string
  trader: string
  creationTime: number
  descriptionURL: string
  maxLoss: number
  totalTrades: number
  totalClosedPositions: number
  averageTrades: number
  investorsCount: number
  averagePositionTime: number
  priceHistory: IPriceHistory[]
  privateInvestors: Investor[]
  admins: string[]
}

export interface IExchange {
  id: string
  hash: string
  fromToken: string
  toToken: string
  fromVolume: BigNumber
  toVolume: BigNumber
  usdVolume: BigNumber
  timestamp: BigNumber
  opening: boolean
}

export interface IPosition {
  closed: boolean
  id: string
  positionToken: string
  totalUSDOpenVolume: BigNumber
  totalUSDCloseVolume: BigNumber
  totalBaseOpenVolume: BigNumber
  totalBaseCloseVolume: BigNumber
  totalPositionOpenVolume: BigNumber
  totalPositionCloseVolume: BigNumber
  exchanges: IExchange[]
  traderPool: {
    id: string
    ticker: string
    trader: string
    baseToken: string
    descriptionURL: string
  }
}
