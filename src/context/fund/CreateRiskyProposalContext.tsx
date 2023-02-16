import { addDays, getTime } from "date-fns/esm"
import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useContext,
} from "react"
import { shortTimestamp } from "utils"

interface ICreateRiskyProposalContext {
  symbol: { get: string; set: Dispatch<SetStateAction<string>> }
  description: { get: string; set: Dispatch<SetStateAction<string>> }
  descriptionURL: { get: string; set: Dispatch<SetStateAction<string>> }
  lpAmount: { get: string; set: Dispatch<SetStateAction<string>> }
  timestampLimit: { get: number; set: Dispatch<SetStateAction<number>> }
  investLPLimit: { get: string; set: Dispatch<SetStateAction<string>> }
  maxTokenPriceLimit: { get: string; set: Dispatch<SetStateAction<string>> }
  instantTradePercentage: { get: string; set: Dispatch<SetStateAction<string>> }
}

export const CreateRiskyProposalContext =
  createContext<ICreateRiskyProposalContext>({
    symbol: { get: "", set: () => {} },
    description: { get: "", set: () => {} },
    descriptionURL: { get: "", set: () => {} },
    lpAmount: { get: "", set: () => {} },
    timestampLimit: { get: 0, set: () => {} },
    investLPLimit: { get: "", set: () => {} },
    maxTokenPriceLimit: { get: "", set: () => {} },
    instantTradePercentage: { get: "", set: () => {} },
  })

interface ICreateRiskyProposalContextProviderProp {
  children: React.ReactNode
}

const CreateRiskyProposalContextProvider: React.FC<
  ICreateRiskyProposalContextProviderProp
> = ({ children }) => {
  // initiate timestamp for 30 days from now
  const initialTimeLimit = shortTimestamp(getTime(addDays(new Date(), 30)))

  const [_symbol, _setSymbol] = useState<string>("")
  const [_description, _setDescription] = useState<string>("")
  const [_descriptionURL, _setDescriptionURL] = useState<string>("")
  const [_lpAmount, _setLpAmount] = useState<string>("")
  const [_timestampLimit, _setTimestampLimit] =
    useState<number>(initialTimeLimit)
  const [_investLPLimit, _setInvestLPLimit] = useState<string>("")
  const [_maxTokenPriceLimit, _setMaxTokenPriceLimit] = useState<string>("")
  const [_instantTradePercentage, _setInstantTradePercentage] =
    useState<string>("")

  return (
    <CreateRiskyProposalContext.Provider
      value={{
        symbol: { get: _symbol, set: _setSymbol },
        description: { get: _description, set: _setDescription },
        descriptionURL: { get: _descriptionURL, set: _setDescriptionURL },
        lpAmount: { get: _lpAmount, set: _setLpAmount },
        timestampLimit: { get: _timestampLimit, set: _setTimestampLimit },
        investLPLimit: { get: _investLPLimit, set: _setInvestLPLimit },
        maxTokenPriceLimit: {
          get: _maxTokenPriceLimit,
          set: _setMaxTokenPriceLimit,
        },
        instantTradePercentage: {
          get: _instantTradePercentage,
          set: _setInstantTradePercentage,
        },
      }}
    >
      {children}
    </CreateRiskyProposalContext.Provider>
  )
}

export const useCreateRiskyProposalContext = () =>
  useContext(CreateRiskyProposalContext)

export default CreateRiskyProposalContextProvider
