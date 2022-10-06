import { get, isEmpty, isEqual, isObject, set, cloneDeep } from "lodash"
import { useCallback, useEffect, useMemo, useState } from "react"

type FormSchema = Record<string, unknown>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Validator = (...params: any[]) => {
  isValid: boolean
  message: string
}

type ValidationErrors = Record<
  string,
  {
    message: string
  }
>

type ValidationFieldState = {
  isInvalid: boolean
  isDirty: boolean
  isError: boolean
  errors: ValidationErrors
}

type ValidationState = Record<keyof FormSchema, ValidationFieldState>

interface ValidatorOptions {
  [key: string]: Validator | ValidatorOptions
}

type ValidationRules = Record<keyof FormSchema, ValidatorOptions>

function _generateDefaultFieldState(fieldKey: string | number, field: unknown) {
  const defaultFlags = {
    isInvalid: false,
    isDirty: false,
    isError: false,
    errors: {},
  }

  if (!isObject(field)) {
    return {
      [fieldKey]: defaultFlags,
    }
  } else if (Array.isArray(field)) {
    return {
      [fieldKey]: {
        ...defaultFlags,
        ...field.reduce((acc, el, index) => {
          return {
            ...acc,
            ..._generateDefaultFieldState(index, el),
          }
        }, {}),
      },
    }
  } else {
    return {
      [fieldKey]: {
        ...defaultFlags,
        ...Object.keys(field).reduce((acc, el) => {
          return {
            ...acc,
            ..._generateDefaultFieldState(el, field[el]),
          }
        }, {}),
      },
    }
  }
}

export const useFormValidation = (
  formSchema: FormSchema,
  validationRules: ValidationRules
) => {
  const validationDefaultState = useMemo(() => {
    return Object.keys(validationRules).reduce((acc, fieldName) => {
      const _validationState = _generateDefaultFieldState(
        fieldName,
        formSchema[fieldName]
      )

      return {
        ...acc,
        ..._validationState,
      }
    }, {})
  }, [formSchema, validationRules])

  const [validationState, setValidationState] = useState<ValidationState>(
    validationDefaultState
  )

  const getValidationState = useCallback((): ValidationState => {
    return Object.keys(validationRules).reduce((acc, fieldName) => {
      const fieldValidators = validationRules[fieldName]

      if (!fieldValidators || isEmpty(fieldValidators))
        throw new Error(`Field ${fieldName} has no validators`)

      const validateResult = Object.entries(fieldValidators).reduce(
        (acc, [validatorKey, validator]) => {
          const validatedField = _validateField(
            validatorKey,
            validator,
            fieldName,
            formSchema[fieldName],
            acc
          )

          return {
            ...acc,
            ...validatedField,
          }
        },
        {} as ValidationFieldState
      )

      return {
        ...acc,
        [fieldName]: validateResult,
      }
    }, {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formSchema, validationRules, validationState])

  useEffect(() => {
    setValidationState((validationState) => {
      const newState = getValidationState()

      return isEqual(validationState, newState) ? validationState : newState
    })
  }, [getValidationState, formSchema, validationState])

  const _validateField = useCallback(
    (
      validatorKey: string,
      validator: Validator | ValidatorOptions,
      fieldKey: string | number,
      fieldValue: unknown,
      accumulator: ValidationFieldState
    ): ValidationFieldState => {
      if (typeof validator == "function") {
        const { isValid, message } = validator(fieldValue)

        const cachedResult = {
          ...cloneDeep(validationState[fieldKey]),
        }

        const errors = {
          ...accumulator?.errors,
          ...(isValid
            ? {}
            : {
                [validatorKey]: {
                  message,
                },
              }),
        }

        const isInvalid = !isEmpty(errors) || false
        const isDirty = cachedResult?.isDirty || false
        const isError = (isInvalid && isDirty) || false

        return {
          ...cachedResult,
          isInvalid,
          isDirty,
          isError,
          errors,
        }
      } else if (validatorKey === "$every") {
        if (!Array.isArray(fieldValue))
          throw new Error(`${fieldKey}: is not an array`)

        return {} as ValidationFieldState
      } else if (isObject(fieldValue)) {
        return {} as ValidationFieldState
      }
      return {} as ValidationFieldState
    },
    [validationState]
  )

  const touchField = useCallback(
    (fieldPath: string): void => {
      if (!validationState[fieldPath])
        throw new Error(`Field ${fieldPath} not found`)

      setValidationState((prevState) => {
        const nextState = {
          ...prevState,
          [fieldPath]: {
            ...validationState[fieldPath],
            isDirty: true,
          },
        }

        return isEqual(prevState, nextState) ? prevState : nextState
      })
    },
    [validationState]
  )

  const isFormValid = useCallback((): boolean => {
    for (const key in validationState) {
      touchField(key)
      if (validationState[key].isInvalid) return false
    }
    return true
  }, [touchField, validationState])

  const getFieldErrorMessage = useCallback(
    (fieldPath: string) => {
      const validationField = get(validationState, fieldPath)

      if (
        !Boolean(validationField) &&
        !Object.keys(formSchema).includes(fieldPath)
      ) {
        throw new Error(`Field "${fieldPath}" not found`)
      } else if (
        validationField?.errors &&
        !Object.entries(validationField.errors)[0]
      ) {
        return ""
      }

      return (
        (validationField?.isError &&
          Object.entries(validationField?.errors)[0][1]?.message) ||
        ""
      )
    },
    [formSchema, validationState]
  )

  const isFieldValid = useCallback(
    (fieldPath: string) => {
      const validationField = get(validationState, fieldPath)

      if (!Boolean(validationField)) {
        if (Object.keys(formSchema).includes(fieldPath)) {
          return false
        } else {
          throw new Error(`Field "${fieldPath}" not found`)
        }
      }

      return !validationField.isInvalid || false
    },
    [formSchema, validationState]
  )

  return {
    isFormValid,
    getFieldErrorMessage,
    touchField,
    isFieldValid,
  }
}
