// interfaces for api's like bscscan, etherscan, etc

export interface GasPriceResponse {
  LastBlock: string
  SafeGasPrice: string
  ProposeGasPrice: string
  FastGasPrice: string
  UsdPrice: string
}
