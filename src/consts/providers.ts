// This is the only file which should instantiate new Providers.
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { StaticJsonRpcProvider } from "@ethersproject/providers"

import { SupportedChainId } from "./chains"
import { BSC_RPC_URLS, BSC_TESTNET_RPC_URLS } from "./networks"

class AppJsonRpcProvider extends StaticJsonRpcProvider {
  constructor(urls: string[]) {
    super(urls[0])
  }
}

/**
 * These are the only JsonRpcProviders used directly by the interface.
 */
export const RPC_PROVIDERS: {
  [key in SupportedChainId]: any
} = {
  [SupportedChainId.BINANCE_SMART_CHAIN]: new AppJsonRpcProvider(BSC_RPC_URLS),
  [SupportedChainId.BINANCE_SMART_CHAIN_TESTNET]: new AppJsonRpcProvider(
    BSC_TESTNET_RPC_URLS
  ),
}
