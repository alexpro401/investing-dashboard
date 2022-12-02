import React, { createContext, useState, useCallback } from "react"
import { v4 as uuid } from "uuid"

interface IExecutorAddress {
  id: string
  address: string
}

interface ICreateCustomProposalTypeContext {
  executorAddresses: {
    get: IExecutorAddress[]
    set: (index: number, value: string) => void
  }
  addExecutorAddress: () => void
  deleteExecutorAddress: (index: number) => void
}

export const createCustomProposalTypeContext =
  createContext<ICreateCustomProposalTypeContext>({
    executorAddresses: {
      get: [],
      set: () => {},
    },
    addExecutorAddress: () => {},
    deleteExecutorAddress: () => {},
  })

interface ICreateCustomProposalTypeContextProviderProps {
  children: React.ReactNode
}

const CreateCustomProposalTypeContextProvider: React.FC<
  ICreateCustomProposalTypeContextProviderProps
> = ({ children }) => {
  const [_executorAddresses, _setExecutorAddresses] = useState<
    IExecutorAddress[]
  >([{ id: uuid(), address: "" }])

  const handleAddExecutorAddress = useCallback(() => {
    _setExecutorAddresses((prev) => {
      const newExecutors = [{ id: uuid(), address: "" }].concat([...prev])

      return newExecutors
    })
  }, [])

  const handleChangeExecutorAddress = useCallback(
    (index: number, value: string) => {
      _setExecutorAddresses((prev) => {
        const newExecutors = [...prev]
        newExecutors[index] = { ...newExecutors[index], address: value }

        return newExecutors
      })
    },
    []
  )

  const handleDeleteExecutorAddress = useCallback((index: number) => {
    _setExecutorAddresses((prev) => {
      const newExecutors = [...prev].filter((_, idx) => idx !== index)

      return newExecutors
    })
  }, [])

  return (
    <createCustomProposalTypeContext.Provider
      value={{
        executorAddresses: {
          get: _executorAddresses,
          set: handleChangeExecutorAddress,
        },
        addExecutorAddress: handleAddExecutorAddress,
        deleteExecutorAddress: handleDeleteExecutorAddress,
      }}
    >
      {children}
    </createCustomProposalTypeContext.Provider>
  )
}

export default CreateCustomProposalTypeContextProvider
