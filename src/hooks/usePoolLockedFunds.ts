import { useEffect, useMemo, useState } from "react"
import { BigNumber, FixedNumber } from "@ethersproject/bignumber"
import { parseEther } from "@ethersproject/units"
import { usePoolContract, usePoolQuery } from "hooks/usePool"
import { subtractBignumbers } from "utils/formulas"
import { normalizeBigNumber } from "utils"
import { useERC20 } from "./useContract"

function usePoolLockedFunds(poolAddress: string | undefined) {
  const [poolData] = usePoolQuery(poolAddress)
  const [, poolInfo] = usePoolContract(poolAddress)
  const [, baseToken] = useERC20(poolData?.baseToken)

  console.groupCollapsed("usePoolLockedFunds")
  console.log("poolInfo", poolInfo)

  const baseSymbol = useMemo(() => {
    if (!baseToken || !baseToken.symbol) return ""

    return baseToken.symbol
  }, [baseToken])

  const traderFundsUSD = useMemo(() => {
    if (!poolInfo) return "0.00"

    return normalizeBigNumber(poolInfo.traderBase, 18, 2)
  }, [poolInfo])

  const traderFundsBase = useMemo(() => {
    if (!poolInfo) return "0.00"

    return normalizeBigNumber(poolInfo.traderUSD, 18, 6)
  }, [poolInfo])

  const investorsFundsUSD = useMemo(() => {
    if (!poolInfo) return "0.00"

    const { totalPoolUSD, traderUSD } = poolInfo
    const res = subtractBignumbers([totalPoolUSD, 18], [traderUSD, 18])
    return normalizeBigNumber(res, 18, 2)
  }, [poolInfo])

  const investorsFundsBase = useMemo(() => {
    if (!poolInfo) return "0.00"

    const { totalPoolBase, traderBase } = poolInfo
    const res = subtractBignumbers([totalPoolBase, 18], [traderBase, 18])
    return normalizeBigNumber(res, 18, 6)
  }, [poolInfo])

  const poolUsedInPositionsUSD = useMemo(() => {
    if (!poolInfo || poolInfo.openPositions.length === 0) {
      return { big: BigNumber.from(0), format: "0.00" }
    }

    return { big: BigNumber.from(0), format: "0.00" }
  }, [poolInfo])

  const totalPoolUSD = useMemo(() => {
    if (!poolInfo) return "0.00"

    return normalizeBigNumber(poolInfo.totalPoolUSD, 18, 2)
  }, [poolInfo])

  const poolUsedToTotalPercentage = useMemo(() => {
    if (!poolInfo || poolInfo.openPositions.length === 0) {
      return 0
    }

    return 0
  }, [poolInfo])

  const values = {
    baseSymbol,
    totalPoolUSD,
    traderFundsUSD,
    traderFundsBase,
    investorsFundsUSD,
    investorsFundsBase,
    poolUsedInPositionsUSD,
    poolUsedToTotalPercentage,
  }

  console.log("values", values)
  console.groupEnd()

  return [values]
}

export default usePoolLockedFunds
