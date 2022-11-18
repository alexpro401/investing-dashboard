import axios, { AxiosInstance } from "axios"

import { ITreasuryTokensList } from "./types"

interface ITreasury {
  readonly api: AxiosInstance

  getGovPoolTreasuryTokensList: (
    chainId: number,
    govPoolAddress: string
  ) => Promise<any | undefined>
}

class TreasuryAPI implements ITreasury {
  readonly api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: "https://api-staging.kattana.trade",
      headers: {
        accept: "application/json",
        "X-API-Key": process.env.REACT_APP_MORALIS_API_KEY,
      },
    })
  }

  getGovPoolTreasuryTokensList = async (
    chainId: number,
    govPoolAddress: string
  ) => {
    try {
      const result = await this.api.get<ITreasuryTokensList>(
        `/balances/${chainId}/${govPoolAddress}`
      )

      return result
    } catch (error) {
      console.log(error)
      return
    }
  }
}

export default TreasuryAPI
