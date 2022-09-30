import { isBoolean, isDate, isEmpty, isNumber } from "lodash"

import { Validator } from "hooks/useFormValidation"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ValidatorFunc = (...params: any[]) => Validator

export const required: Validator = (value) => ({
  isValid:
    !isEmpty(value) ||
    isNumber(value) ||
    isDate(value) ||
    isBoolean(value) ||
    value instanceof File,
  message: "Please fill out this field",
})

export const minLength: ValidatorFunc = (length: number) => (value) => ({
  isValid: String(value).length >= length,
  message: `This field must contain minimum ${length} symbols`,
})

export const maxLength: ValidatorFunc = (length: number) => (value) => ({
  isValid: String(value).length <= length,
  message: `This field must contain maximum ${length} symbols`,
})
