import {
  useState,
  useMemo,
  useEffect,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react"
import { format } from "date-fns"
import { useSelector } from "react-redux"
import { BigNumber } from "@ethersproject/bignumber"
import { parseEther, parseUnits } from "@ethersproject/units"

import {
  addBignumbers,
  percentageOfBignumbers,
  subtractBignumbers,
  _divideBignumbers,
  _multiplyBignumbers,
} from "utils/formulas"
import {
  isTxMined,
  expandTimestamp,
  formatBigNumber,
  normalizeBigNumber,
  parseTransactionError,
} from "utils"
import { useActiveWeb3React } from "hooks"
import { DATE_FORMAT } from "constants/time"
import { SubmitState } from "constants/types"
import { ChainMainToken } from "constants/chains"
import { useAddToast } from "state/application/hooks"
import { selectGasByChain } from "state/gas/selectors"
import useCoreProperties from "hooks/useCoreProperties"
import { TransactionType } from "state/transactions/types"
import useTokenPriceOutUSD from "hooks/useTokenPriceOutUSD"
import { selectDexeAddress } from "state/contracts/selectors"
import { useTransactionAdder } from "state/transactions/hooks"
import { useERC20, usePriceFeedContract } from "hooks/useContract"
import { IPoolQuery, PoolInfo, IUserFeeInfo } from "constants/interfaces_v2"
import { usePoolContract, usePoolQuery, useTraderPool } from "hooks/usePool"

const BIG_ZERO = BigNumber.from(0)
const COMMISSION_MULTIPLIER = BigNumber.from(10)

interface IAmount {
  big: BigNumber
  format: string
}

const defaultAmountState: IAmount = {
  big: BIG_ZERO,
  format: normalizeBigNumber(BIG_ZERO, 18, 6),
}

interface IPayload {
  error: string
  isSubmiting: SubmitState

  optimizeWithdrawal: boolean

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
  setSubmiting: Dispatch<SetStateAction<SubmitState>>
  setError: Dispatch<SetStateAction<string>>
  setOptimizeWithdrawal: Dispatch<SetStateAction<boolean>>
  withdrawCommission: () => void
}

function useFundFee(
  poolAddress?: string
): [[IPoolQuery | undefined, PoolInfo | null], IPayload, IMethods] {
  const { account, chainId } = useActiveWeb3React()

  const addToast = useAddToast()
  const priceFeed = usePriceFeedContract()
  const coreProperties = useCoreProperties()
  const addTransaction = useTransactionAdder()
  const traderPool = useTraderPool(poolAddress)
  const [poolGraphData] = usePoolQuery(poolAddress)
  const [, poolInfo] = usePoolContract(poolAddress)
  const [, baseToken] = useERC20(poolGraphData?.baseToken)

  const gas = useSelector(selectGasByChain(chainId))
  const dexeAddress = useSelector(selectDexeAddress)
  const dexePriceUSD = useTokenPriceOutUSD({ tokenAddress: dexeAddress })

  // UI DATA
  // Submitting state
  const [isSubmiting, setSubmiting] = useState(SubmitState.IDLE)
  // Error message
  const [error, setError] = useState("")

  // TECHNICAL DATA (used for calculation purposes only)

  // Investors commission info
  const [_investorsInfo, _setInvestorsInfo] = useState<IUserFeeInfo[]>([])

  // Funds under pool management in baseToken (without trader funds)
  const _fundsUnderManagementBase = useMemo<BigNumber>(() => {
    if (!poolInfo) return BIG_ZERO

    const { totalPoolBase, traderBase } = poolInfo
    return subtractBignumbers([totalPoolBase, 18], [traderBase, 18])
  }, [poolInfo])

  // Fund TVL ( including traderTVL ) in USD
  const _totalTvlUSD = useMemo<BigNumber>(() => {
    if (!poolInfo) return BIG_ZERO

    const { totalPoolUSD, traderUSD } = poolInfo

    return addBignumbers([totalPoolUSD, 18], [traderUSD, 18])
  }, [poolInfo])

  // Platform commision
  const [_platformCommissionUSD, _setPlatformCommissionUSD] =
    useState<BigNumber>(BIG_ZERO)
  const [_platformCommissionDexe, _setPlatformCommissionDexe] =
    useState<BigNumber>(BIG_ZERO)

  // Trader commissions
  const [_traderCommissionUSD, _setTraderCommissionUSD] =
    useState<BigNumber>(BIG_ZERO)

  // DATA

  // Withdrawal optimization flag
  const [optimizeWithdrawal, setOptimizeWithdrawal] = useState<boolean>(true)

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
  }, [dexePriceUSD, fundProfitWithoutTraderUSD])
  const fundProfitWithoutTraderPercentage = useMemo<string>(() => {
    if (
      !_totalTvlUSD ||
      !fundProfitWithoutTraderUSD ||
      fundProfitWithoutTraderUSD.big.isZero()
    ) {
      return "0"
    }

    const res = percentageOfBignumbers(
      _totalTvlUSD,
      fundProfitWithoutTraderUSD.big
    )

    return formatBigNumber(res, 18, 0)
  }, [_totalTvlUSD, fundProfitWithoutTraderUSD])

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
   * (netInvestorsProfit / (TVL - traderTVL)) * 100
   */
  const netInvestorsProfitPercentage = useMemo<string>(() => {
    if (netInvestorsProfitUSD.big.isZero() || !_totalTvlUSD) {
      return "0.00"
    }

    const res = percentageOfBignumbers(_totalTvlUSD, netInvestorsProfitUSD.big)

    return formatBigNumber(res, 18, 0)
  }, [netInvestorsProfitUSD, _totalTvlUSD])

  // SIDE EFFECTS

  // Fetch next commission epoch start date and usersInfo
  useEffect(() => {
    if (!traderPool || !account) return
    ;(async () => {
      try {
        const usersInfo: IUserFeeInfo[] = await traderPool.getUsersInfo(
          account,
          0,
          1000
        )

        if (usersInfo && usersInfo[1]) {
          const { commissionUnlockTimestamp } = usersInfo[1]
          const expanded = expandTimestamp(
            Number(commissionUnlockTimestamp.toString())
          )
          setUnlockDate(format(expanded, DATE_FORMAT))
        }

        if (usersInfo && usersInfo.length > 2) {
          const [, , ...investors] = usersInfo

          _setInvestorsInfo(investors)
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

  // Get ranges with investors
  const _getInvestorsRanges = useCallback(
    async (investors: IUserFeeInfo[]) => {
      if (!priceFeed || !chainId || !gas || !poolGraphData) {
        return []
      }

      const result: number[][] = []

      let currentRange: number[] = []

      // Save current range to result and clear it
      function saveResultBeforeNewRange() {
        if (currentRange.length > 0) {
          result.push(currentRange)
          currentRange = []
        }
      }

      for (const [key, investor] of investors.entries()) {
        const { owedBaseCommission } = investor

        // If investor commission 0 - skip him
        if (owedBaseCommission.isZero()) {
          if (currentRange.length > 0) {
            saveResultBeforeNewRange()
          }
          break
        } else {
          // Otherwice get investor commission in chain token (ex: Binance chain -> BNB)
          const price = await priceFeed.getNormalizedExtendedPriceOut(
            poolGraphData?.baseToken,
            ChainMainToken[chainId],
            owedBaseCommission,
            []
          )

          const { amountOut } = price

          // Convert current gas price
          const gasPriceEther = parseUnits(gas.FastGasPrice, "gwei")

          // Calculate gas price with multiplier
          const gasWithMultiplier = _multiplyBignumbers(
            [COMMISSION_MULTIPLIER, 18],
            [gasPriceEther, 18]
          )

          // If trader commission less then gas * 10(multiplier) skip this investor
          if (amountOut.isZero() || amountOut.lt(gasWithMultiplier)) {
            saveResultBeforeNewRange()
            break
          } else {
            // Otherwice add trader to current range
            currentRange.push(key)
          }

          // List is end - time to save last range and clear temporary state
          if (investors.length === key + 1) {
            saveResultBeforeNewRange()
          }
        }
      }

      return result
    },
    [chainId, gas, poolGraphData, priceFeed]
  )

  /**
   * Get the trader commission for the pool
   */
  const withdrawCommission = async () => {
    if (!traderPool || _investorsInfo.length === 0) {
      addToast(
        {
          type: "warning",
          content: "Can't withdraw, no investors in fund",
        },
        "withdrawal-fee-no-investors",
        5000
      )
      return
    }
    setSubmiting(SubmitState.SIGN)
    let investorsRanges
    if (optimizeWithdrawal) {
      investorsRanges = await _getInvestorsRanges(_investorsInfo)

      if (investorsRanges.length === 0) {
        addToast(
          {
            type: "warning",
            content:
              "Can't withdraw, commissions from investors less than transaction fee",
          },
          "withdrawal-fee-no-investors-with-available-commission",
          5000
        )
        setSubmiting(SubmitState.IDLE)

        return
      }
    } else {
      investorsRanges = [0, 1000]
    }

    try {
      setSubmiting(SubmitState.WAIT_CONFIRM)
      const receipt = await traderPool.reinvestCommission(
        investorsRanges,
        _platformCommissionDexe
      )

      const tx = await addTransaction(receipt, {
        type: TransactionType.TRADER_GET_PERFORMANCE_FEE,
        poolId: poolAddress,
      })

      if (isTxMined(tx)) {
        setSubmiting(SubmitState.SUCESS)
      }
    } catch (error) {
      const errorMessage = parseTransactionError(error)
      !!errorMessage && setError(errorMessage)
    } finally {
      setSubmiting(SubmitState.IDLE)
    }
  }

  return [
    [poolGraphData, poolInfo],
    {
      error,
      isSubmiting,

      optimizeWithdrawal,

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
    { setError, setSubmiting, setOptimizeWithdrawal, withdrawCommission },
  ]
}

export default useFundFee
