import { createContext, useContext, useReducer, useCallback } from "react"
import { Token } from "interfaces"
import { sliderPropsByPeriodType } from "constants/index"
import { IValidationError } from "constants/types"

interface IState {
  avatarBlobString: string
  fundType: string
  fundName: string
  fundSymbol: string
  ipfsHash: string
  description: string
  strategy: string
  trader: string
  privatePool: boolean
  totalLPEmission: string
  baseToken: Token
  minimalInvestment: string
  commissionPeriod: number
  commissionPercentage: number
  managers: string[]
  investors: string[]
  validationErrors: IValidationError[]
}

interface IContext extends IState {
  handleChange: (name: string, value: any) => void
  handleValidate: () => boolean
}

const defaultState = {
  avatarBlobString: "",
  fundType: "basic",
  fundName: "",
  fundSymbol: "",
  ipfsHash: "",
  description: "",
  strategy: "",
  trader: "",
  privatePool: false,
  totalLPEmission: "",
  baseToken: {
    address: "",
    name: "",
    symbol: "",
    decimals: 0,
  },
  minimalInvestment: "",
  commissionPeriod: 0,
  commissionPercentage: 30,
  managers: [],
  investors: [],
  validationErrors: [],
}

const defaultContext = {
  ...defaultState,
  handleChange: () => {},
  handleValidate: () => false,
}

const FundContext = createContext<IContext>(defaultContext)

export const useCreateFundContext = () => useContext(FundContext)

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key
      }
    : {
        type: Key
        payload: M[Key]
      }
}

export enum CreateFundTypes {
  CHANGE = "CHANGE",
  SET_ERRORS = "SET_ERRORS",
}

type CreateFundPayload = {
  [CreateFundTypes.CHANGE]: {
    name: string
    value: any
  }
  [CreateFundTypes.SET_ERRORS]: {
    validationErrors: IValidationError[]
  }
}

type CreateFundActions =
  ActionMap<CreateFundPayload>[keyof ActionMap<CreateFundPayload>]

function createFundReducer(state: IState, action: CreateFundActions) {
  switch (action.type) {
    case CreateFundTypes.CHANGE:
      if (
        Object.prototype.toString.call(action.payload.value) ===
        "[object Array]"
      ) {
        return {
          ...state,
          [action.payload.name]: [...action.payload.value],
        }
      }
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      }
    case CreateFundTypes.SET_ERRORS:
      return {
        ...state,
        validationErrors: action.payload.validationErrors,
      }

    default:
      return state
  }
}

export function FundContextProvider({ children }) {
  const [state, dispatch] = useReducer(createFundReducer, defaultState)
  const {
    fundName,
    fundSymbol,
    baseToken,
    totalLPEmission,
    minimalInvestment,
    commissionPeriod,
    commissionPercentage,
  } = state

  const handleChange = useCallback((name: string, value: any) => {
    dispatch({
      type: CreateFundTypes.CHANGE,
      payload: {
        name,
        value,
      },
    })
  }, [])

  const handleValidate = useCallback(() => {
    const errors: IValidationError[] = []

    // FUND NAME
    if (fundName === "") {
      errors.push({
        message: "Fund name is required",
        field: "fundName",
      })
    }

    if (fundName.length > 15) {
      errors.push({
        message: "Fund name must be less than 15 characters",
        field: "fundName",
      })
    }

    // FUND SYMBOL
    if (fundSymbol === "") {
      errors.push({
        message: "Fund symbol is required",
        field: "fundSymbol",
      })
    }

    if (fundSymbol.length > 8) {
      errors.push({
        message: "Fund symbol must be less than 8 characters",
        field: "fundSymbol",
      })
    }

    // BASE TOKEN

    if (baseToken.address === "") {
      errors.push({
        message: "Base token is required",
        field: "baseToken",
      })
    }

    // TOTAL LPEmission

    if (totalLPEmission !== "") {
      if (isNaN(Number(totalLPEmission))) {
        errors.push({
          message: "Total LP emission must be a number",
          field: "totalLPEmission",
        })
      }
    }

    // MINIMAL INVESTMENT

    if (minimalInvestment !== "") {
      if (isNaN(Number(minimalInvestment))) {
        errors.push({
          message: "Minimal investment must be a number",
          field: "minimalInvestment",
        })
      }
    }

    // COMMISSION PERIOD PERCENTAGE

    if (sliderPropsByPeriodType[commissionPeriod].min > commissionPercentage) {
      errors.push({
        message: "Commission percentage must be greater than minimum value",
        field: "commissionPercentage",
      })
    }

    if (sliderPropsByPeriodType[commissionPeriod].max < commissionPercentage) {
      errors.push({
        message: "Commission percentage must be less than maximum value",
        field: "commissionPercentage",
      })
    }

    dispatch({
      type: CreateFundTypes.SET_ERRORS,
      payload: {
        validationErrors: errors,
      },
    })

    return !errors.length
  }, [
    baseToken.address,
    commissionPercentage,
    commissionPeriod,
    fundName,
    fundSymbol,
    minimalInvestment,
    totalLPEmission,
  ])

  return (
    <FundContext.Provider value={{ ...state, handleChange, handleValidate }}>
      {children}
    </FundContext.Provider>
  )
}

export default FundContext
