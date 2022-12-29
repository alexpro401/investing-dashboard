import { IPriceHistory } from "./thegraphs/all-pools"
import {
  Insurance,
  InvestorPoolPosition,
  InvestorPoolPositionWithHistory,
} from "./thegraphs/investors"
import { TIMEFRAME } from "consts/chart"

export interface IPriceHistoryWithCalcPNL extends IPriceHistory {
  pnl: number | string
  price: string
}

export interface InsuranceAccidentChartPoint {
  activeLabel: number
  payload: IPriceHistoryWithCalcPNL
}

export interface InsuranceAccidentInfo {
  pool: string
  block: string
  date: string
  description: string
  chat: string
}

export interface InsuranceAccidentInvestorsTotalsInfo {
  users: string
  lp: string
  loss: string
  coverage: string
  coverageUSD?: string
}

export interface InsuranceAccidentInvestor extends Insurance {
  poolPositionBeforeAccident: InvestorPoolPositionWithHistory
  poolPositionOnAccidentCreation: InvestorPoolPosition
}

export type InsuranceAccidentInvestors = Record<
  string,
  InsuranceAccidentInvestor
>

export interface InsuranceAccidentPriceHistory {
  data: IPriceHistory[]
  point: InsuranceAccidentChartPoint
  forPool: string
  timeframe: TIMEFRAME
}

export interface InsuranceAccident {
  creator: string
  timestamp: number
  form: InsuranceAccidentInfo
  investorsTotals: InsuranceAccidentInvestorsTotalsInfo
  investorsInfo: InsuranceAccidentInvestors
  chart: InsuranceAccidentPriceHistory

  insuranceAccidentExist: boolean
  insurancePoolHaveTrades: boolean

  insurancePoolLastPriceHistory: IPriceHistory
}
