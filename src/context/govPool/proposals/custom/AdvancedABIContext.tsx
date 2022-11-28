import React, { useState, createContext, useCallback } from "react"

interface IAdvancedABIContext {
  contractAdresses: {
    get: string[]
    set: (index: number, value: string) => void
  }
  onContractAddressDelete: (index: number) => void
  modal: {
    get: boolean
    set: (value: boolean) => void
  }
}

interface IAdvancedABIContextProviderProps {
  children: React.ReactNode
}

export const AdvancedABIContext = createContext<IAdvancedABIContext>({
  contractAdresses: { get: [], set: () => {} },
  onContractAddressDelete: () => {},
  modal: { get: false, set: () => {} },
})

const AdvancedABIContextProvider: React.FC<
  IAdvancedABIContextProviderProps
> = ({ children }) => {
  const [_contractAddresses, _setContractAddresses] = useState<string[]>([""])
  const [_isModalOpen, _setModalOpen] = useState(false)

  const onContractAddressChange = useCallback(
    (index: number, value: string) => {
      _setContractAddresses((prev) => {
        return [...prev.slice(0, index), value, ...prev.slice(index + 1)]
      })
    },
    []
  )

  const onContractAddressDelete = useCallback((index: number) => {
    _setContractAddresses((prev) => {
      const newContractAddresses = [...prev]
      newContractAddresses.splice(index, 1)
      return newContractAddresses
    })
  }, [])

  return (
    <AdvancedABIContext.Provider
      value={{
        contractAdresses: {
          get: _contractAddresses,
          set: onContractAddressChange,
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
