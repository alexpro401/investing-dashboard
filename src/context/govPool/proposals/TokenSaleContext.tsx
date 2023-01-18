import React, { createContext, useState, useCallback } from "react"

import { ITreasuryToken } from "api/token/types"

interface ISellPair {
  tokenAddress: string
  amount: string
}

interface ITokenSaleProposal {
  selectedTreasuryToken: ITreasuryToken | null
  tokenAmount: string
  minAllocation: string
  maxAllocation: string
  sellStartDate: number
  sellEndDate: number
  proposalName: string
  proposalDescription: string
  sellPairs: ISellPair[]
}

const TOKEN_SALE_PROPOSAL_BASE: ITokenSaleProposal = {
  selectedTreasuryToken: null,
  tokenAmount: "",
  minAllocation: "",
  maxAllocation: "",
  sellStartDate: 0,
  sellEndDate: 0,
  proposalName: "",
  proposalDescription: "",
  sellPairs: [{ tokenAddress: "", amount: "" }],
}

interface ITokenSaleCreatingContext {
  tokenSaleProposals: ITokenSaleProposal[]
  handleUpdateTokenSaleProposal: <T extends keyof ITokenSaleProposal>(
    index: number,
    field: T,
    value: ITokenSaleProposal[T]
  ) => void
  currentProposalIndex: number
}

interface ITokenSaleContextProviderProps {
  children: React.ReactNode
}

export const TokenSaleCreatingContext =
  createContext<ITokenSaleCreatingContext>({
    tokenSaleProposals: [],
    currentProposalIndex: 0,
    handleUpdateTokenSaleProposal: () => {},
  })

const TokenSaleCreatingContextProvider: React.FC<
  ITokenSaleContextProviderProps
> = ({ children }) => {
  const [_tokenSaleProposals, _setTokenSaleProposals] = useState<
    ITokenSaleProposal[]
  >([TOKEN_SALE_PROPOSAL_BASE])
  const [_currentProposalIndex, _setCurrentProposalIndex] = useState<number>(0)

  const handleUpdateTokenSaleProposal = useCallback(function <
    T extends keyof ITokenSaleProposal
  >(index: number, field: T, value: ITokenSaleProposal[T]) {
    _setTokenSaleProposals((arr) => {
      const newArr = [...arr]
      newArr[index] = { ...newArr[index], [field]: value }

      return newArr
    })
  },
  [])

  return (
    <TokenSaleCreatingContext.Provider
      value={{
        tokenSaleProposals: _tokenSaleProposals,
        handleUpdateTokenSaleProposal,
        currentProposalIndex: _currentProposalIndex,
      }}
    >
      {children}
    </TokenSaleCreatingContext.Provider>
  )
}

export default TokenSaleCreatingContextProvider
