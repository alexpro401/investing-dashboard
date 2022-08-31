import { BigNumber } from "@ethersproject/bignumber"

export type Token = [BigNumber, number]

export interface TokenData {
  address: string
  name: string
  symbol: string
  decimals: number
}

export enum Orientation {
  horizontal = "row",
  vertical = "column",
}

export interface IconProps {
  active?: boolean
}

export interface IValidationError {
  message: string
  field: string
}

export enum TradeType {
  EXACT_INPUT = 0,
  EXACT_OUTPUT = 1,
}

export type SwapDirection = "deposit" | "withdraw"

export enum UpdateListType {
  REMOVE = 0,
  ADD = 1,
}

export enum SubmitState {
  IDLE = 0,
  SIGN = 1,
  WAIT_CONFIRM = 2,
  SUCCESS = 3,
}
