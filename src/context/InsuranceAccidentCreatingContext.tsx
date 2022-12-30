import {
  createContext,
  Dispatch,
  FC,
  HTMLAttributes,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { Insurance } from "interfaces/thegraphs/investors"
import {
  InsuranceAccidentInvestors,
  InsuranceAccidentInvestorsTotalsInfo,
  InsuranceAccidentChartPoint,
  InsuranceAccident,
} from "interfaces/insurance"
import { IPriceHistory } from "interfaces/thegraphs/all-pools"
import { TIMEFRAME } from "consts/chart"
import { useLocalStorage } from "react-use"
import { INITIAL_INSURANCE_ACCIDENT } from "consts/insurance"
import { isEqual } from "lodash"

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

export interface InsurancePoolHaveTrades {
  get: boolean
  set: Dispatch<SetStateAction<boolean>>
}
export interface InsurancePoolLastTradeHistory {
  get: IPriceHistory
  set: Dispatch<SetStateAction<IPriceHistory>>
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
    get: TIMEFRAME
    set: Dispatch<SetStateAction<TIMEFRAME>>
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

interface InsuranceAccidentCreatingContextUtilities {
  _clearState: () => void
  clearFormStorage: () => void
}

interface InsuranceAccidentCreatingContext
  extends InsuranceAccidentCreatingContextUtilities {
  form: InsuranceAccidentForm
  insurancePoolHaveTrades: InsurancePoolHaveTrades
  insurancePoolLastPriceHistory: InsurancePoolLastTradeHistory
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

    insurancePoolHaveTrades: { get: false, set: () => {} },
    insurancePoolLastPriceHistory: { get: {} as IPriceHistory, set: () => {} },
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
      timeframe: { get: TIMEFRAME.m, set: () => {} },
      forPool: { get: "", set: () => {} },
    },
    _clearState: () => {},
    clearFormStorage: () => {},
  })

interface InsuranceAccidentCreatingContextProviderProps
  extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  customLSKey?: string
}

const InsuranceAccidentCreatingContextProvider: FC<
  InsuranceAccidentCreatingContextProviderProps
> = ({ children, customLSKey }) => {
  const [value, setValue, remove] = useLocalStorage(
    customLSKey ? customLSKey : "creating-new-dao-proposal-insurance-accident",
    JSON.stringify(INITIAL_INSURANCE_ACCIDENT)
  )

  const storedForm = useMemo<InsuranceAccident>(() => {
    try {
      return value ? JSON.parse(value) : {}
    } catch (error) {
      return {}
    }
  }, [value])

  const [_pool, _setPool] = useState<string>(storedForm.form.pool ?? "")
  const [_block, _setBlock] = useState<string>(storedForm.form.block ?? "")
  const [_date, _setDate] = useState<string>(storedForm.form.date ?? "")
  const [_chat, _setChat] = useState<string>(storedForm.form.chat ?? "")
  const [_description, _setDescription] = useState<string>(
    storedForm.form.description ?? ""
  )

  const [_insuranceAccidentExist, _setInsuranceAccidentExist] =
    useState<boolean>(storedForm.insuranceAccidentExist ?? false)
  const [_insurancePoolHaveTrades, _setInsurancePoolHaveTrades] =
    useState<boolean>(false)
  const [_insurancePoolLastPriceHistory, _setInsurancePoolLastPriceHistory] =
    useState<IPriceHistory>({} as IPriceHistory)

  const insuranceDueDate = useState<Insurance>({} as Insurance)

  const investorsTotals = useState<InsuranceAccidentInvestorsTotalsInfo>(
    storedForm.investorsTotals
  )

  const investorsInfo = useState<InsuranceAccidentInvestors>(
    storedForm.investorsInfo
  )

  const chart = {
    point: useState<InsuranceAccidentChartPoint>(storedForm.chart.point),
    data: useState<IPriceHistory[]>(storedForm.chart.data),
    timeframe: useState<TIMEFRAME>(storedForm.chart.timeframe),
    forPool: useState<string>(storedForm.chart.forPool),
  }

  useEffect(() => {
    setValue((prevState) => {
      const nextStateRaw = {
        form: {
          pool: _pool,
          block: _block,
          date: _date,
          description: _description,
          chat: _chat,
        },
        insuranceAccidentExist: _insuranceAccidentExist,
        insurancePoolHaveTrades: _insurancePoolHaveTrades,
        insurancePoolLastPriceHistory: _insurancePoolLastPriceHistory,
        investorsTotals: investorsTotals[0],
        investorsInfo: investorsInfo[0],
        chart: {
          point: chart.point[0],
          data: chart.data[0],
          timeframe: chart.timeframe[0],
          forPool: chart.forPool[0],
        },
      }
      const nextState = JSON.stringify(nextStateRaw)

      return isEqual(prevState, nextState) ? prevState : nextState
    })
  }, [
    _pool,
    _block,
    _date,
    _description,
    _chat,
    _insuranceAccidentExist,
    _insurancePoolHaveTrades,
    _insurancePoolLastPriceHistory,
    investorsTotals[0],
    investorsInfo[0],
    chart.point[0],
    chart.data[0],
    chart.timeframe[0],
    chart.forPool[0],
  ])

  const _clearState = useCallback(() => {
    setValue(JSON.stringify(INITIAL_INSURANCE_ACCIDENT))
  }, [])

  return (
    <>
      <InsuranceAccidentCreatingContext.Provider
        value={{
          form: {
            pool: {
              get: _pool,
              set: _setPool,
            },
            block: {
              get: _block,
              set: _setBlock,
            },
            date: {
              get: _date,
              set: _setDate,
            },
            description: {
              get: _description,
              set: _setDescription,
            },
            chat: {
              get: _chat,
              set: _setChat,
            },
          },
          insurancePoolHaveTrades: {
            get: _insurancePoolHaveTrades,
            set: _setInsurancePoolHaveTrades,
          },
          insurancePoolLastPriceHistory: {
            get: _insurancePoolLastPriceHistory,
            set: _setInsurancePoolLastPriceHistory,
          },
          insuranceAccidentExist: {
            get: _insuranceAccidentExist,
            set: _setInsuranceAccidentExist,
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
          _clearState,
          clearFormStorage: remove,
        }}
      >
        {children}
      </InsuranceAccidentCreatingContext.Provider>
    </>
  )
}

export default InsuranceAccidentCreatingContextProvider
