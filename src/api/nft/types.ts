// Moralis api is not supported to receive chainId with type of number,
// used here to wrap chainId to specific string
// more info here: https://docs.moralis.io/reference/nft-api
export const MORALIS_NETWORK_BY_CHAIN = {
  1: "eth",
  56: "bsc",
  97: "bsc testnet",
}

export const REFETCH_INTERVAL = 60 * 5 * 1000 // 5 minutes

// Base structure of the moralis NFT API
export interface MoralisAPIResponse<T> {
  status: string
  total: number
  page: number
  page_size: number
  cursor: string
  result: T
}

// Base structure of an NFT API endpoint
export interface NftMetadata {
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
export interface GetNftsByWalletResponse extends NftMetadata {}

// endpoint: /getcontractnfts
export interface GetNftsByContractResponse extends NftMetadata {
  updated_at?: string | null
}

export interface ERC721Metadata {
  id: string
  hash?: string | null
  uri?: string | null
}
