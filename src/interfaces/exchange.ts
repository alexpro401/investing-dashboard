import { ReactNode } from "react"
import { TokenData } from "constants/types"
import { BigNumber } from "@ethersproject/bignumber"

/// @notice The enum of exchange types
/// @param FROM_EXACT the type corresponding to the exchangeFromExact function
/// @param TO_EXACT the type corresponding to the exchangeToExact function
export enum ExchangeType {
  FROM_EXACT,
  TO_EXACT,
}

interface FormElement {
  address: string | undefined
  amount: string
  balance: BigNumber
  symbol?: string
  decimals?: number
  icon?: ReactNode
  price: BigNumber
}

export interface RiskyInvestInfo {
  stakeLimit: BigNumber | undefined
  tokens: {
    base: TokenData | null
    position: TokenData | null
  }
  amounts: BigNumber[]
  avgBuyingPrice: BigNumber
  avgSellingPrice: BigNumber
  positionPnl: BigNumber
  investorPnlLP: BigNumber
  investorPnlUSD: BigNumber
}

export interface RiskyForm {
  from: FormElement
  to: FormElement
}

export interface ExchangeForm {
  from: FormElement
  to: FormElement
}
