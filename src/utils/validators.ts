import { isBoolean, isDate, isEmpty, isNumber } from "lodash"
import { parseUnits } from "@ethersproject/units"

import { Validator } from "hooks/useFormValidation"
import {
  cutStringZeroes,
  isAddress,
  isValidUrl,
  isValidUrlFacebook,
  isValidUrlGithub,
  isValidUrlLinkedin,
  isValidUrlMedium,
  isValidUrlTelegram,
  isValidUrlTwitter,
} from "utils"

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

export const isAddressValidator: Validator = (value) => ({
  isValid: isAddress(value),
  message: "This field must be a valid address",
})

export const minLength: ValidatorFunc = (length: number) => (value) => ({
  isValid: String(value).length >= length,
  message: `This field must contain minimum ${length} symbols`,
})

export const maxLength: ValidatorFunc = (length: number) => (value) => ({
  isValid: String(value).length <= length,
  message: `This field must contain maximum ${length} symbols`,
})

export const isUrl: Validator = (value) => ({
  isValid: isValidUrl(value),
  message: "This field must be a valid URL",
})

export const validateIfExist: (cb: Validator) => Validator = (
  cb: Validator
): Validator => {
  return (value) => {
    console.log("value", value, Boolean(value))
    return {
      isValid: !!value ? cb(value).isValid : true,
      message: cb(value).message,
    }
  }
}

export const isUrlFacebook = (value: string) => ({
  isValid: isValidUrlFacebook(value),
  message: "This field must be a valid facebook URL",
})

export const isUrlLinkedin = (value: string) => ({
  isValid: isValidUrlLinkedin(value),
  message: "This field must be a valid linkedin URL",
})

export const isUrlMedium = (value: string) => ({
  isValid: isValidUrlMedium(value),
  message: "This field must be a valid medium URL",
})

export const isUrlTelegram = (value: string) => ({
  isValid: isValidUrlTelegram(value),
  message: "This field must be a valid telegram URL",
})

export const isUrlTwitter = (value: string) => ({
  isValid: isValidUrlTwitter(value),
  message: "This field must be a valid twitter URL",
})

export const isUrlGithub = (value: string) => ({
  isValid: isValidUrlGithub(value),
  message: "This field must be a valid github URL",
})

export const isPercentage: Validator = (value) => ({
  isValid: +value >= 0 && +value <= 100,
  message: "This field must be a valid percentage",
})

export const isBnLte: ValidatorFunc =
  (comparableString: string, decimals: number, message?: string) =>
  (string: string) => ({
    isValid: parseUnits(string, decimals).lte(
      parseUnits(comparableString, decimals)
    ),
    message:
      message ??
      `This field must be less than ${cutStringZeroes(comparableString)}`,
  })

export const isBnGt: ValidatorFunc =
  (comparableString: string, decimals: number, message?: string) =>
  (string: string) => ({
    isValid: parseUnits(string, decimals).gt(
      parseUnits(comparableString, decimals)
    ),
    message:
      message ??
      `This field must be greater than ${cutStringZeroes(comparableString)}`,
  })
