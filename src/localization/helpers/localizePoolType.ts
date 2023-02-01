import { PoolType } from "consts"
import i18n from "localization"

export const localizePoolType = (poolType?: PoolType) => {
  if (!poolType) return ""

  return {
    ALL_POOL: i18n.t("filters.pool-type.all-pool"),
    INVEST_POOL: i18n.t("filters.pool-type.invest-pool"),
    BASIC_POOL: i18n.t("filters.pool-type.basic-pool"),
  }[poolType]
}
