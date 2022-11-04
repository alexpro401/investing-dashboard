import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react"

interface IForm {
  duration: number
  quorum: number
}

interface IChangeVotingSettingsContext {
  initialForm: IForm
  duration: { get: number; set: Dispatch<SetStateAction<number>> }
  quorum: { get: number; set: Dispatch<SetStateAction<number>> }
}

export const ChangeVotingSettingsContext =
  createContext<IChangeVotingSettingsContext>({
    initialForm: {} as IForm,
    duration: { get: 0, set: () => {} },
    quorum: { get: 0, set: () => {} },
  })

interface IChangeVotingSettingsContextProviderProps {
  children: React.ReactNode
  initialForm: IForm
}

const ChangeVotingSettingsContextProvider: React.FC<
  IChangeVotingSettingsContextProviderProps
> = ({ children, initialForm }) => {
  const [_duration, _setDuration] = useState<number>(initialForm.duration)
  const [_quorum, _setQuorum] = useState<number>(initialForm.quorum)

  useEffect(() => {
    _setDuration(initialForm.duration)
    _setQuorum(initialForm.quorum)
  }, [initialForm])

  return (
    <ChangeVotingSettingsContext.Provider
      value={{
        initialForm,
        duration: { get: _duration, set: _setDuration },
        quorum: { get: _quorum, set: _setQuorum },
      }}
    >
      {children}
    </ChangeVotingSettingsContext.Provider>
  )
}

export default ChangeVotingSettingsContextProvider
