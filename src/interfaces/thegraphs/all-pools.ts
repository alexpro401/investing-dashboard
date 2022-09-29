import { BigNumber } from "@ethersproject/bignumber"
import { PoolType } from "constants/types"

export interface IPriceHistory {
  APY: BigNumber
  usdTVL: number
  baseTVL: number
  supply: number
  absPNL: number
  percPNL: number
  timestamp: number
  traderUSD: number
  aggregationType: number
}

export interface IPriceHistoryWithCalcPNL extends IPriceHistory {
  pnl: string
  price: string
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
  orderSize: BigNumber
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
  totalUSDOpenVolume: string
  totalUSDCloseVolume: string
  totalBaseOpenVolume: string
  totalBaseCloseVolume: string
  totalPositionOpenVolume: string
  totalPositionCloseVolume: string
  exchanges: IExchange[]
  traderPool: {
    id: string
    ticker: string
    trader: string
    baseToken: string
    descriptionURL: string
  }
}
