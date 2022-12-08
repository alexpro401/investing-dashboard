import React, { createContext, useState, useCallback } from "react"
import { v4 as uuid } from "uuid"

interface IContract {
  value: string
  contractAddress: string
  transactionData: string
  id: string
}

interface IAdvancedManualContext {
  contracts: {
    get: IContract[]
    set: (index: number, value: IContract) => void
  }
  executorContract: {
    get: IContract
    set: (value: IContract) => void
  }
  onContractDelete: (index: number) => void
  onContractAdd: () => void
}

export const AdvancedManualContext = createContext<IAdvancedManualContext>({
  contracts: {
    get: [],
    set: () => {},
  },
  executorContract: {
    get: { value: "", contractAddress: "", transactionData: "", id: "" },
    set: () => {},
  },
  onContractDelete: () => {},
  onContractAdd: () => {},
})

interface IAdvancedManualContextProvider {
  children: React.ReactNode
}

const AdvancedManualContextProvider: React.FC<
  IAdvancedManualContextProvider
> = ({ children }) => {
  const [_contracts, _setContracts] = useState<IContract[]>([])

  const [_executorContract, _setExecutorContract] = useState<IContract>({
    value: "",
    contractAddress: "",
    transactionData: "",
    id: uuid(),
  })

  const onContractChange = useCallback((index: number, value: IContract) => {
    _setContracts((prev) => {
      return prev.map((el, idx) => {
        if (idx === index) return value
        return el
      })
    })
  }, [])

  const changeExecutorContract = useCallback((value: IContract) => {
    _setExecutorContract(value)
  }, [])

  const onContractDelete = useCallback((index: number) => {
    _setContracts((prev) => {
      if (prev.length === 1) return prev

      return prev.filter((el, idx) => idx !== index)
    })
  }, [])

  const onContractAdd = useCallback(() => {
    _setContracts((prev) => {
      const newContracts = prev.concat([
        {
          value: "",
          contractAddress: "",
          transactionData: "",
          id: uuid(),
        },
      ])

      return newContracts
    })
  }, [])

  return (
    <AdvancedManualContext.Provider
      value={{
        contracts: { get: _contracts, set: onContractChange },
        executorContract: {
          get: _executorContract,
          set: changeExecutorContract,
        },
        onContractDelete,
        onContractAdd,
      }}
    >
      {children}
    </AdvancedManualContext.Provider>
  )
}

export default AdvancedManualContextProvider
