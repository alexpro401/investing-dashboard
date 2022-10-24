declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_NAMESPACE: string
      REACT_APP_UPDATE_INTERVAL: string

      REACT_APP_INFURA_ID: string
      REACT_APP_ETHERSCAN_API_KEY: string

      REACT_APP_CONTRACTS_REGISTRY_ADDRESS: string

      REACT_APP_ALL_POOLS_API_URL: string
      REACT_APP_BASIC_POOLS_API_URL: string
      REACT_APP_INVEST_POOLS_API_URL: string
      REACT_APP_INVESTORS_API_URL: string
      REACT_APP_INTERACTIONS_API_URL: string
      REACT_APP_MAIN_ASSET_ADDRESS: string

      REACT_APP_IPFS_PROJECT_ID: string
      REACT_APP_IPFS_PROJECT_SECRET: string

      REACT_APP_PRIVACY_POLICY_HASH: string
    }
  }
}

/// <reference types="react-scripts" />

declare module "jazzicon" {
  export default function (diameter: number, seed: number): HTMLElement
}

interface Window {
  ethereum?: {
    isMetaMask?: boolean
    isCoinbaseWallet?: boolean
    on?: (...args: any[]) => void
    removeListener?: (...args: any[]) => void
    setSelectedProvider: (provider: any) => void
    providers: any[]
  }
  web3?: unknown
}

export {}
