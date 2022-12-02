import { AxiosInstance } from "axios"
import BscScanGasPrice from "./BscScan"

interface GasPriceAPI {
  readonly api: AxiosInstance

  // @returns current gas price
  getGasPrice: () => Promise<any>
}

export { BscScanGasPrice }

export default GasPriceAPI
