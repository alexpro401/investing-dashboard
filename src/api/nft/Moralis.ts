import { isEqual } from "lodash"
import axios, { AxiosInstance, AxiosRequestConfig } from "axios"
import NftAPI from "api/nft"
import { differenceInMilliseconds } from "date-fns/esm"

// Moralis api is not supported to receive chainId with type of number,
// used here to wrap chainId to specific string
// more info here: https://docs.moralis.io/reference/nft-api
const MORALIS_NETWORK_BY_CHAIN = {
  1: "eth",
  56: "bsc",
  97: "bsc testnet",
}

const MORALIS_REFETCH_INTERVAL = 60 * 5 * 1000 // 5 minutes

// Base structure of the moralis NFT API
interface MoralisAPIResponse<T> {
  status: string
  total: number
  page: number
  page_size: number
  cursor: string
  result: T
}

// Base structure of an NFT API endpoint
interface NftMetadata {
  token_address: string
  token_id: string
  owner_of?: string | null
  block_number?: string | null
  block_number_minted?: string | null
  token_hash?: string | null
  amount?: string | null
  contract_type: string
  name: string
  symbol: string
  token_uri?: string | null
  metadata?: string | null
  last_token_uri_sync?: string | null
  last_metadata_sync?: string | null
  minter_address?: string | null
}

// endpoint: /getwalletnfts
interface GetNftsByWalletResponse extends NftMetadata {}

// endpoint: /getcontractnfts
interface GetNftsByContractResponse extends NftMetadata {
  updated_at?: string | null
}

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
      const dataString = localStorage.getItem("api-cache")
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
      ) < MORALIS_REFETCH_INTERVAL

    if (isDataFresh) {
      return Promise.resolve(this.cache[url].data)
    }

    const response = await this.api.get(url, params)

    this.cache[url] = {
      params,
      data: response.data,
      timestamp: new Date(),
    }
    localStorage.setItem("api-cache", JSON.stringify(this.cache))

    return response.data
  }

  // https://docs.moralis.io/reference/getwalletnfts
  getNftsByWallet = async (
    account: string,
    chainId: number,
    contractAddress: string
  ) => {
    const result = await this.fetch<
      MoralisAPIResponse<GetNftsByWalletResponse[]>
    >(`/${account}/nft`, {
      params: {
        chain: MORALIS_NETWORK_BY_CHAIN[chainId],
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
      MoralisAPIResponse<GetNftsByContractResponse[]>
    >(`/nft/${contractAddress}`, {
      params: {
        chain: MORALIS_NETWORK_BY_CHAIN[chainId],
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
