import { InjectedConnector } from "@web3-react/injected-connector"
import { NetworkConnector } from "@web3-react/network-connector"
import { WalletConnectConnector } from "@web3-react/walletconnect-connector"

import metamaskIcon from "assets/wallets/metamask.svg"
import walletconnectIcon from "assets/wallets/walletconnect.svg"

const BSC_NETWORK_URL = "https://bsc-dataseed.binance.org/"
const BSC_TESTNET_URL = "https://data-seed-prebsc-1-s1.binance.org:8545"

const SUPPORTED_CHAINS = [97]

const POLLING_INTERVAL = 12000
export const RPC_URLS = {
  56: BSC_NETWORK_URL,
  97: BSC_TESTNET_URL,
}

export const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAINS,
})

export const network = new NetworkConnector({
  urls: RPC_URLS,
  defaultChainId: 97,
})

export const walletconnect = new WalletConnectConnector({
  rpc: RPC_URLS,
  infuraId: process.env.REACT_APP_INFURA_ID,
  bridge: "https://bridge.walletconnect.org",
  supportedChainIds: SUPPORTED_CHAINS,
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
})

export const connectorsByName = {
  injected,
  walletconnect,
  network,
}

export const connectorsIcons = {
  injected: metamaskIcon,
  walletconnect: walletconnectIcon,
}
