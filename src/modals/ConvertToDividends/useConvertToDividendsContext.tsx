import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import ConvertToDividends from "modals/ConvertToDividends"

export interface IConvertToDividendsContext {
  isOpen: boolean
  convertToDividends: (address: string, id: string) => void
  onConvertToDividendsClose: () => void
}

export interface IConvertToDividendsParams {
  poolAddress: string
  proposalId: string
}

function useConvertToDividendsModal(): [
  IConvertToDividendsContext,
  IConvertToDividendsParams | undefined
] {
  const [isOpen, setIsOpen] = useState(true)
  const [poolAddress, setPoolAddress] = useState<string | undefined>("1")
  const [proposalId, setProposalId] = useState<string | undefined>("1")

  const convertToDividends = useCallback((address: string, id: string) => {
    setIsOpen(true)
    setPoolAddress(address)
    setProposalId(id)
  }, [])

  const onConvertToDividendsClose = useCallback(() => {
    setIsOpen(false)
    setPoolAddress(undefined)
    setProposalId(undefined)
  }, [])

  const params = useMemo<IConvertToDividendsParams | undefined>(() => {
    if (!poolAddress || !proposalId) {
      return
    }

    return {
      poolAddress,
      proposalId,
    }
  }, [poolAddress, proposalId])

  return [
    {
      isOpen,
      convertToDividends,
      onConvertToDividendsClose,
    },
    params,
  ]
}

const defaultContext = {
  isOpen: false,
  convertToDividends: (address: string, id: string) => {},
  onConvertToDividendsClose: () => {},
}

const ConvertToDividendsContext =
  createContext<IConvertToDividendsContext>(defaultContext)

export function ConvertToDividendsProvider({ children }) {
  const [modal, params] = useConvertToDividendsModal()
  return (
    <ConvertToDividendsContext.Provider value={modal}>
      {params && (
        <ConvertToDividends
          params={params}
          isOpen={modal.isOpen}
          onClose={modal.onConvertToDividendsClose}
        />
      )}
      {children}
    </ConvertToDividendsContext.Provider>
  )
}

export default function useConvertToDividendsContext() {
  return useContext(ConvertToDividendsContext)
}
