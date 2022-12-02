import React, { useState, createContext, Dispatch, SetStateAction } from "react"

interface ISuccessModalState {
  opened: boolean
  image: React.ReactNode
  title: string
  text: string
  buttonText: string
  onClick: () => void
}

const initialSuccessModalState = {
  opened: false,
  image: null,
  title: "",
  text: "",
  buttonText: "",
  onClick: () => {},
}

interface IGovProposalCreatingContext {
  proposalTypeName: { get: string; set: Dispatch<SetStateAction<string>> }
  proposalTypeDescription: {
    get: string
    set: Dispatch<SetStateAction<string>>
  }
  proposalName: { get: string; set: Dispatch<SetStateAction<string>> }
  proposalDescription: { get: string; set: Dispatch<SetStateAction<string>> }

  successModalState: ISuccessModalState
  setSuccessModalState: Dispatch<SetStateAction<ISuccessModalState>>
  closeSuccessModalState: () => void
}

interface IGovProposalCreatingContextProviderProps {
  children: React.ReactNode
  isCreatingCustomProposal?: boolean
}

export const GovProposalCreatingContext =
  createContext<IGovProposalCreatingContext>({
    proposalTypeName: { get: "", set: () => {} },
    proposalTypeDescription: { get: "", set: () => {} },
    proposalName: { get: "", set: () => {} },
    proposalDescription: { get: "", set: () => {} },

    successModalState: initialSuccessModalState,
    setSuccessModalState: () => {},
    closeSuccessModalState: () => {},
  })

const GovProposalCreatingContextProvider: React.FC<
  IGovProposalCreatingContextProviderProps
> = ({ children }) => {
  const [_proposalTypeName, _setProposalTypeName] = useState<string>("")
  const [_proposalTypeDescritpion, _setProposalTypeDescritpion] =
    useState<string>("")
  const [_proposalName, _setProposalName] = useState<string>("")
  const [_proposalDescription, _setProposalDescription] = useState<string>("")

  const [_successModalState, _setSuccessModalState] =
    useState<ISuccessModalState>(initialSuccessModalState)

  return (
    <GovProposalCreatingContext.Provider
      value={{
        proposalTypeName: { get: _proposalTypeName, set: _setProposalTypeName },
        proposalTypeDescription: {
          get: _proposalTypeDescritpion,
          set: _setProposalTypeDescritpion,
        },
        proposalName: { get: _proposalName, set: _setProposalName },
        proposalDescription: {
          get: _proposalDescription,
          set: _setProposalDescription,
        },
        successModalState: _successModalState,
        setSuccessModalState: _setSuccessModalState,
        closeSuccessModalState: () =>
          _setSuccessModalState(initialSuccessModalState),
      }}
    >
      {children}
    </GovProposalCreatingContext.Provider>
  )
}

export default GovProposalCreatingContextProvider
