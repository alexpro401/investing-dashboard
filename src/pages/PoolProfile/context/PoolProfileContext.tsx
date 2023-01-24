import {
  createContext,
  FC,
  HTMLAttributes,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useWeb3React } from "@web3-react/core"
import { useTraderPoolContract } from "contracts"
import { useSelector } from "react-redux"
import { AppState } from "state"
import { selectPoolByAddress } from "state/pools/selectors"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import {
  usePoolContract,
  usePoolLockedFundsHistory,
  usePoolPrice,
  usePoolSortino,
  usePoolStatistics,
  usePoolLockedFunds,
  useInvestorAllVestsInPool,
  usePoolAlternativePnlUSD,
  usePoolAlternativePnlTokens,
} from "hooks"
import { useERC20Data } from "state/erc20/hooks"
import { PoolType, TIMEFRAME, ZERO } from "consts"
import { getPNL, getPriceLP, multiplyBignumbers } from "utils/formulas"
import { expandTimestamp, normalizeBigNumber } from "utils"
import WithPoolAddressValidation from "components/WithPoolAddressValidation"
import { Center } from "theme"
import { GuardSpinner } from "react-spinners-kit"
import { IPoolInfo } from "interfaces/contracts/ITraderPool"
import { getDay } from "date-fns"
import { BigNumber } from "@ethersproject/bignumber"
import { Token } from "interfaces"
import { Investor } from "interfaces/thegraphs/all-pools"
import useFundFee from "./useFundFee"

interface IPoolProfileContext {
  isTrader?: boolean

  creationDate?: number
  fundAddress?: string
  basicToken?: Token | null
  fundTicker?: string
  fundName?: string
  fundType?: PoolType
  fundImageUrl?: string

  minInvestAmount?: BigNumber
  emission?: BigNumber
  availableLPTokens?: { percentage: number; value: BigNumber }
  fundManagers?: string[]
  whiteList?: Investor[]
  openPosition?: string[]
  isInvestorStricted?: boolean
  performanceFee?: BigNumber

  fundDescription?: string
  fundStrategy?: string

  trades?: {
    perDay: number
    total: number
  }
  orderSize?: BigNumber
  dailyProfitPercent?: number
  timePositions?: string
  sortino?: { eth: string; btc: string }
  maxLoss?: number

  pnl?: {
    total?: {
      base: {
        amount?: BigNumber
        percent?: number
      }
      dexe: {
        amount?: BigNumber
        percent?: number
      }
      usd: {
        amount?: BigNumber
        percent?: number
      }
      eth: {
        amount?: BigNumber
        percent?: number
      }
      btc: {
        amount?: BigNumber
        percent?: number
      }
    }
    _24h?: {
      base: {
        amount?: BigNumber
        percent?: number
      }
    }
  }

  depositors?: number
  apy?: BigNumber
  tvl?: number
  priceLP?: string

  lockedFunds?: {
    accountLPsPrice: any

    poolLockedFundHistoryChartData: any
    isPoolLockedFundHistoryChartDataFetching: any

    tf: any
    setTf: any

    baseSymbol?: any
    totalPoolUSD?: any
    traderFundsUSD?: any
    traderFundsBase?: any
    investorsFundsUSD?: any
    investorsFundsBase?: any
    poolUsedInPositionsUSD?: any
    poolUsedToTotalPercentage?: any
  }

  poolInvestors?: Investor[]

  perfomanceFee?: {
    perfomancePoolData?: any
    perfomancePpoolInfo?: any

    optimizeWithdrawal?: any

    fundCommissionPercentage?: any
    unlockDate?: any

    totalFundCommissionFeeBase?: any
    totalFundCommissionFeeUSD?: any

    fundsUnderManagementDexe?: any

    fundProfitWithoutTraderUSD?: any
    fundProfitWithoutTraderDEXE?: any
    fundProfitWithoutTraderPercentage?: any

    platformCommissionUSD?: any
    platformCommissionBase?: any
    platformCommissionPercentage?: any

    traderCommissionUSD?: any
    traderCommissionBase?: any

    netInvestorsProfitUSD?: any
    netInvestorsProfitDEXE?: any
    netInvestorsProfitPercentage?: any

    setOptimizeWithdrawal?: any
    withdrawCommission?: any
  }
}

