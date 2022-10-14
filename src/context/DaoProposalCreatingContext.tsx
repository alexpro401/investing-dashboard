import React, { useState, createContext, Dispatch, SetStateAction } from "react"

interface IDaoProposalCreatingContext {
  contractAddress: { get: string; set: Dispatch<SetStateAction<string>> }
  proposalTypeName: { get: string; set: Dispatch<SetStateAction<string>> }
  proposalName: { get: string; set: Dispatch<SetStateAction<string>> }
  proposalDescription: { get: string; set: Dispatch<SetStateAction<string>> }
}

interface IDaoProposalCreatingContextProviderProps {
  children: React.ReactNode
  isCreatingCustomProposal?: boolean
}

export const DaoProposalCreatingContext =
  createContext<IDaoProposalCreatingContext>({
    contractAddress: { get: "", set: () => {} },
    proposalTypeName: { get: "", set: () => {} },
    proposalName: { get: "", set: () => {} },
    proposalDescription: { get: "", set: () => {} },
  })

const DaoProposalCreatingContextProvider: React.FC<
  IDaoProposalCreatingContextProviderProps
> = ({ children }) => {
  const [_contractAddress, _setContractAddress] = useState<string>("")
  const [_proposalTypeName, _setProposalTypeName] = useState<string>("")
  const [_proposalName, _setProposalName] = useState<string>("")
  const [_proposalDescription, _setProposalDescription] = useState<string>("")

  return (
    <DaoProposalCreatingContext.Provider
      value={{
        contractAddress: { get: _contractAddress, set: _setContractAddress },
        proposalTypeName: { get: _proposalTypeName, set: _setProposalTypeName },
        proposalName: { get: _proposalName, set: _setProposalName },
        proposalDescription: {
          get: _proposalDescription,
          set: _setProposalDescription,
        },
      }}
    >
      {children}
    </DaoProposalCreatingContext.Provider>
  )
}

export default DaoProposalCreatingContextProvider
