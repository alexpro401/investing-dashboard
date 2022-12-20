import { useCallback, useEffect, useState } from "react"
import { usePoolRegistryContract } from "contracts"

export enum POOL_TYPE {
  BASIC = "BASIC_POOL",
  INVEST = "INVEST_POOL",
  GOV = "GOV_POOL",
}

export const usePoolType = (address?: string) => {
  const [poolType, setPoolType] = useState<POOL_TYPE | undefined>()
  const traderPoolRegistry = usePoolRegistryContract()

  const isBasicPool = useCallback(async () => {
    try {
      const basic = await traderPoolRegistry!.isBasicPool(address!)
      if (basic) setPoolType(POOL_TYPE.BASIC)
    } catch {}
  }, [traderPoolRegistry, address])

  const isInvestPool = useCallback(async () => {
    try {
      const invest = await traderPoolRegistry!.isInvestPool(address!)
      if (invest) setPoolType(POOL_TYPE.INVEST)
    } catch {}
  }, [traderPoolRegistry, address])

  const isGovPool = useCallback(async () => {
    try {
      const gov = await traderPoolRegistry!.isGovPool(address!)
      if (gov) setPoolType(POOL_TYPE.GOV)
    } catch {}
  }, [traderPoolRegistry, address])

  useEffect(() => {
    if (!traderPoolRegistry || !address) return

    isBasicPool().catch(console.error)
    isInvestPool().catch(console.error)
    isGovPool().catch(console.error)
  }, [traderPoolRegistry, address, isBasicPool, isInvestPool, isGovPool])

  return poolType
}

export default usePoolType
