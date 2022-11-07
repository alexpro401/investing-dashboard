import axios, { AxiosInstance } from "axios"
import NftAPI from "api/nft"

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

const moralisNetworkByChainId = {
  1: "eth",
  56: "bsc",
  97: "bsc testnet",
}

class MoralisNftAPI implements NftAPI {
  readonly api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: "https://deep-index.moralis.io/api/v2",
      headers: {
        accept: "application/json",
        "X-API-Key": process.env.REACT_APP_MORALIS_API_KEY,
      },
    })
  }

  // https://docs.moralis.io/reference/getwalletnfts
  getNftsByWallet = async (
    account: string,
    chainId: number,
    contractAddress: string
  ) => {
    const result = await this.api.get<
      MoralisAPIResponse<GetNftsByWalletResponse[]>
    >(`/${account}/nft`, {
      params: {
        chain: moralisNetworkByChainId[chainId],
        format: "decimal",
        token_addresses: contractAddress,
      },
    })

    return result.data.result.map((nft) => nft.token_id)
  }

  // https://docs.moralis.io/reference/getcontractnfts
  getNftsMetadataByContract = async (
    chainId: number,
    contractAddress: string
  ) => {
    const result = await this.api.get<
      MoralisAPIResponse<GetNftsByContractResponse[]>
    >(`/nft/${contractAddress}`, {
      params: {
        chain: moralisNetworkByChainId[chainId],
        format: "decimal",
        token_addresses: contractAddress,
      },
    })

    return result.data.result.map((nft) => ({
      id: nft.token_id,
      hash: nft.token_hash,
      uri: nft.token_uri,
    }))
  }
}

export default MoralisNftAPI
