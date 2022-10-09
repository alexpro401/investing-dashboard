export enum SupportedChainId {
  BINANCE_SMART_CHAIN = 56,
  BINANCE_SMART_CHAIN_TESTNET = 97,
}

export const FAST_INTERVAL = 10000
export const SLOW_INTERVAL = 60000

export const ChainMainToken = {
  [SupportedChainId.BINANCE_SMART_CHAIN]:
    "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  [SupportedChainId.BINANCE_SMART_CHAIN_TESTNET]:
    "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
}

export const ChainNameById = {
  [SupportedChainId.BINANCE_SMART_CHAIN]: "BNB",
  [SupportedChainId.BINANCE_SMART_CHAIN_TESTNET]: "BNB",
}
