import {
  createContext,
  Dispatch,
  FC,
  HTMLAttributes,
  SetStateAction,
  useEffect,
  useState,
} from "react"
import { Insurance } from "interfaces/thegraphs/investors"
import { IPriceHistoryWithCalcPNL } from "interfaces/thegraphs/all-pools"
import { useSelector } from "react-redux"
import { selectInsuranceAccidentByPool } from "state/ipfsMetadata/selectors"
import {
  InsuranceAccidentInvestors,
  InsuranceAccidentInvestorsTotalsInfo,
} from "interfaces/insurance"

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

export interface PoolPriceHistoryDueDate {
  get: IPriceHistoryWithCalcPNL
  set: Dispatch<SetStateAction<IPriceHistoryWithCalcPNL>>
}

export interface InvestorsTotals {
  get: InsuranceAccidentInvestorsTotalsInfo
  set: Dispatch<SetStateAction<InsuranceAccidentInvestorsTotalsInfo>>
}

export interface InvestorsInfo {
  get: InsuranceAccidentInvestors
  set: Dispatch<SetStateAction<InsuranceAccidentInvestors>>
}

interface InsuranceAccidentCreatingContext {
  form: InsuranceAccidentForm
  insuranceAccidentExist: InsuranceAccidentExist
  insuranceDueDate: InsuranceDueDate
  poolPriceHistoryDueDate: PoolPriceHistoryDueDate
  investorsTotals: InvestorsTotals
  investorsInfo: InvestorsInfo
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
    poolPriceHistoryDueDate: {
      get: {} as IPriceHistoryWithCalcPNL,
      set: () => {},
    },
    investorsTotals: {
      get: {} as InsuranceAccidentInvestorsTotalsInfo,
      set: () => {},
    },
    investorsInfo: { get: {} as InsuranceAccidentInvestors, set: () => {} },
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

  const _insuranceAccidentExist = useState<boolean>(false)
  const accidentByChosenPool = useSelector(
    selectInsuranceAccidentByPool(form.pool[0])
  )
  useEffect(() => {
    _insuranceAccidentExist[1](accidentByChosenPool !== null)
  }, [accidentByChosenPool])

  const insuranceDueDate = useState<Insurance>({} as Insurance)

  const poolPriceHistoryDueDate = useState<IPriceHistoryWithCalcPNL>(
    {} as IPriceHistoryWithCalcPNL
  )

  const investorsTotals = useState<InsuranceAccidentInvestorsTotalsInfo>(
    {} as InsuranceAccidentInvestorsTotalsInfo
  )

  const investorsInfo = useState<InsuranceAccidentInvestors>(
    {} as InsuranceAccidentInvestors
  )

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
            get: _insuranceAccidentExist[0],
            set: _insuranceAccidentExist[1],
          },
          insuranceDueDate: {
            get: insuranceDueDate[0],
            set: insuranceDueDate[1],
          },
          poolPriceHistoryDueDate: {
            get: poolPriceHistoryDueDate[0],
            set: poolPriceHistoryDueDate[1],
          },
          investorsTotals: {
            get: investorsTotals[0],
            set: investorsTotals[1],
          },
          investorsInfo: {
            set: investorsInfo[1],
            get: investorsInfo[0],
          },
        }}
      >
        {children}
      </InsuranceAccidentCreatingContext.Provider>
    </>
  )
}

export default InsuranceAccidentCreatingContextProvider
