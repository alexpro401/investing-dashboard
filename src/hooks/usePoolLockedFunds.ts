import { useMemo } from "react"
import { BigNumber } from "@ethersproject/bignumber"
import { usePoolContract, usePoolQuery } from "hooks/usePool"

import { normalizeBigNumber } from "utils"
import { useERC20 } from "hooks/useContract"
import { percentageOfBignumbers, subtractBignumbers } from "utils/formulas"
import useOpenPositionsPriceOutUSD from "hooks/useOpenPositionsPriceOutUSD"

function usePoolLockedFunds(poolAddress: string | undefined) {
  const [poolData] = usePoolQuery(poolAddress)
  const [, poolInfo] = usePoolContract(poolAddress)
  const [, baseToken] = useERC20(poolData?.baseToken)

  const _baseAndPositionBalances = useMemo(() => {
    if (!poolInfo) return []

    const [, ...rest] = poolInfo.baseAndPositionBalances
    return rest
  }, [poolInfo])

  const positionAmountsMap = useMemo(() => {
    if (
      !poolInfo ||
      !poolInfo.openPositions.length ||
      !_baseAndPositionBalances.length
    ) {
      return new Map<string, BigNumber>([])
    }

    return new Map<string, BigNumber>(
      poolInfo.openPositions.map((p, i) => [
        `${poolAddress}${p}${0}`.toLowerCase(),
        _baseAndPositionBalances[i],
      ])
    )
  }, [_baseAndPositionBalances, poolAddress, poolInfo])

  const lockedAmountUSD = useOpenPositionsPriceOutUSD(
    poolAddress,
    positionAmountsMap,
    poolInfo?.openPositions
  )

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
    if (!poolInfo || poolInfo.openPositions.length === 0 || !lockedAmountUSD) {
      return { big: BigNumber.from(0), format: "0.00" }
    }

    return {
      big: lockedAmountUSD,
      format: normalizeBigNumber(lockedAmountUSD, 18, 2),
    }
  }, [poolInfo, lockedAmountUSD])

  const totalPoolUSD = useMemo(() => {
    if (!poolInfo) return { big: BigNumber.from(0), format: "0.00" }

    return {
      big: poolInfo.totalPoolUSD,
      format: normalizeBigNumber(poolInfo.totalPoolUSD, 18, 2),
    }
  }, [poolInfo])

  const poolUsedToTotalPercentage = useMemo(() => {
    if (
      !poolUsedInPositionsUSD ||
      !totalPoolUSD ||
      poolUsedInPositionsUSD.big.isZero() ||
      totalPoolUSD.big.isZero()
    ) {
      return 0
    }

    const res = percentageOfBignumbers(
      poolUsedInPositionsUSD.big,
      totalPoolUSD.big
    )
    return normalizeBigNumber(res, 18, 2)
  }, [poolUsedInPositionsUSD, totalPoolUSD])

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

  return [values]
}

export default usePoolLockedFunds
