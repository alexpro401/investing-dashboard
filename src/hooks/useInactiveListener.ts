import { useEffect } from "react"
import { useWeb3React } from "@web3-react/core"

import { injected } from "consts/connectors"

export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3React()

  useEffect(() => {
    const { ethereum } = window
    const activeProviderName = localStorage.getItem(
      "dexe.network/investing/web3-auth-method"
    )
    if (
      activeProviderName === "metamask" &&
      ethereum &&
      ethereum.on &&
      !active &&
      !error &&
      !suppress
    ) {
      const handleConnect = () => {
        console.log("Handling 'connect' event")
        activate(injected)
      }
      const handleChainChanged = (chainId: any) => {
        console.log("Handling 'chainChanged' event with payload", chainId)
        activate(injected)
      }
      const handleAccountsChanged = (accounts: any) => {
        console.log("Handling 'accountsChanged' event with payload", accounts)
        if (accounts.length > 0) {
          activate(injected)
        }
      }
      const handleNetworkChanged = (networkId: any) => {
        console.log("Handling 'networkChanged' event with payload", networkId)
        activate(injected)
      }

      ethereum.on("connect", handleConnect)
      ethereum.on("chainChanged", handleChainChanged)
      ethereum.on("accountsChanged", handleAccountsChanged)
      ethereum.on("networkChanged", handleNetworkChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("connect", handleConnect)
          ethereum.removeListener("chainChanged", handleChainChanged)
          ethereum.removeListener("accountsChanged", handleAccountsChanged)
          ethereum.removeListener("networkChanged", handleNetworkChanged)
        }
      }
    }

    return () => {}
  }, [active, error, suppress, activate])
}
