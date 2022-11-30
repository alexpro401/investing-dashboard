import React, { useState, createContext, useCallback } from "react"
import { replaceAt } from "utils/array"

interface IAdvancedABIContext {
  contractAdresses: {
    get: string[]
    set: (index: number, value: string) => void
  }
  executorSelectedAddress: {
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
  onContractAddressDelete: (index: number) => void
}

interface IAdvancedABIContextProviderProps {
  children: React.ReactNode
}

export const AdvancedABIContext = createContext<IAdvancedABIContext>({
  contractAdresses: { get: [], set: () => {} },
  executorSelectedAddress: { get: "", set: () => {} },
  encodedMethods: { get: {}, set: () => {} },
  modal: { get: "", set: () => {} },
  onContractAddressDelete: () => {},
})

const AdvancedABIContextProvider: React.FC<
  IAdvancedABIContextProviderProps
> = ({ children }) => {
  const [_contractAddresses, _setContractAddresses] = useState<string[]>([])
  const [_executorSelectedAddress, _setExecutorSelectedAddress] =
    useState<string>("")
  const [_isModalOpen, _setModalOpen] = useState("")
  const [_encodedMethods, _setEncodedMethods] = useState<{
    [key: string]: string[]
  }>({})

  const onContractAddressChange = useCallback(
    (index: number, value: string) => {
      _setContractAddresses((prev) => {
        return replaceAt([...prev], index, value)
      })
    },
    []
  )

  const onContractAddressDelete = useCallback((index: number) => {
    _setContractAddresses((prev) => {
      return [...prev.slice(0, index), ...prev.slice(index + 1, prev.length)]
    })
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
        executorSelectedAddress: {
          get: _executorSelectedAddress,
          set: _setExecutorSelectedAddress,
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
      }}
    >
      {children}
    </AdvancedABIContext.Provider>
  )
}

export default AdvancedABIContextProvider
