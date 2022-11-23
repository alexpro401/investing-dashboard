import { FAST_INTERVAL, SUPPORTED_CHAINS } from "constants/chains"
import { BSC_RPC_URLS, BSC_TESTNET_RPC_URLS } from "./networks"
import { InjectedConnector } from "@web3-react/injected-connector"
import { NetworkConnector } from "@web3-react/network-connector"
import { WalletConnectConnector } from "@web3-react/walletconnect-connector"

import metamaskIcon from "assets/wallets/metamask.svg"
import walletconnectIcon from "assets/wallets/walletconnect.svg"

export const RPC_URLS = {
  56: BSC_RPC_URLS[0],
  97: BSC_TESTNET_RPC_URLS[0],
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
  pollingInterval: FAST_INTERVAL,
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
