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
  subtractBignumbers,
  _divideBignumbers,
} from "utils/formulas"

const BIG_ZERO = BigNumber.from(0)
const BIG_HUNDRED = BigNumber.from(100)

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

  fundProfitWithoutTraderUSD: string
  fundProfitWithoutTraderDEXE: string
  fundProfitWithoutTraderPercentage: string

  platformCommissionLP: string
  platformCommissionUSD: string
  platformCommissionPercentage: string

  traderCommissionUSD: string
  traderCommissionBase: string

  netInvestorsProfitUSD: IAmount
  netInvestorsProfitDEXE: string
  netInvestorsProfitPercentage: string
}

function useFundFee(
  poolAddress?: string
): [[IPoolQuery | undefined, PoolInfo | null], IPayload] {
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
    const result = subtractBignumbers([totalPoolBase, 18], [traderBase, 18])

    return BigNumber.from(result)
  }, [poolInfo])

  // Platform commision
  const [_platformCommissionUSD, _setPlatformCommissionUSD] =
    useState<BigNumber>(BIG_ZERO)
  const [_platformCommissionPercentage, _setPlatformCommissionPercentage] =
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
    useState<string>(" ? ")
  // Total fund commissions in USD
  const [totalFundCommissionFeeUSD, setTotalFundCommissionFeeUSD] =
    useState<string>(" ? ")

  // Funds under management (without trader funds) in DEXE
  const [fundsUnderManagementDexe, setFundsUnderManagementDexe] =
    useState<string>("0.00")

  /**
   * Fund profit (without trader funds)
   * (_platformCommissionUSD + _traderCommissionUSD) / (100% - fundCommissionPercentage)
   */
  const fundProfitWithoutTraderUSD = useMemo<string>(() => {
    if (
      !_platformCommissionUSD ||
      !_traderCommissionUSD ||
      !fundCommissionPercentage
    ) {
      return "0.00"
    }

    const commissionsSum = addBignumbers(
      [_platformCommissionUSD, 18],
      [_traderCommissionUSD, 18]
    )

    const percent = subtractBignumbers(
      [BIG_HUNDRED, 18],
      [fundCommissionPercentage.big, 18]
    )

    const big = _divideBignumbers([commissionsSum, 18], [percent, 18])

    return formatBigNumber(big, 18, 6)
  }, [fundCommissionPercentage, _platformCommissionUSD, _traderCommissionUSD])
  const fundProfitWithoutTraderDEXE = useMemo<string>(() => " ? ", [])
  const fundProfitWithoutTraderPercentage = useMemo<string>(() => " ? ", [])

  // Platform commissions
  const [platformCommissionLP, setPlatformCommissionLP] =
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
   * _fundsUnderManagementBase - (_platformCommissionUSD + _traderCommissionUSD)
   */
  const netInvestorsProfitUSD = useMemo<IAmount>(() => {
    if (
      !_fundsUnderManagementBase ||
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
      [_fundsUnderManagementBase, 18],
      [platformAndTraderAmount, 18]
    )

    return { big, format: formatBigNumber(big, 18, 2) }
  }, [_fundsUnderManagementBase, _platformCommissionUSD, _traderCommissionUSD])
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

  // Fetch next commission epoch start date
  useEffect(() => {
    if (!traderPool || !account) return
    ;(async () => {
      try {
        const traderData = await traderPool.getUsersInfo(account, 0, 0)
        if (traderData && traderData[1]) {
          const { commissionUnlockTimestamp } = traderData[1]
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

        if (commissions && commissions.dexeLPCommission) {
          const { dexeLPCommission } = commissions

          setPlatformCommissionLP(formatBigNumber(dexeLPCommission, 18, 6))
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

      platformCommissionLP,
      platformCommissionUSD,
      platformCommissionPercentage,

      traderCommissionUSD,
      traderCommissionBase,

      netInvestorsProfitUSD,
      netInvestorsProfitDEXE,
      netInvestorsProfitPercentage,
    },
  ]
}

export default useFundFee
