import { get, isEmpty, isEqual, isObject, cloneDeep } from "lodash"
import { useCallback, useEffect, useMemo, useState } from "react"
import { minLength, required } from "../utils/validators"

type FormSchema = Record<string, unknown>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Validator = (...params: any[]) => {
  isValid: boolean
  message: string
}

interface ValidatorOptions {
  [key: string]: Validator | ValidatorOptions
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
    /**
     * someComplexObject: {
     *   required,
     *   fullName: {
     *     required,
     *     firstName: { required },
     *     lastName: {
     *       ancestor: { required },
     *       default: { required, minLength: minLength(6) },
     *     },
     *   },
     * }
     */
    return Object.keys(validationRules).reduce((acc, fieldName) => {
      const fieldValidators = validationRules[fieldName]

      if (!fieldValidators || isEmpty(fieldValidators))
        throw new Error(`Field ${fieldName} has no validators`)

      /**
       * required,
       * fullName: {
       *   required,
       *   firstName: { required },
       *   lastName: {
       *     ancestor: { required },
       *     default: { required, minLength: minLength(6) },
       *   },
       * }
       */
      const validateResult = Object.entries(fieldValidators).reduce(
        (acc, [validatorKey, validator]) => {
          const cachedResult =
            typeof validator === "function"
              ? {
                  ...cloneDeep(validationState[fieldName]),
                }
              : {
                  ...cloneDeep(get(validationState[fieldName], validatorKey)),
                }

          const fieldKey =
            typeof validator === "function" ? fieldName : validatorKey

          const fieldValue =
            typeof validator === "function"
              ? formSchema[fieldName]
              : get(formSchema[fieldName], validatorKey)

          const accumulator =
            typeof validator === "function" ? acc : acc[fieldKey]

          const validatedField = _validateField(
            validatorKey,
            validator,
            fieldKey,
            fieldValue,
            accumulator,
            cachedResult
          )

          console.log("validatedField", validatedField)

          /**
           * Don't return there fieldName as key,
           * this reduce must return {@link ValidationFieldState}
           * for current (top) level field, and if we'll get an object as validator
           * we must return it's validatorKey with {@link ValidationFieldState}
           */
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

  /**
   * Validate field
   * Should return:
   * if (typeof validator === "function")
   *   return {@link ValidationFieldState}
   *
   * If (isObject(validator) && isEqual(validatorKey, "$every"))
   *   return { [validatorKey]: {@link ValidationFieldState} }
   * @param validatorKey
   * @param validator
   * @param fieldName
   * @param fieldValue
   * @param validationFieldState
   */
  const _validateField = useCallback(
    (
      validatorKey: string,
      validator: Validator | ValidatorOptions,
      fieldKey: string | number,
      fieldValue: unknown,
      accumulator: ValidationFieldState,
      cachedResult: ValidationFieldState
    ):
      | ValidationFieldState
      | { [x: string | number]: ValidationFieldState } => {
      // TODO: create path for nested fields

      if (typeof validator == "function") {
        const { isValid, message } = validator(fieldValue)

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
      } else if (isObject(validator)) {
        return {
          /**
           * fullName: {
           *   yopta: "nenada",
           *   firstName: "",
           *   lastName: { ancestor: "", default: "" },
           * }
           */
          /**
           * fullName: {
           *   required,
           *   firstName: { required },
           *   lastName: {
           *     ancestor: { required },
           *     default: { required, minLength: minLength(6) },
           *   },
           * }
           */
          [validatorKey]: Object.entries(validator).reduce(
            (acc, [_validatorKey, _validatorValue]) => {
              /**
               * validatorKey: fullName,
               * validator: { required, firstName: { required }, lastName: { ancestor: { required }, default: { required, minLength: minLength(6) } } }
               * fieldKey: string | number,
               * fieldValue: unknown,
               * accumulator: ValidationFieldState,
               * cachedResult: ValidationFieldState
               */
              const _cachedResult =
                typeof _validatorValue === "function"
                  ? cachedResult
                  : cachedResult[_validatorKey]

              const _fieldKey =
                typeof _validatorValue === "function" ? fieldKey : _validatorKey

              const _fieldValue =
                typeof _validatorValue === "function"
                  ? fieldValue
                  : get(fieldValue, _validatorKey)

              const _accumulator =
                typeof _validatorValue === "function" ? acc : acc[_fieldKey]

              const validatedNestedField = _validateField(
                _validatorKey,
                _validatorValue,
                _fieldKey,
                _fieldValue,
                _accumulator,
                _cachedResult
              )

              return {
                ...acc,
                ...(typeof _validatorValue === "function" ||
                _fieldKey === _validatorKey
                  ? { ...validatedNestedField }
                  : { [_fieldKey]: validatedNestedField }),
              }
            },
            accumulator
          ),
        }
      }
      return {} as ValidationFieldState
    },
    []
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
