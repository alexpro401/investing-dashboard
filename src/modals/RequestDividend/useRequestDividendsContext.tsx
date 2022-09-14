import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import RequestDividend from "modals/RequestDividend"

export interface IRequestDividendsContext {
  isOpen: boolean
  requestDividends: (address: string, id: string) => void
  onRequestDividendsClose: () => void
}

export interface IRequestDividendsParams {
  poolAddress: string
  proposalId: string
}

function useRequestDividendsModal(): [
  IRequestDividendsContext,
  IRequestDividendsParams | undefined
] {
  const [isOpen, setIsOpen] = useState(false)
  const [poolAddress, setPoolAddress] = useState<string | undefined>()
  const [proposalId, setProposalId] = useState<string | undefined>()
  const requestDividends = useCallback((address: string, id: string) => {
    setIsOpen(true)
    setPoolAddress(address)
    setProposalId(id)
  }, [])

  const onRequestDividendsClose = useCallback(() => {
    setIsOpen(false)
    setPoolAddress(undefined)
    setProposalId(undefined)
  }, [])

  const params = useMemo<IRequestDividendsParams | undefined>(() => {
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
      requestDividends,
      onRequestDividendsClose,
    },
    params,
  ]
}

const defaultContext = {
  isOpen: false,
  requestDividends: (address: string, id: string) => {},
  onRequestDividendsClose: () => {},
}

const RequestDividendsContext =
  createContext<IRequestDividendsContext>(defaultContext)

export function RequestDividendsProvider({ children }) {
  const [modal, params] = useRequestDividendsModal()
  return (
    <RequestDividendsContext.Provider value={modal}>
      {params && (
        <RequestDividend
          params={params}
          isOpen={modal.isOpen}
          onClose={modal.onRequestDividendsClose}
        />
      )}
      {children}
    </RequestDividendsContext.Provider>
  )
}

export default function useRequestDividendsContext() {
  return useContext(RequestDividendsContext)
}
