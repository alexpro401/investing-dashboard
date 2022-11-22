import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit"
import { save, load, clear } from "redux-localstorage-simple"

import user from "./user/reducer"
import transactions from "./transactions/reducer"
import pools from "./pools/reducer"
import contracts from "./contracts/reducer"
import pricefeed from "./pricefeed/reducer"
import application from "./application/reducer"
import ipfsMetadata from "./ipfsMetadata/reducer"
import gas from "./gas/reducer"
import erc20 from "./erc20/reducer"
import lists from "./lists/reducer"
import multicall from "./multicall/reducer"
import { updateVersion } from "./global/actions"

const RESET_KEY = "1669150240128"

const PERSISTED_KEYS: string[] = [
  "user",
  "transactions",
  "pools",
  "ipfsMetadata",
  "gas",
  "erc20",
]

const shouldReset = () => {
  const isReseted = localStorage.getItem("redux-reset") === RESET_KEY

  if (!isReseted) {
    clear({
      namespace: process.env.REACT_APP_NAMESPACE || "DEXE",
    })
    localStorage.setItem("redux-reset", RESET_KEY)
  }
}

shouldReset()

const store = configureStore({
  reducer: {
    user,
    application,
    transactions,
    pools,
    contracts,
    pricefeed,
    ipfsMetadata,
    gas,
    erc20,
    lists,
    multicall,
  },
  middleware: [
    ...getDefaultMiddleware({ thunk: false }),
    save({
      states: PERSISTED_KEYS,
      namespace: process.env.REACT_APP_NAMESPACE || "DEXE",
    }),
  ],
  preloadedState: load({
    states: PERSISTED_KEYS,
    namespace: process.env.REACT_APP_NAMESPACE || "DEXE",
  }),
})

store.dispatch(updateVersion())

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
