import React, { createContext } from "react"

interface ICreateFundContext {}

export const CreateFundContext = createContext<ICreateFundContext>({})

interface ICreateFundContextProviderProp {
  children: React.ReactNode
}

const CreateFundContextProvider: React.FC<ICreateFundContextProviderProp> = ({
  children,
}) => {
  return (
    <CreateFundContext.Provider value={{}}>
      {children}
    </CreateFundContext.Provider>
  )
}

export default CreateFundContextProvider
