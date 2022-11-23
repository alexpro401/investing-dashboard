import {
  ITokenHistoricalPrices,
  ITokenScore,
  ITreasuryTokensList,
} from "./types"
import { AxiosInstance } from "axios"
import Kattana from "./Kattana"

// represents nft api boilerplate
interface TokenAPI {
  readonly api: AxiosInstance

  // @returns an array of wallet tokens balances
  getWalletBalances: (
    chainId: number,
    govPoolAddress: string
  ) => Promise<ITreasuryTokensList>

  // @returns historical prices of token with specific period
  getHistoricalPrices: (
    token: string,
    dates: number[]
  ) => Promise<ITokenHistoricalPrices>

  // @returns token score statistic data
  getTokenScore: (chainId: number, token: string) => Promise<ITokenScore>
}

export { Kattana }

export default TokenAPI
