import { AxiosInstance } from "axios"
import Moralis from "./Moralis"

interface ERC721Metadata {
  id: string
  hash?: string | null
  uri?: string | null
}

// represents nft api boilerplate
interface NftAPI {
  readonly api: AxiosInstance

  // @returns an array of NFT collection tokenIds for the given wallet
  getNftsByWallet: (
    account: string,
    chainId: number,
    contractAddress: string
  ) => Promise<number[]>

  // @returns an array of NFT metadata for the given NFT collection contract
  getNftsMetadataByContract: (
    chainId: number,
    contractAddress: string
  ) => Promise<ERC721Metadata[]>
}

export { Moralis }

export default NftAPI
