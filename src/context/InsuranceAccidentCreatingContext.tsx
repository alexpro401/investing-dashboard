import { createContext } from "react"

export interface InsuranceAccident {
  pool: {
    get: string
    set: (value: string) => void
  }
  block: {
    get: string
    set: (value: string) => void
  }
  date: {
    get: string
    set: (value: string) => void
  }
  description: {
    get: string
    set: (value: string) => void
  }
  chat: {
    get: string
    set: (value: string) => void
  }
}

export interface InsuranceAccidentExist {
  get: boolean
  set: (value: boolean) => void
}

interface InsuranceAccidentCreatingContext {
  form: InsuranceAccident | undefined
  insuranceAccidentExist: InsuranceAccidentExist | undefined
}

export const InsuranceAccidentCreatingContext =
  createContext<InsuranceAccidentCreatingContext>({
    form: undefined,
    insuranceAccidentExist: undefined,
  })
