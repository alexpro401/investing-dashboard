import { IPriceHistory } from "./thegraphs/all-pools"
import {
  Insurance,
  InvestorPoolPosition,
  InvestorPoolPositionWithHistory,
} from "./thegraphs/investors"

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
  lp: string
  loss: string
  coverage: string
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
  timeframe: string
}

export interface InsuranceAccident {
  creator: string
  timestamp: number
  accidentInfo: InsuranceAccidentInfo
  investorsTotals: InsuranceAccidentInvestorsTotalsInfo
  investorsInfo: InsuranceAccidentInvestors
  chart: InsuranceAccidentPriceHistory
}
