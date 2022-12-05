import { isEqual } from "lodash"
import axios, { AxiosInstance, AxiosRequestConfig } from "axios"
import { differenceInMilliseconds } from "date-fns/esm"
import TokenAPI from "."
import {
  ChainNameById,
  ITokenHistoricalPrices,
  ITokenScore,
  ITreasuryTokensList,
  REFETCH_INTERVAL,
} from "./types"

class KattanaTokenAPI implements TokenAPI {
  readonly api: AxiosInstance
  cache = {}

  constructor() {
    this.initCache()

    this.api = axios.create({
      baseURL: "https://api-staging.kattana.trade",
      headers: {
        accept: "application/json",
      },
    })
  }

  initCache = () => {
    try {
      const dataString = localStorage.getItem("api-cache-kattana")
      if (!dataString) return

      const data = JSON.parse(dataString)
      this.cache = data || {}
    } catch {
      this.cache = {}
    }
  }

  // additional functionality to cache API responses, wraps the axios get request
  fetch = async <T>(url: string, params?: AxiosRequestConfig): Promise<T> => {
    const isKeyExists = url in this.cache
    const isParamsEqual = isKeyExists && isEqual(this.cache[url].params, params)
    const isDataFresh =
      isParamsEqual &&
      differenceInMilliseconds(
        new Date(),
        new Date(this.cache[url].timestamp)
      ) < REFETCH_INTERVAL

    if (isDataFresh) {
      return Promise.resolve(this.cache[url].data)
    }

    const response = await this.api.get(url, params)

    this.cache[url] = {
      params,
      data: response.data,
      timestamp: new Date(),
    }
    localStorage.setItem("api-cache-kattana", JSON.stringify(this.cache))

    return response.data
  }

  getWalletBalances = async (chainId: number, govPoolAddress: string) => {
    return await this.fetch<ITreasuryTokensList>(
      `/balances/${chainId}/${govPoolAddress}`
    )
  }

  getHistoricalPrices = async (token: string, dates: number[]) => {
    const creationTime = dates.reduce((memo, date) => {
      return (memo += memo.length ? `,${date}` : `${date}`)
    }, "")

    return await this.fetch<ITokenHistoricalPrices>(
      `/historical_price/${token}/${creationTime}`
    )
  }

  getTokenScore = async (chainId: number, token: string) => {
    return await this.fetch<ITokenScore>(
      `/tokens/${ChainNameById[chainId]}/${token}/score`
    )
  }
}

export default KattanaTokenAPI
