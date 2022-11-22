import React, { useState, createContext, Dispatch, SetStateAction } from "react"

import { ITreasuryToken } from "api/kattana/types"

interface ITokenDistributionCreatingContext {
  selectedTreasuryToken: {
    get: ITreasuryToken | null
    set: Dispatch<SetStateAction<ITreasuryToken | null>>
  }
  tokenAmount: { get: string; set: Dispatch<SetStateAction<string>> }
}

interface ITokenDistributionContextProviderProps {
  children: React.ReactNode
}

export const TokenDistributionCreatingContext =
  createContext<ITokenDistributionCreatingContext>({
    selectedTreasuryToken: { get: null, set: () => {} },
    tokenAmount: { get: "", set: () => {} },
  })

const TokenDistributionCreatingContextProvider: React.FC<
  ITokenDistributionContextProviderProps
> = ({ children }) => {
  const [_selectedTreasuryToken, _setSelectedTreasuryToken] =
    useState<ITreasuryToken | null>(null)
  const [_tokenAmount, _seTokenAmount] = useState<string>("")

  return (
    <TokenDistributionCreatingContext.Provider
      value={{
        selectedTreasuryToken: {
          get: _selectedTreasuryToken,
          set: _setSelectedTreasuryToken,
        },
        tokenAmount: { get: _tokenAmount, set: _seTokenAmount },
      }}
    >
      {children}
    </TokenDistributionCreatingContext.Provider>
  )
}

export default TokenDistributionCreatingContextProvider
