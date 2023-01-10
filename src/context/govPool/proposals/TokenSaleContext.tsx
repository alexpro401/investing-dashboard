import React, { createContext, Dispatch, SetStateAction, useState } from "react"

import { ITreasuryToken } from "api/token/types"

interface ITokenSaleCreatingContext {
  selectedTreasuryToken: {
    get: ITreasuryToken | null
    set: Dispatch<SetStateAction<ITreasuryToken | null>>
  }
  tokenAmount: { get: string; set: Dispatch<SetStateAction<string>> }
}

interface ITokenSaleContextProviderProps {
  children: React.ReactNode
}

export const TokenSaleCreatingContext =
  createContext<ITokenSaleCreatingContext>({
    selectedTreasuryToken: { get: null, set: () => {} },
    tokenAmount: { get: "", set: () => {} },
  })

const TokenSaleCreatingContextProvider: React.FC<
  ITokenSaleContextProviderProps
> = ({ children }) => {
  const [_selectedTreasuryToken, _setSelectedTreasuryToken] =
    useState<ITreasuryToken | null>(null)
  const [_tokenAmount, _seTokenAmount] = useState<string>("")

  return (
    <TokenSaleCreatingContext.Provider
      value={{
        selectedTreasuryToken: {
          get: _selectedTreasuryToken,
          set: _setSelectedTreasuryToken,
        },
        tokenAmount: { get: _tokenAmount, set: _seTokenAmount },
      }}
    >
      {children}
    </TokenSaleCreatingContext.Provider>
  )
}

export default TokenSaleCreatingContextProvider