export const PoolProfileContext = createContext<IPoolProfileContext>({})

interface Props extends HTMLAttributes<HTMLDivElement> {
  poolAddress: string
}

const PoolProfileContextProvider: FC<Props> = ({ poolAddress, children }) => {
  const [isTrader, setIsTrader] = useState(false)

  const { account } = useWeb3React()

  const traderPool = useTraderPoolContract(poolAddress)

  const poolData = useSelector((s: AppState) =>
    selectPoolByAddress(s, poolAddress)
  )

  const loader = useMemo(
    () => (
      <Center>
        <GuardSpinner size={20} loading />
      </Center>
    ),
    []
  )

  const { depositors, pnlBase24hPercent, pnlBasePercent, priceLP, apy, tvl } =
    usePoolStatistics(poolData)

  const [, poolInfo] = usePoolContract(poolAddress)

  const [{ poolMetadata }] = usePoolMetadata(
    poolData?.id,
    poolData?.descriptionURL
  )

  const [{ priceUSD }] = usePoolPrice(poolAddress)

  const [baseToken] = useERC20Data(poolData?.baseToken)

  const [accountLPs, setAccountLPs] = useState(ZERO)

  useEffect(() => {
    if (!traderPool || !account) return
    ;(async () => {
      const [isAdmin, balance] = await Promise.all([
        traderPool.isTraderAdmin(account),
        traderPool.balanceOf(account),
      ])
      setIsTrader(isAdmin)
      setAccountLPs(balance)
    })()
  }, [traderPool, account])

  const accountLPsPrice = useMemo(() => {
    if (accountLPs.isZero() || priceUSD.isZero()) {
      return ZERO
    }
    return multiplyBignumbers([accountLPs, 18], [priceUSD, 18])
  }, [priceUSD, accountLPs])

  const [
    {
      baseSymbol,
      totalPoolUSD,
      traderFundsUSD,
      traderFundsBase,
      investorsFundsUSD,
      investorsFundsBase,
      poolUsedInPositionsUSD,
      poolUsedToTotalPercentage,
    },
  ] = usePoolLockedFunds(poolData, poolInfo as IPoolInfo, baseToken as Token)

  const [tf, setTf] = useState(TIMEFRAME.d)
  const [
    poolLockedFundHistoryChartData,
    isPoolLockedFundHistoryChartDataFetching,
  ] = usePoolLockedFundsHistory(poolData?.id, tf)

  const sortinoTokens = [
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
  ]

  const addressWETH = "0x8babbb98678facc7342735486c851abd7a0d17ca"
  const addressWBTC = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"

  const _sortino = usePoolSortino(poolData?.id, sortinoTokens)

  const dailyProfitPercent = useMemo(() => {
    if (!poolData) return 0

    const days = getDay(expandTimestamp(poolData?.creationTime))
    if (days === 0) return 0

    const priceLP = getPriceLP(poolData?.priceHistory)
    const pnl = getPNL(priceLP)

    return Number(pnl) / days
  }, [poolData])

  const timePositions = useMemo(() => {
    if (!poolData) return ""

    const date = new Date(poolData?.averagePositionTime * 1000)

    return `${date.getUTCHours()}H`
  }, [poolData])

  const sortino = useMemo(() => {
    return {
      eth: !_sortino ? "♾️" : Number([_sortino[sortinoTokens[0]]]).toFixed(2),
      btc: !_sortino ? "♾️" : Number([_sortino[sortinoTokens[1]]]).toFixed(2),
    }
  }, [_sortino, sortinoTokens])

  const { data: investorVests } = useInvestorAllVestsInPool(
    account,
    poolData?.id
  )

  const altPnlUSD = usePoolAlternativePnlUSD(investorVests, poolData?.baseToken)

  const altPnlTokens = usePoolAlternativePnlTokens(
    investorVests,
    poolData?.baseToken,
    { eth: addressWETH, btc: addressWBTC }
  )

  const availableLPTokens = useMemo(() => {
    if (!poolInfo || poolInfo.parameters.totalLPEmission.isZero())
      return {
        percentage: 0,
        value: BigNumber.from(0),
      }

    const total = poolInfo.parameters.totalLPEmission
    const used = poolInfo.lpSupply.add(poolInfo.lpLockedInProposals)

    const dif = total.sub(used)

    const percent = Number(normalizeBigNumber(used.sub(total).mul(100), 25))

    return {
      percentage: percent,
      value: dif,
    }
  }, [poolInfo])

  // perfomance fee
  const [
    [perfomancePoolData, perfomancePpoolInfo],
    {
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
    { setOptimizeWithdrawal, withdrawCommission },
  ] = useFundFee(poolAddress)

  return (
    <WithPoolAddressValidation poolAddress={poolAddress ?? ""} loader={loader}>
      <PoolProfileContext.Provider
        value={{
          isTrader,

          creationDate: poolData?.creationTime,
          fundAddress: poolData?.id,
          basicToken: baseToken,
          fundTicker: poolData?.ticker,
          fundName: poolData?.name,
          fundType: poolData?.type,
          fundImageUrl: poolMetadata?.assets[poolMetadata?.assets.length - 1],

          minInvestAmount: poolInfo?.parameters.minimalInvestment,
          emission: poolInfo?.parameters.totalLPEmission,
          // if emission.isZero() then we ain't show availableLPTokens
          availableLPTokens,
          fundManagers: poolData?.admins,
          poolInvestors: poolData?.investors,
          whiteList: poolData?.privateInvestors,
          openPosition: poolInfo?.openPositions,
          isInvestorStricted: !!poolData?.privateInvestors?.length,
          performanceFee: poolInfo?.parameters.commissionPercentage,

          fundDescription: poolMetadata?.description,
          fundStrategy: poolMetadata?.strategy,

          trades: {
            perDay: poolData?.averageTrades,
            total: poolData?.totalTrades,
          },
          orderSize: poolData?.orderSize,
          dailyProfitPercent,
          timePositions,
          sortino,
          maxLoss: poolData?.maxLoss,

          // in USD
          pnl: {
            _24h: {
              base: {
                amount: BigNumber.from(0),
                percent: pnlBase24hPercent as number,
              },
            },
            total: {
              base: {
                amount: BigNumber.from(
                  poolData?.priceHistory[0]?.absPNLBase | 0
                ),
                percent: pnlBasePercent,
              },
              dexe: {
                amount: BigNumber.from(
                  poolData?.priceHistory[0]?.absPNLBase | 0
                ),
                percent: pnlBasePercent,
              },
              usd: {
                amount: altPnlUSD.usd,
                percent: Number(normalizeBigNumber(altPnlUSD.percentage, 25)),
              },
              eth: {
                amount: altPnlTokens?.usd?.eth,
                percent: Number(
                  normalizeBigNumber(altPnlTokens?.percentage?.eth, 25)
                ),
              },
              btc: {
                amount: altPnlTokens?.usd?.btc,
                percent: Number(
                  normalizeBigNumber(altPnlTokens?.percentage?.btc, 25)
                ),
              },
            },
          },

          depositors,
          priceLP,
          tvl,
          apy,

          lockedFunds: {
            accountLPsPrice,

            poolLockedFundHistoryChartData,
            isPoolLockedFundHistoryChartDataFetching,

            tf,
            setTf,

            baseSymbol,
            totalPoolUSD,
            traderFundsUSD,
            traderFundsBase,
            investorsFundsUSD,
            investorsFundsBase,
            poolUsedInPositionsUSD,
            poolUsedToTotalPercentage,
          },

          perfomanceFee: {
            perfomancePoolData,
            perfomancePpoolInfo,

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

            setOptimizeWithdrawal,
            withdrawCommission,
          },
        }}
      >
        {children}
      </PoolProfileContext.Provider>
    </WithPoolAddressValidation>
  )
}

export default PoolProfileContextProvider
