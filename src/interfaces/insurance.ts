import { IPriceHistoryWithCalcPNL } from "./thegraphs/all-pools"
import {
  Insurance,
  InvestorPoolPosition,
  InvestorPoolPositionWithHistory,
} from "./thegraphs/investors"

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

export interface InsuranceAccident {
  creator: string
  timestamp: number
  accidentInfo: InsuranceAccidentInfo
  poolPriceHistoryDueDate: IPriceHistoryWithCalcPNL
  investorsTotals: InsuranceAccidentInvestorsTotalsInfo
  investorsInfo: InsuranceAccidentInvestors
}
