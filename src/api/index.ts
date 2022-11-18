import { Moralis } from "./nft"
import { TreasuryAPI } from "./kattana"

export * from "./useAPI"

const api = {
  nft: {
    Moralis: new Moralis(),
  },
  kattana: {
    Treasury: new TreasuryAPI(),
  },
}

export default api
