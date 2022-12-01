import React, { useState, createContext, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"
import { replaceAt } from "utils/array"

interface IAdvancedABIContext {
  contractAdresses: {
    get: [id: string, address: string][]
    set: (index: number, id: string, address: string) => void
  }
  contractValues: {
    get: string[]
    set: (index: number, value: string) => void
  }
  executorSelectedAddress: {
    get: string
    set: (value: string) => void
  }
  executorValue: {
    get: string
    set: (value: string) => void
  }
  encodedMethods: {
    get: {
      [key: string]: string[]
    }
    set: (key: string, value: string[]) => void
  }
  modal: {
    get: string
    set: (value: string) => void
  }
  onContractAddressAdd: () => void
  onContractAddressDelete: (index: number) => void
}

interface IAdvancedABIContextProviderProps {
  children: React.ReactNode
}

export const AdvancedABIContext = createContext<IAdvancedABIContext>({
  contractAdresses: { get: [], set: () => {} },
  contractValues: { get: [], set: () => {} },
  executorSelectedAddress: { get: "", set: () => {} },
  executorValue: { get: "", set: () => {} },
  encodedMethods: { get: {}, set: () => {} },
  modal: { get: "", set: () => {} },
  onContractAddressAdd: () => {},
  onContractAddressDelete: () => {},
})

const AdvancedABIContextProvider: React.FC<
  IAdvancedABIContextProviderProps
> = ({ children }) => {
  const [_contractAddresses, _setContractAddresses] = useState<
    [id: string, address: string][]
  >([])
  const [_contractValues, _setContractValues] = useState<string[]>([])
  const [_executorSelectedAddress, _setExecutorSelectedAddress] =
    useState<string>("")
  const [_executorexecutorValue, _setExecutorexecutorValue] =
    useState<string>("")
  const [_isModalOpen, _setModalOpen] = useState("")
  const [_encodedMethods, _setEncodedMethods] = useState<{
    [key: string]: string[]
  }>({})

  const onContractAddressChange = useCallback(
    (index: number, id: string, address: string) => {
      uuidv4()
      _setContractAddresses((prev) => {
        return replaceAt([...prev], index, [id, address])
      })
    },
    []
  )

  const onContractValuesChange = useCallback((index: number, value: string) => {
    _setContractValues((prev) => replaceAt([...prev], index, value))
  }, [])

  const onContractAddressAdd = useCallback(() => {
    _setContractAddresses((prev) => [...prev, [uuidv4(), ""]])
    _setContractValues((prev) => [...prev, "0"])
  }, [])

  const onContractAddressDelete = useCallback((index: number) => {
    _setContractAddresses((prev) => [
      ...prev.slice(0, index),
      ...prev.slice(index + 1, prev.length),
    ])
    _setContractValues((prev) => [
      ...prev.slice(0, index),
      ...prev.slice(index + 1, prev.length),
    ])
  }, [])

  const onEncodedMethodsChange = useCallback(
    (address: string, data: string[]) => {
      _setEncodedMethods((prev) => {
        return {
          ...prev,
          [address]: data,
        }
      })
    },
    []
  )

  return (
    <AdvancedABIContext.Provider
      value={{
        contractAdresses: {
          get: _contractAddresses,
          set: onContractAddressChange,
        },
        contractValues: {
          get: _contractValues,
          set: onContractValuesChange,
        },
        executorSelectedAddress: {
          get: _executorSelectedAddress,
          set: _setExecutorSelectedAddress,
        },
        executorValue: {
          get: _executorexecutorValue,
          set: _setExecutorexecutorValue,
        },
        encodedMethods: {
          get: _encodedMethods,
          set: onEncodedMethodsChange,
        },
        modal: {
          get: _isModalOpen,
          set: _setModalOpen,
        },
        onContractAddressDelete,
        onContractAddressAdd,
      }}
    >
      {children}
    </AdvancedABIContext.Provider>
  )
}

export default AdvancedABIContextProvider
