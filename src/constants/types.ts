import { BigNumber } from "@ethersproject/bignumber"

export type TokenTuple = [BigNumber, number]

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

export type PoolType = "ALL_POOL" | "INVEST_POOL" | "BASIC_POOL"
