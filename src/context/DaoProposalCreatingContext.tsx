import React, { useState, createContext, Dispatch, SetStateAction } from "react"

interface IDaoProposalCreatingContext {
  contractAddress: { get: string; set: Dispatch<SetStateAction<string>> }
  proposalName: { get: string; set: Dispatch<SetStateAction<string>> }
  description: { get: string; set: Dispatch<SetStateAction<string>> }
}

interface IDaoProposalCreatingContextProviderProps {
  children: React.ReactNode
  isCreatingCustomProposal?: boolean
}

export const DaoProposalCreatingContext =
  createContext<IDaoProposalCreatingContext>({
    contractAddress: { get: "", set: () => {} },
    proposalName: { get: "", set: () => {} },
    description: { get: "", set: () => {} },
  })

const DaoProposalCreatingContextProvider: React.FC<
  IDaoProposalCreatingContextProviderProps
> = ({ children }) => {
  const [_contractAddress, _setContractAddress] = useState<string>("")
  const [_proposalName, _setProposalName] = useState<string>("")
  const [_description, _setDescriptionName] = useState<string>("")

  return (
    <DaoProposalCreatingContext.Provider
      value={{
        contractAddress: { get: _contractAddress, set: _setContractAddress },
        proposalName: { get: _proposalName, set: _setProposalName },
        description: { get: _description, set: _setDescriptionName },
      }}
    >
      {children}
    </DaoProposalCreatingContext.Provider>
  )
}

export default DaoProposalCreatingContextProvider
