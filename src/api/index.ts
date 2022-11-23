import { Moralis } from "./nft"
import { Kattana } from "./token"

export * from "./useAPI"

const api = {
  nft: {
    Moralis: new Moralis(),
  },
  token: {
    Kattana: new Kattana(),
  },
}

export default api
