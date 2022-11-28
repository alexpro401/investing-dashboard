import { isEqual } from "lodash"
import axios, { AxiosInstance, AxiosRequestConfig } from "axios"
import { differenceInMilliseconds } from "date-fns/esm"
import GasPrice from "."
import { GasPriceResponse, REFETCH_INTERVAL } from "./types"

class BscScanGasPriceAPI implements GasPrice {
  readonly api: AxiosInstance
  cache = {}

  constructor() {
    this.initCache()

    this.api = axios.create({
      baseURL: "https://api.bscscan.com/api",
      headers: {
        accept: "application/json",
      },
      params: {
        apikey: process.env.REACT_APP_BSCSCAN_API_KEY,
      },
    })
  }

  initCache = () => {
    try {
      const dataString = localStorage.getItem("api-cache-bscscan")
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
    localStorage.setItem("api-cache-bscscan", JSON.stringify(this.cache))

    return response.data
  }

  getGasPrice = () => {
    return this.fetch<GasPriceResponse>("?module=gastracker&action=gasoracle")
  }
}

export default BscScanGasPriceAPI
