import {
  createContext,
  Dispatch,
  FC,
  HTMLAttributes,
  SetStateAction,
  useState,
} from "react"
import { Insurance } from "interfaces/thegraphs/investors"
import {
  InsuranceAccidentInvestors,
  InsuranceAccidentInvestorsTotalsInfo,
  InsuranceAccidentChartPoint,
} from "interfaces/insurance"
import { IPriceHistory } from "interfaces/thegraphs/all-pools"
import { TIMEFRAMES } from "constants/history"

export interface InsuranceAccidentForm {
  pool: {
    get: string
    set: Dispatch<SetStateAction<string>>
  }
  block: {
    get: string
    set: Dispatch<SetStateAction<string>>
  }
  date: {
    get: string
    set: Dispatch<SetStateAction<string>>
  }
  description: {
    get: string
    set: Dispatch<SetStateAction<string>>
  }
  chat: {
    get: string
    set: Dispatch<SetStateAction<string>>
  }
}

export interface InsuranceAccidentExist {
  get: boolean
  set: Dispatch<SetStateAction<boolean>>
}

export interface InsuranceDueDate {
  get: Insurance
  set: Dispatch<SetStateAction<Insurance>>
}

export interface InvestorsTotals {
  get: InsuranceAccidentInvestorsTotalsInfo
  set: Dispatch<SetStateAction<InsuranceAccidentInvestorsTotalsInfo>>
}

export interface InvestorsInfo {
  get: InsuranceAccidentInvestors
  set: Dispatch<SetStateAction<InsuranceAccidentInvestors>>
}

export interface Chart {
  point: {
    get: InsuranceAccidentChartPoint
    set: Dispatch<SetStateAction<InsuranceAccidentChartPoint>>
  }
  timeframe: {
    get: string
    set: Dispatch<SetStateAction<string>>
  }
  data: {
    get: IPriceHistory[]
    set: Dispatch<SetStateAction<IPriceHistory[]>>
  }
  forPool: {
    get: string
    set: Dispatch<SetStateAction<string>>
  }
}

interface InsuranceAccidentCreatingContext {
  form: InsuranceAccidentForm
  insuranceAccidentExist: InsuranceAccidentExist
  insuranceDueDate: InsuranceDueDate
  investorsTotals: InvestorsTotals
  investorsInfo: InvestorsInfo
  chart: Chart
}

export const InsuranceAccidentCreatingContext =
  createContext<InsuranceAccidentCreatingContext>({
    form: {
      pool: { get: "", set: () => {} },
      block: { get: "", set: () => {} },
      date: { get: "", set: () => {} },
      description: { get: "", set: () => {} },
      chat: { get: "", set: () => {} },
    } as InsuranceAccidentForm,

    insuranceAccidentExist: { get: false, set: () => {} },
    insuranceDueDate: { get: {} as Insurance, set: () => {} },
    investorsTotals: {
      get: {} as InsuranceAccidentInvestorsTotalsInfo,
      set: () => {},
    },
    investorsInfo: { get: {} as InsuranceAccidentInvestors, set: () => {} },

    chart: {
      point: { get: {} as InsuranceAccidentChartPoint, set: () => {} },
      data: { get: [] as IPriceHistory[], set: () => {} },
      timeframe: { get: "", set: () => {} },
      forPool: { get: "", set: () => {} },
    },
  })

const InsuranceAccidentCreatingContextProvider: FC<
  HTMLAttributes<HTMLDivElement>
> = ({ children }) => {
  const form = {
    pool: useState<string>(""),
    block: useState<string>(""),
    date: useState<string>(""),
    description: useState<string>(""),
    chat: useState<string>(""),
  }

  const insuranceAccidentExist = useState<boolean>(false)

  const insuranceDueDate = useState<Insurance>({} as Insurance)

  const investorsTotals = useState<InsuranceAccidentInvestorsTotalsInfo>(
    {} as InsuranceAccidentInvestorsTotalsInfo
  )

  const investorsInfo = useState<InsuranceAccidentInvestors>(
    {} as InsuranceAccidentInvestors
  )

  const chart = {
    point: useState<InsuranceAccidentChartPoint>(
      {} as InsuranceAccidentChartPoint
    ),
    data: useState<IPriceHistory[]>([] as IPriceHistory[]),
    timeframe: useState<string>(TIMEFRAMES["M"]),
    forPool: useState<string>(""),
  }

  return (
    <>
      <InsuranceAccidentCreatingContext.Provider
        value={{
          form: {
            pool: {
              get: form.pool[0],
              set: form.pool[1],
            },
            block: {
              get: form.block[0],
              set: form.block[1],
            },
            date: {
              get: form.date[0],
              set: form.date[1],
            },
            description: {
              get: form.description[0],
              set: form.description[1],
            },
            chat: {
              get: form.chat[0],
              set: form.chat[1],
            },
          },
          insuranceAccidentExist: {
            get: insuranceAccidentExist[0],
            set: insuranceAccidentExist[1],
          },
          insuranceDueDate: {
            get: insuranceDueDate[0],
            set: insuranceDueDate[1],
          },
          investorsTotals: {
            get: investorsTotals[0],
            set: investorsTotals[1],
          },
          investorsInfo: {
            get: investorsInfo[0],
            set: investorsInfo[1],
          },

          chart: {
            point: {
              get: chart.point[0],
              set: chart.point[1],
            },
            data: {
              get: chart.data[0],
              set: chart.data[1],
            },
            timeframe: {
              get: chart.timeframe[0],
              set: chart.timeframe[1],
            },
            forPool: {
              get: chart.forPool[0],
              set: chart.forPool[1],
            },
          },
        }}
      >
        {children}
      </InsuranceAccidentCreatingContext.Provider>
    </>
  )
}

export default InsuranceAccidentCreatingContextProvider
