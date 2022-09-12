export function activateInjectedProvider(
  providerName: "MetaMask" | "CoinBase"
) {
  const { ethereum } = window

  if (!ethereum?.providers) return

  let provider
  switch (providerName) {
    case "CoinBase":
      provider = ethereum.providers.find(
        ({ isCoinbaseWallet }) => isCoinbaseWallet
      )
      break
    case "MetaMask":
      provider = ethereum.providers.find(({ isMetaMask }) => isMetaMask)
      break
  }

  if (!provider) return

  try {
    ethereum.setSelectedProvider(provider)
  } catch {}
}
