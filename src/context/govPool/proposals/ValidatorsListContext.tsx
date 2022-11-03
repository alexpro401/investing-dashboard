import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react"

interface IInitialForm {
  validatorTokenSymbol: string | null
  validators: string[]
  balances: string[]
}

interface IValidatorsListContext {
  validatorTokenSymbol: string | null
  validators: string[]
  balances: string[]
  hiddenIdxs: number[]
  initialForm: IInitialForm
  handleAddValidator: () => void
  handleDeleteValidator: (idx: number) => void
  handleChangeValidator: (value: string, idx: number) => void
  handleHideValidator: (idx: number) => void
  handleRestoreValidator: (idx: number) => void
  handleChangeBalance: (value: string, idx: number) => void
  handleRestoreToDefault: () => void
}

export const ValidatorsListContext = createContext<IValidatorsListContext>({
  validatorTokenSymbol: null,
  validators: [],
  balances: [],
  hiddenIdxs: [],
  initialForm: {} as IInitialForm,
  handleAddValidator: () => {},
  handleDeleteValidator: () => {},
  handleChangeValidator: () => {},
  handleHideValidator: () => {},
  handleRestoreValidator: () => {},
  handleChangeBalance: () => {},
  handleRestoreToDefault: () => {},
})

interface IValidatorsListContextProviderProps {
  children: React.ReactNode
  initialForm: IInitialForm
}

const ValidatorsListContextProvider: React.FC<
  IValidatorsListContextProviderProps
> = ({ children, initialForm }) => {
  const _validatorTokenSymbol = useMemo(
    () => initialForm.validatorTokenSymbol,
    [initialForm]
  )

  const [_validators, _setValidators] = useState<string[]>(
    initialForm.validators
  )
  const [_balances, _setBalances] = useState<string[]>(initialForm.balances)
  const [_hiddenIdxs, _setHiddenIdxs] = useState<number[]>([])

  useEffect(() => {
    _setValidators(initialForm.validators)
    _setBalances(initialForm.balances)
    _setHiddenIdxs([])
  }, [initialForm])

  const handleAddValidator = useCallback(() => {
    if (_validators[0] !== "") {
      _setValidators((prevValidators) => {
        const newValidators = [...prevValidators]
        newValidators.unshift("")

        return newValidators
      })
      _setBalances((prevBalances) => {
        const newBalances = [...prevBalances]
        newBalances.unshift("")

        return newBalances
      })
      _setHiddenIdxs((prevHiddenIndexes) => {
        const newHiddenIndexes = [...prevHiddenIndexes].map((el) => el + 1)

        return newHiddenIndexes
      })
    }
  }, [_validators, _setValidators, _setBalances])

  const handleDeleteValidator = useCallback(
    (idx: number) => {
      _setValidators((prevValidators) => {
        const newValidators = [...prevValidators].filter(
          (el, index) => index !== idx
        )

        return newValidators
      })
      _setBalances((prevBalances) => {
        const newBalances = [...prevBalances].filter(
          (el, index) => index !== idx
        )

        return newBalances
      })
      _setHiddenIdxs((prevHiddenIndexes) => {
        const newHiddenIndexes = [...prevHiddenIndexes]
          .filter((el) => el !== idx)
          .map((el) => (el > idx ? el - 1 : el))

        return newHiddenIndexes
      })
    },
    [_setValidators, _setBalances]
  )

  const handleChangeValidator = useCallback(
    (value: string, idx: number) => {
      _setValidators((prevValidators) => {
        const newValidators = [...prevValidators]
        newValidators[idx] = value

        return newValidators
      })
    },
    [_setValidators]
  )

  const handleChangeBalance = useCallback(
    (value: string, idx: number) => {
      _setBalances((prevBalances) => {
        const newBalances = [...prevBalances]
        newBalances[idx] = value

        return newBalances
      })
    },
    [_setBalances]
  )

  const handleHideValidator = useCallback(
    (idx: number) => {
      _setHiddenIdxs((prevHiddenIdxs) => {
        const newHiddenBalances = [...prevHiddenIdxs]
        if (newHiddenBalances.includes(idx)) {
          return prevHiddenIdxs
        } else {
          newHiddenBalances.push(idx)
        }

        return newHiddenBalances
      })
    },
    [_setHiddenIdxs]
  )

  const handleRestoreValidator = useCallback(
    (idx: number) => {
      _setHiddenIdxs((prevHiddenIdxs) => {
        let newHiddenBalances = [...prevHiddenIdxs]

        if (!newHiddenBalances.includes(idx)) {
          return prevHiddenIdxs
        }

        newHiddenBalances = newHiddenBalances.filter((el) => el !== idx)

        return newHiddenBalances
      })
    },
    [_setHiddenIdxs]
  )

  const handleRestoreToDefault = useCallback(() => {
    _setValidators(initialForm.validators)
    _setBalances(initialForm.balances)
    _setHiddenIdxs([])
  }, [initialForm])

  return (
    <ValidatorsListContext.Provider
      value={{
        validatorTokenSymbol: _validatorTokenSymbol,
        validators: _validators,
        balances: _balances,
        hiddenIdxs: _hiddenIdxs,
        initialForm,
        handleAddValidator,
        handleDeleteValidator,
        handleChangeValidator,
        handleHideValidator,
        handleRestoreValidator,
        handleChangeBalance,
        handleRestoreToDefault,
      }}
    >
      {children}
    </ValidatorsListContext.Provider>
  )
}

export default ValidatorsListContextProvider
