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
