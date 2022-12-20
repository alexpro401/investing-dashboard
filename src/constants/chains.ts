export enum SupportedChainId {
  BINANCE_SMART_CHAIN = 56,
  BINANCE_SMART_CHAIN_TESTNET = 97,
}

export const SUPPORTED_CHAINS = [97]

export const FAST_INTERVAL = 10000
export const SLOW_INTERVAL = 60000

export const ChainMainToken = {
  [SupportedChainId.BINANCE_SMART_CHAIN]:
    "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  [SupportedChainId.BINANCE_SMART_CHAIN_TESTNET]:
    "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
}

export const ChainMainTokenData = {
  [SupportedChainId.BINANCE_SMART_CHAIN]: {
    address: process.env.REACT_APP_MAIN_ASSET_ADDRESS,
    name: "Binance Smart Chain",
    symbol: "BNB",
    decimals: 18,
  },
  [SupportedChainId.BINANCE_SMART_CHAIN_TESTNET]: {
    address: process.env.REACT_APP_MAIN_ASSET_ADDRESS,
    name: "Binance Smart Chain Testnet",
    symbol: "BNBt",
    decimals: 18,
  },
}
