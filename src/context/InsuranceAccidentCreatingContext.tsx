import { createContext } from "react"
import { Insurance } from "interfaces/thegraphs/investors"
import { IPriceHistoryWithCalcPNL } from "interfaces/thegraphs/all-pools"

export interface InsuranceAccident {
  pool: {
    get: string
    set: (value: string) => void
  }
  block: {
    get: string
    set: (value: string) => void
  }
  date: {
    get: string
    set: (value: string) => void
  }
  description: {
    get: string
    set: (value: string) => void
  }
  chat: {
    get: string
    set: (value: string) => void
  }
}

export interface InsuranceAccidentExist {
  get: boolean
  set: (value: boolean) => void
}

export interface InsuranceDueDate {
  get: Insurance | undefined
  set: (value: Insurance) => void
}

export interface PoolPriceHistoryDueDate {
  get: IPriceHistoryWithCalcPNL | undefined
  set: (value: IPriceHistoryWithCalcPNL) => void
}

export interface InvestorsTotalsData {
  lp: string
  loss: string
  coverage: string
}
export interface InvestorsTotals {
  get: InvestorsTotalsData | undefined
  set: (value: InvestorsTotalsData) => void
}

export interface InvestorsInfo {
  get: any | undefined
  set: (value: any) => void
}

interface InsuranceAccidentCreatingContext {
  form: InsuranceAccident | undefined
  insuranceAccidentExist: InsuranceAccidentExist | undefined
  insuranceDueDate: InsuranceDueDate | undefined
  poolPriceHistoryDueDate: PoolPriceHistoryDueDate | undefined
  investorsTotals: InvestorsTotals | undefined
  investorsInfo: InvestorsInfo | undefined
}

export const InsuranceAccidentCreatingContext =
  createContext<InsuranceAccidentCreatingContext>({
    form: undefined,
    insuranceAccidentExist: undefined,
    insuranceDueDate: undefined,
    poolPriceHistoryDueDate: undefined,
    investorsTotals: undefined,
    investorsInfo: undefined,
  })
