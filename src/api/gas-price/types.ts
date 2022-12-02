export const REFETCH_INTERVAL = 60 * 1 * 1000 // 1 minute

export interface GasPriceResponse {
  LastBlock: string
  SafeGasPrice: string
  ProposeGasPrice: string
  FastGasPrice: string
  UsdPrice: string
}
