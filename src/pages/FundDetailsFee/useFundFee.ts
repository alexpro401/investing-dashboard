import { format } from "date-fns"
import { useSelector } from "react-redux"
import { parseEther } from "@ethersproject/units"
import { useState, useMemo, useEffect } from "react"
import { BigNumber } from "@ethersproject/bignumber"

import { useActiveWeb3React } from "hooks"
import { DATE_FORMAT } from "constants/time"
import useCoreProperties from "hooks/useCoreProperties"
import useTokenPriceOutUSD from "hooks/useTokenPriceOutUSD"
import { selectDexeAddress } from "state/contracts/selectors"
import { IPoolQuery, PoolInfo } from "constants/interfaces_v2"
import { useERC20, usePriceFeedContract } from "hooks/useContract"
import { expandTimestamp, formatBigNumber, normalizeBigNumber } from "utils"
import { usePoolContract, usePoolQuery, useTraderPool } from "hooks/usePool"
import {
  addBignumbers,
  percentageOfBignumbers,
  subtractBignumbers,
  _divideBignumbers,
} from "utils/formulas"

const BIG_ZERO = BigNumber.from(0)

interface IAmount {
  big: BigNumber
  format: string
}

const defaultAmountState: IAmount = {
  big: BIG_ZERO,
  format: normalizeBigNumber(BIG_ZERO, 18, 6),
}

interface IPayload {
  fundCommissionPercentage: IAmount
  unlockDate: string

  totalFundCommissionFeeBase: string
  totalFundCommissionFeeUSD: string

  fundsUnderManagementDexe: string

  fundProfitWithoutTraderUSD: IAmount
  fundProfitWithoutTraderDEXE: string
  fundProfitWithoutTraderPercentage: string

  platformCommissionUSD: string
  platformCommissionBase: string
  platformCommissionPercentage: string

  traderCommissionUSD: string
  traderCommissionBase: string

  netInvestorsProfitUSD: IAmount
  netInvestorsProfitDEXE: string
  netInvestorsProfitPercentage: string
}

interface IMethods {
  withdrawCommission: () => void
}

