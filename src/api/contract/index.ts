import { AxiosInstance } from "axios"
import BscScanContract from "./BscScan"

interface ContractsAPI {
  readonly api: AxiosInstance

  // @returns current gas price
  getContractABI: (address: string) => Promise<any>
}

export { BscScanContract }

export default ContractsAPI
