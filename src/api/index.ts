import { BscScanGasPrice } from "./gas-price"
import { Moralis } from "./nft"
import { Kattana } from "./token"
import { BscScanContract } from "./contract"

export * from "./useAPI"

const api = {
  nft: {
    Moralis: new Moralis(),
  },
  token: {
    Kattana: new Kattana(),
  },
  gasPrice: {
    BscScan: new BscScanGasPrice(),
  },
  contract: {
    BscScan: new BscScanContract(),
  },
}

export default api
