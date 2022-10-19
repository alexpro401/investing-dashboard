import React, { createContext } from "react"

interface IDaoProposalChangeDaoSettingsCreatingContext {}

interface IDaoProposalChangeDaoSettingsCreatingContextProviderProps {
  children: React.ReactNode
}

export const DaoProposalChangeDaoSettingsCreatingContext =
  createContext<IDaoProposalChangeDaoSettingsCreatingContext>({})

const DaoProposalChangeDaoSettingsCreatingContextProvider: React.FC<
  IDaoProposalChangeDaoSettingsCreatingContextProviderProps
> = ({ children }) => {
  return (
    <DaoProposalChangeDaoSettingsCreatingContext.Provider value={{}}>
      {children}
    </DaoProposalChangeDaoSettingsCreatingContext.Provider>
  )
}

export default DaoProposalChangeDaoSettingsCreatingContextProvider