function useFundFee(
  poolAddress?: string
): [[IPoolQuery | undefined, PoolInfo | null], IPayload, IMethods] {
  const { account } = useActiveWeb3React()

  const priceFeed = usePriceFeedContract()
  const coreProperties = useCoreProperties()
  const traderPool = useTraderPool(poolAddress)
  const [poolGraphData] = usePoolQuery(poolAddress)
  const [, poolInfo] = usePoolContract(poolAddress)
  const [, baseToken] = useERC20(poolGraphData?.baseToken)

  const dexeAddress = useSelector(selectDexeAddress)
  const dexePriceUSD = useTokenPriceOutUSD({ tokenAddress: dexeAddress })

  // TECHNICAL DATA (used for calculation purposes only)

  // Funds under pool management in baseToken (without trader funds)
  const _fundsUnderManagementBase = useMemo<BigNumber>(() => {
    if (!poolInfo) return BIG_ZERO

    const { totalPoolBase, traderBase } = poolInfo
    return subtractBignumbers([totalPoolBase, 18], [traderBase, 18])
  }, [poolInfo])

  // Platform commision
  const [_platformCommissionUSD, _setPlatformCommissionUSD] =
    useState<BigNumber>(BIG_ZERO)
  const [_platformCommissionPercentage, _setPlatformCommissionPercentage] =
    useState<BigNumber>(BIG_ZERO)
  const [_platformCommissionDexe, _setPlatformCommissionDexe] =
    useState<BigNumber>(BIG_ZERO)

  // Trader commissions
  const [_traderCommissionUSD, _setTraderCommissionUSD] =
    useState<BigNumber>(BIG_ZERO)

  // DATA

  // Pool commission percentage
  const fundCommissionPercentage = useMemo<IAmount>(() => {
    if (!poolInfo) return defaultAmountState
    const { commissionPercentage } = poolInfo?.parameters
    return {
      big: commissionPercentage,
      format: formatBigNumber(commissionPercentage, 25, 0),
    }
  }, [poolInfo])

  // Next commission epoch start date
  const [unlockDate, setUnlockDate] = useState<string>("")

  // Total fund commissions in basetoken
  const [totalFundCommissionFeeBase, setTotalFundCommissionFeeBase] =
    useState<string>("0.00")
  // Total fund commissions in USD
  const [totalFundCommissionFeeUSD, setTotalFundCommissionFeeUSD] =
    useState<string>("0.00")

  // Funds under management (without trader funds) in DEXE
  const [fundsUnderManagementDexe, setFundsUnderManagementDexe] =
    useState<string>("0.00")

  /**
   * Fund profit (without trader funds)
   * (_platformCommissionUSD + _traderCommissionUSD) / fundCommissionPercentage
   */
  const fundProfitWithoutTraderUSD = useMemo<IAmount>(() => {
    if (
      !_platformCommissionUSD ||
      !_traderCommissionUSD ||
      !fundCommissionPercentage ||
      fundCommissionPercentage.big.isZero()
    ) {
      return defaultAmountState
    }

    const commissionsSum = addBignumbers(
      [_platformCommissionUSD, 18],
      [_traderCommissionUSD, 18]
    )
    const big = _divideBignumbers(
      [commissionsSum, 18],
      [fundCommissionPercentage.big, 18]
    )

    return { big, format: formatBigNumber(big, 18, 6) }
  }, [fundCommissionPercentage, _platformCommissionUSD, _traderCommissionUSD])
  const fundProfitWithoutTraderDEXE = useMemo<string>(() => {
    if (
      !dexePriceUSD ||
      !fundProfitWithoutTraderUSD ||
      fundProfitWithoutTraderUSD.big.isZero() ||
      parseEther(dexePriceUSD.toString()).isZero()
    ) {
      return "0.00"
    }

    const res = _divideBignumbers(
      [fundProfitWithoutTraderUSD.big, 18],
      [dexePriceUSD, 18]
    )

    return normalizeBigNumber(res, 18, 6)

    return " ? "
  }, [dexePriceUSD, fundProfitWithoutTraderUSD])
  const fundProfitWithoutTraderPercentage = useMemo<string>(() => {
    if (
      !poolInfo ||
      !fundProfitWithoutTraderUSD ||
      fundProfitWithoutTraderUSD.big.isZero()
    ) {
      return "0"
    }

    const { totalPoolUSD, traderUSD } = poolInfo

    const totalTVL = addBignumbers([totalPoolUSD, 18], [traderUSD, 18])
    const res = percentageOfBignumbers(totalTVL, fundProfitWithoutTraderUSD.big)

    return formatBigNumber(res, 18, 0)
  }, [poolInfo, fundProfitWithoutTraderUSD])

  // Platform commissions
  const [platformCommissionBase, setPlatformCommissionBase] =
    useState<string>("0.00")
  const [platformCommissionUSD, setPlatformCommissionUSD] =
    useState<string>("0.00")
  const [platformCommissionPercentage, setPlatformCommissionPercentage] =
    useState<string>("0.00")

  // Trader commissions
  const [traderCommissionUSD, setTraderCommissionUSD] = useState<string>("0.00")
  const [traderCommissionBase, setTraderCommissionBase] =
    useState<string>("0.00")

  /**
   * Net investors profit
   * fundProfitWithoutTraderUSD - (_platformCommissionUSD + _traderCommissionUSD)
   */
  const netInvestorsProfitUSD = useMemo<IAmount>(() => {
    if (
      !fundProfitWithoutTraderUSD.big ||
      !_platformCommissionUSD ||
      !_traderCommissionUSD
    ) {
      return defaultAmountState
    }

    const platformAndTraderAmount = addBignumbers(
      [_platformCommissionUSD, 18],
      [_traderCommissionUSD, 18]
    )

    const big = subtractBignumbers(
      [fundProfitWithoutTraderUSD.big, 18],
      [platformAndTraderAmount, 18]
    )

    return { big, format: formatBigNumber(big, 18, 2) }
  }, [fundProfitWithoutTraderUSD, _platformCommissionUSD, _traderCommissionUSD])
  const netInvestorsProfitDEXE = useMemo<string>(() => {
    if (
      !dexePriceUSD ||
      !netInvestorsProfitUSD ||
      netInvestorsProfitUSD.big.isZero() ||
      parseEther(dexePriceUSD.toString()).isZero()
    ) {
      return "0.00"
    }

    const res = _divideBignumbers(
      [netInvestorsProfitUSD.big, 18],
      [dexePriceUSD, 18]
    )

    return normalizeBigNumber(res, 18, 6)
  }, [dexePriceUSD, netInvestorsProfitUSD])
  /**
   * Investors profit percentage
   * 100 - (fundCommissionPercentage + _platformCommissionPercentage)
   */
  const netInvestorsProfitPercentage = useMemo<string>(() => {
    if (
      fundCommissionPercentage.big.isZero() ||
      _platformCommissionPercentage.isZero()
    ) {
      return "0.00"
    }

    const _traderWithPlatformCommissionPercentage = addBignumbers(
      [fundCommissionPercentage.big, 25],
      [_platformCommissionPercentage, 25]
    )

    return String(
      100 -
        Number(formatBigNumber(_traderWithPlatformCommissionPercentage, 18, 0))
    )
  }, [_platformCommissionPercentage, fundCommissionPercentage.big])

  // SIDE EFFECTS

  // Fetch next commission epoch start date and usersInfo
  useEffect(() => {
    if (!traderPool || !account) return
    ;(async () => {
      try {
        const usersInfo = await traderPool.getUsersInfo(account, 0, 1000)

        if (usersInfo && usersInfo[1]) {
          const { commissionUnlockTimestamp } = usersInfo[1]
          const expanded = expandTimestamp(
            Number(commissionUnlockTimestamp.toString())
          )
          setUnlockDate(format(expanded, DATE_FORMAT))
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [traderPool, account])

  // Fetch funds under management (without trader funds) in DEXE
  useEffect(() => {
    if (!priceFeed) return
    if (!baseToken || !baseToken.address) return
    if (_fundsUnderManagementBase.isZero()) return
    ;(async () => {
      try {
        const priceDexe = await priceFeed.getNormalizedPriceOutDEXE(
          baseToken.address,
          _fundsUnderManagementBase.toString()
        )

        if (priceDexe && priceDexe.amountOut) {
          setFundsUnderManagementDexe(
            normalizeBigNumber(priceDexe.amountOut, 18, 6)
          )
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [baseToken, _fundsUnderManagementBase, priceFeed])

  // Fetch platform and trader commissions
  useEffect(() => {
    if (!traderPool) return
    ;(async () => {
      try {
        const commissions = await traderPool.getReinvestCommissions([0, 1000])

        if (commissions) {
          const {
            dexeBaseCommission,
            dexeUSDCommission,
            traderBaseCommission,
            traderUSDCommission,
          } = commissions

          const base = addBignumbers(
            [dexeBaseCommission, 18],
            [traderBaseCommission, 18]
          )
          setTotalFundCommissionFeeBase(formatBigNumber(base, 18, 6))

          const usd = addBignumbers(
            [dexeUSDCommission, 18],
            [traderUSDCommission, 18]
          )
          setTotalFundCommissionFeeUSD(formatBigNumber(usd, 18, 6))
        }

        if (commissions && commissions.dexeDexeCommission) {
          const { dexeDexeCommission } = commissions

          _setPlatformCommissionDexe(dexeDexeCommission)
        }
        if (commissions && commissions.dexeBaseCommission) {
          const { dexeBaseCommission } = commissions

          setPlatformCommissionBase(formatBigNumber(dexeBaseCommission, 18, 6))
        }
        if (commissions && commissions.dexeUSDCommission) {
          const { dexeUSDCommission } = commissions

          _setPlatformCommissionUSD(dexeUSDCommission)
          setPlatformCommissionUSD(formatBigNumber(dexeUSDCommission, 18, 2))
        }

        if (commissions && commissions.traderBaseCommission) {
          const { traderBaseCommission } = commissions

          setTraderCommissionBase(formatBigNumber(traderBaseCommission, 18, 2))
        }
        if (commissions && commissions.traderUSDCommission) {
          const { traderUSDCommission } = commissions

          _setTraderCommissionUSD(traderUSDCommission)
          setTraderCommissionUSD(formatBigNumber(traderUSDCommission, 18, 2))
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [traderPool])

  // Fetch platform commission percentages
  useEffect(() => {
    if (!coreProperties) return
    ;(async () => {
      try {
        const platformCommissionPercentages =
          await coreProperties.getDEXECommissionPercentages()

        if (platformCommissionPercentages && platformCommissionPercentages[0]) {
          _setPlatformCommissionPercentage(platformCommissionPercentages[0])
          setPlatformCommissionPercentage(
            formatBigNumber(platformCommissionPercentages[0], 25, 0)
          )
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [coreProperties])

  // METHODS

  /**
   * Get the trader commission for the pool
   */
  const withdrawCommission = async () => {
    if (!traderPool) return

    try {
      await traderPool.reinvestCommission([0, 1000], _platformCommissionDexe)
    } catch (error) {
      console.error({ error })
    }
  }

  return [
    [poolGraphData, poolInfo],
    {
      fundCommissionPercentage,
      unlockDate,

      totalFundCommissionFeeBase,
      totalFundCommissionFeeUSD,

      fundsUnderManagementDexe,

      fundProfitWithoutTraderUSD,
      fundProfitWithoutTraderDEXE,
      fundProfitWithoutTraderPercentage,

      platformCommissionUSD,
      platformCommissionBase,
      platformCommissionPercentage,

      traderCommissionUSD,
      traderCommissionBase,

      netInvestorsProfitUSD,
      netInvestorsProfitDEXE,
      netInvestorsProfitPercentage,
    },
    { withdrawCommission },
  ]
}

export default useFundFee
