import { createClient } from "urql"

export const graphClientAllPools = createClient({
  url: process.env.REACT_APP_ALL_POOLS_API_URL || "",
  requestPolicy: "network-only",
})

export const graphClientBasicPools = createClient({
  url: process.env.REACT_APP_BASIC_POOLS_API_URL || "",
  requestPolicy: "network-only",
})

export const graphClientInvestPools = createClient({
  url: process.env.REACT_APP_INVEST_POOLS_API_URL || "",
  requestPolicy: "network-only",
})

export const graphClientInvestors = createClient({
  url: process.env.REACT_APP_INVESTORS_API_URL || "",
  requestPolicy: "network-only",
})

export const graphClientInteractions = createClient({
  url: process.env.REACT_APP_INTERACTIONS_API_URL || "",
  requestPolicy: "network-only",
})

export const graphClientDaoValidators = createClient({
  url: process.env.REACT_APP_DAO_VALIDATORS_API_URL || "",
  requestPolicy: "network-only",
})

export const graphClientDaoPools = createClient({
  url: process.env.REACT_APP_DAO_POOLS_API_URL || "",
  requestPolicy: "network-only",
})
