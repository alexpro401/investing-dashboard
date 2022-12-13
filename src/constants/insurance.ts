import {
  InsuranceAccident,
  IPriceHistoryWithCalcPNL,
} from "interfaces/insurance"
import { TIMEFRAME } from "constants/chart"

export const INITIAL_INSURANCE_ACCIDENT: InsuranceAccident = {
  creator: "",
  timestamp: 0,
  form: {
    pool: "",
    block: "",
    date: "",
    description: "",
    chat: "",
  },
  investorsTotals: {
    lp: "",
    loss: "",
    coverage: "",
  },
  investorsInfo: {},
  chart: {
    data: [],
    point: { activeLabel: 0, payload: {} as IPriceHistoryWithCalcPNL },
    forPool: "",
    timeframe: TIMEFRAME.m,
  },
  insuranceAccidentExist: false,
  insurancePoolHaveTrades: false,
}
