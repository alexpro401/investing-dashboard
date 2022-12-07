import React from "react"
import { createRoot } from "react-dom/client"
import { createWeb3ReactRoot, Web3ReactProvider } from "@web3-react/core"
import { Normalize } from "styled-normalize"
import { createTheme } from "react-data-table-component"

import { Provider } from "react-redux"
import { ModalProvider } from "styled-react-modal"
import { BrowserRouter } from "react-router-dom"
import store from "state"

import App from "pages/App"
import SideBar from "components/Sidebar"
import Alert from "components/Alert"
import ToastContainer from "components/Toasts"
import Payload from "components/Payload"
import ErrorMessage from "modals/ErrorMessage"
import TermsAgreement from "modals/TermsAgreement"

import SideBarContext from "context/SideBarContext"
import AlertContext from "context/AlertContext"

import GlobalStyle from "theme/GlobalStyle"
import getLibrary from "utils/getLibrary"

import { ContractsRegistryUpdater } from "state/contracts/updater"
import { PriceFeedUpdater } from "state/pricefeed/updater"
import { UserPoolsUpdater, UserTermsUpdater } from "state/user/updater"
import { TransactionUpdater } from "state/transactions/updater"
import { GasPriceUpdater } from "state/gas/updater"
import { PoolListUpdater } from "state/pools/updater"
import MulticallUpdater from "state/multicall/updater"
import ListsUpdater from "state/lists/updater"

import { usePollBlockNumber } from "state/block/hooks"

const Web3ProviderNetwork = createWeb3ReactRoot("NETWORK")

// THEMING
createTheme("dexe", {
  text: {
    primary: "#F5F5F5",
    secondary: "#2aa198",
  },
  background: {
    default: "transparent",
  },
  divider: {
    default: "transparent",
  },
  sortFocus: {
    default: "#F5F5F5",
  },
})

const NormalizeProxy: any = Normalize

const GlobalHooks = () => {
  usePollBlockNumber()
  return null
}

const GlobalComponents = () => (
  <>
    <GlobalHooks />
    <ContractsRegistryUpdater />
    <UserPoolsUpdater />
    <UserTermsUpdater />
    <PoolListUpdater />
    <GasPriceUpdater />
    <PriceFeedUpdater />
    <TransactionUpdater />
    <NormalizeProxy />
    <GlobalStyle />
    <SideBar />
    <Alert />
    <ToastContainer />
    <TermsAgreement />
    <Payload />
    <ErrorMessage />
    <MulticallUpdater />
    <ListsUpdater />
  </>
)

const container = document.getElementById("root")
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!)
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ModalProvider>
        <SideBarContext>
          <AlertContext>
            <Web3ReactProvider getLibrary={getLibrary}>
              <Web3ProviderNetwork getLibrary={getLibrary}>
                <Provider store={store}>
                  <>
                    <GlobalComponents />
                    <App />
                  </>
                </Provider>
              </Web3ProviderNetwork>
            </Web3ReactProvider>
          </AlertContext>
        </SideBarContext>
      </ModalProvider>
    </BrowserRouter>
  </React.StrictMode>
)
