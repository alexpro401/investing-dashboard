import { PoolType } from "consts"

export const localizePoolType = (poolType?: PoolType) => {
  if (!poolType) return ""

  return {
    ALL_POOL: "All Pool",
    INVEST_POOL: "Invest Pool",
    BASIC_POOL: "Basic Pool",
  }[poolType]
}
