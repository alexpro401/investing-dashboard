import { isEqual } from "lodash"
import axios, { AxiosInstance, AxiosRequestConfig } from "axios"
import NftAPI from "api/nft"
import { differenceInMilliseconds } from "date-fns/esm"
import * as NftTypes from "./types"

class MoralisNftAPI implements NftAPI {
  readonly api: AxiosInstance
  cache = {}

  constructor() {
    this.initCache()

    this.api = axios.create({
      baseURL: "https://deep-index.moralis.io/api/v2",
      headers: {
        accept: "application/json",
        "X-API-Key": process.env.REACT_APP_MORALIS_API_KEY,
      },
    })
  }

  initCache = () => {
    try {
      const dataString = localStorage.getItem("api-cache-moralis")
      if (!dataString) return

      const data = JSON.parse(dataString)
      this.cache = data || {}
    } catch {
      this.cache = {}
    }
  }

  // additional functionality to cache API responses, wraps the axios get request
  fetch = async <T>(url: string, params: AxiosRequestConfig): Promise<T> => {
    const isKeyExists = url in this.cache
    const isParamsEqual = isKeyExists && isEqual(this.cache[url].params, params)
    const isDataFresh =
      isParamsEqual &&
      differenceInMilliseconds(
        new Date(),
        new Date(this.cache[url].timestamp)
      ) < NftTypes.REFETCH_INTERVAL

    if (isDataFresh) {
      return Promise.resolve(this.cache[url].data)
    }

    const response = await this.api.get(url, params)

    this.cache[url] = {
      params,
      data: response.data,
      timestamp: new Date(),
    }
    localStorage.setItem("api-cache-moralis", JSON.stringify(this.cache))

    return response.data
  }

  // https://docs.moralis.io/reference/getwalletnfts
  getNftsByWallet = async (
    account: string,
    chainId: number,
    contractAddress: string
  ) => {
    const result = await this.fetch<
      NftTypes.MoralisAPIResponse<NftTypes.GetNftsByWalletResponse[]>
    >(`/${account}/nft`, {
      params: {
        chain: NftTypes.MORALIS_NETWORK_BY_CHAIN[chainId],
        format: "decimal",
        token_addresses: contractAddress,
      },
    })

    return result.result.map((nft) => Number(nft.token_id))
  }

  // https://docs.moralis.io/reference/getcontractnfts
  getNftsMetadataByContract = async (
    chainId: number,
    contractAddress: string
  ) => {
    const result = await this.fetch<
      NftTypes.MoralisAPIResponse<NftTypes.GetNftsByContractResponse[]>
    >(`/nft/${contractAddress}`, {
      params: {
        chain: NftTypes.MORALIS_NETWORK_BY_CHAIN[chainId],
        format: "decimal",
        token_addresses: contractAddress,
      },
    })

    return result.result.map((nft) => ({
      id: nft.token_id,
      hash: nft.token_hash,
      uri: nft.token_uri,
    }))
  }
}

export default MoralisNftAPI
