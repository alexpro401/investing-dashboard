import React, { createContext, Dispatch, SetStateAction, useState } from "react"

import { ITreasuryToken } from "api/token/types"

interface ITokenSaleCreatingContext {
  selectedTreasuryToken: {
    get: ITreasuryToken | null
    set: Dispatch<SetStateAction<ITreasuryToken | null>>
  }
  tokenAmount: { get: string; set: Dispatch<SetStateAction<string>> }
  minAllocation: { get: string; set: Dispatch<SetStateAction<string>> }
  maxAllocation: { get: string; set: Dispatch<SetStateAction<string>> }
  sellStartDate: { get: number; set: Dispatch<SetStateAction<number>> }
  sellEndDate: { get: number; set: Dispatch<SetStateAction<number>> }
}

interface ITokenSaleContextProviderProps {
  children: React.ReactNode
}

export const TokenSaleCreatingContext =
  createContext<ITokenSaleCreatingContext>({
    selectedTreasuryToken: { get: null, set: () => {} },
    tokenAmount: { get: "", set: () => {} },
    minAllocation: { get: "", set: () => {} },
    maxAllocation: { get: "", set: () => {} },
    sellStartDate: { get: 0, set: () => {} },
    sellEndDate: { get: 0, set: () => {} },
  })

const TokenSaleCreatingContextProvider: React.FC<
  ITokenSaleContextProviderProps
> = ({ children }) => {
  const [_selectedTreasuryToken, _setSelectedTreasuryToken] =
    useState<ITreasuryToken | null>(null)
  const [_tokenAmount, _seTokenAmount] = useState<string>("")
  const [_minAllocation, _setMinAllocation] = useState<string>("")
  const [_maxAllocation, _setMaxAllocation] = useState<string>("")
  const [_sellStartDate, _setSellStartDate] = useState<number>(0)
  const [_sellEndDate, _setSellEndDate] = useState<number>(0)

  return (
    <TokenSaleCreatingContext.Provider
      value={{
        selectedTreasuryToken: {
          get: _selectedTreasuryToken,
          set: _setSelectedTreasuryToken,
        },
        tokenAmount: { get: _tokenAmount, set: _seTokenAmount },
        minAllocation: { get: _minAllocation, set: _setMinAllocation },
        maxAllocation: { get: _maxAllocation, set: _setMaxAllocation },
        sellStartDate: { get: _sellStartDate, set: _setSellStartDate },
        sellEndDate: { get: _sellEndDate, set: _setSellEndDate },
      }}
    >
      {children}
    </TokenSaleCreatingContext.Provider>
  )
}

export default TokenSaleCreatingContextProvider
