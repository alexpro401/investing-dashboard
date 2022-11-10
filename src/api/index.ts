import { Moralis } from "./nft"

export * from "./useAPI"

const api = {
  nft: {
    Moralis: new Moralis(),
  },
}

export default api
