import {
  createContext,
  FC,
  HTMLAttributes,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useParams } from "react-router-dom"
import { useWeb3React } from "@web3-react/core"
import { useTraderPoolContract } from "contracts"
import { useSelector } from "react-redux"
import { AppState } from "state"
import { selectPoolByAddress } from "state/pools/selectors"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import {
  usePoolContract,
  usePoolLockedFundsHistory,
  usePoolPnlInfo,
  usePoolPrice,
  usePoolSortino,
  usePoolStatistics,
  usePoolLockedFunds,
  useInvestorAllVestsInPool,
  usePoolAlternativePnlUSD,
  usePoolAlternativePnlTokens,
} from "hooks"
import { useERC20Data } from "state/erc20/hooks"
import { TIMEFRAME, ZERO } from "consts"
import { getPNL, getPriceLP, multiplyBignumbers } from "utils/formulas"
import { expandTimestamp, normalizeBigNumber } from "utils"
import WithPoolAddressValidation from "components/WithPoolAddressValidation"
import { Center } from "theme"
import { GuardSpinner } from "react-spinners-kit"
import { IPoolInfo } from "interfaces/contracts/ITraderPool"
import { getDay } from "date-fns"
import { BigNumber } from "@ethersproject/bignumber"
import { Token } from "interfaces"

interface IPoolProfileContext {
  [key: string]: any
}

export const PoolProfileContext = createContext<IPoolProfileContext>({
  poolData: undefined,
  poolMetadata: undefined,
  baseToken: undefined,
  priceLP: undefined,
  tvl: undefined,
  apy: undefined,
  pnl: undefined,
  pnl24h: undefined,
  depositors: undefined,
  accountLPsPrice: undefined,
  isTrader: false,
  poolInfo: {} as IPoolInfo,

  totalPnlPercentage: undefined,
  totalPnlBase: undefined,
  totalUSDPnlPerc: undefined,
  totalUSDPnlUSD: undefined,

  baseSymbol: undefined,
  totalPoolUSD: undefined,
  traderFundsUSD: undefined,
  traderFundsBase: undefined,
  investorsFundsUSD: undefined,
  investorsFundsBase: undefined,
  poolUsedInPositionsUSD: undefined,
  poolUsedToTotalPercentage: undefined,
  tf: undefined,
  setTf: undefined,
  poolLockedFundHistoryChartData: undefined,
  isPoolLockedFundHistoryChartDataFetching: undefined,

  creationTime: undefined,
  minimalInvestment: undefined,
  emission: undefined,
  emissionLeft: undefined,
  adminsCount: undefined,
  whitelistCount: undefined,
  commissionPercentage: undefined,

  sortino: undefined,
  investorsCount: undefined,
  openPositionsLen: undefined,
  orderSize: undefined,
  dailyProfit: undefined,
  timePosition: undefined,
  sortinoETH: undefined,
  sortinoBTC: undefined,
  totalTrades: undefined,
  maxLoss: undefined,

  altPnlUSD_USD: undefined,
  altPnlUSD_Percentage: undefined,
  altPnlETH_USD: undefined,
  altPnlETH_Percentage: undefined,
  altPnlBTC_USD: undefined,
  altPnlBTC_Percentage: undefined,
  pnlPerc: undefined,
  pnlUSD: undefined,
})

interface Props extends HTMLAttributes<HTMLDivElement> {}

const PoolProfileContextProvider: FC<Props> = ({ children }) => {
  const [isTrader, setIsTrader] = useState(false)

  const { poolAddress } = useParams()

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

  const poolStatistics = usePoolStatistics(poolData)

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
    if (accountLPs.isZero() || priceUSD.isZero()) return BigNumber.from(0)

    return multiplyBignumbers([accountLPs, 18], [priceUSD, 18])
  }, [priceUSD, accountLPs])

  const [
    ,
    { totalPnlPercentage, totalPnlBase, totalUSDPnlPerc, totalUSDPnlUSD },
  ] = usePoolPnlInfo(poolData?.id)

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

  const adminsCount = useMemo(
    () => (poolData ? poolData?.admins.length : 0),
    [poolData]
  )

  const whitelistCount = useMemo(() => {
    if (!poolData) return 0

    return poolData?.privateInvestors?.length || 0
  }, [poolData])

  const commissionPercentage = useMemo(() => {
    if (!poolInfo) return BigNumber.from(0)

    return poolInfo.parameters.commissionPercentage
  }, [poolInfo])

  const sortinoTokens = [
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
  ]

  const addressWETH = "0x8babbb98678facc7342735486c851abd7a0d17ca"
  const addressWBTC = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"

  const _sortino = usePoolSortino(poolData?.id, sortinoTokens)

  const openPositionsLen = Number(poolInfo?.openPositions.length) || 0

  const dailyProfitPercent = useMemo(() => {
    if (!poolData) return 0

    const days = getDay(expandTimestamp(poolData?.creationTime))
    if (days === 0) return 0

    const priceLP = getPriceLP(poolData?.priceHistory)
    const pnl = getPNL(priceLP)

    return (Number(pnl) / days).toFixed(2)
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

  const totalTrades = useMemo(() => {
    if (!poolData) return "0"

    return poolData?.totalTrades
  }, [poolData])

  const maxLoss = useMemo(() => {
    if (!poolData) return BigNumber.from(0)

    return BigNumber.from(poolData?.maxLoss)
  }, [poolData])

  function getUSDRenderValue(value: BigNumber): ReactNode {
    if (value.lt(0)) {
      return `-$${normalizeBigNumber(value.abs(), 18, 5)}`
    }
    return `$${normalizeBigNumber(value, 18, 5)}`
  }

  const { data: investorVests } = useInvestorAllVestsInPool(
    account,
    poolData?.id
  )

  const altPnlUSD = usePoolAlternativePnlUSD(investorVests, poolData?.baseToken)

  const altPnlUSD_USD = useMemo(
    () => getUSDRenderValue(altPnlUSD.usd),
    [altPnlUSD]
  )
  const altPnlUSD_Percentage = useMemo(
    () => normalizeBigNumber(altPnlUSD.percentage),
    [altPnlUSD]
  )

  const altPnlTokens = usePoolAlternativePnlTokens(
    investorVests,
    poolData?.baseToken,
    { eth: addressWETH, btc: addressWBTC }
  )

  const altPnlETH_USD = useMemo(
    () => getUSDRenderValue(altPnlTokens.usd.eth),
    [altPnlTokens]
  )
  const altPnlETH_Percentage = useMemo(
    () => normalizeBigNumber(altPnlTokens.percentage.eth),
    [altPnlTokens]
  )

  const altPnlBTC_USD = useMemo(
    () => getUSDRenderValue(altPnlTokens.usd.btc),
    [altPnlTokens]
  )
  const altPnlBTC_Percentage = useMemo(
    () => normalizeBigNumber(altPnlTokens.percentage.btc),
    [altPnlTokens]
  )

  const pnlPerc = useMemo(() => {
    if (!poolData) return "0.0"

    const priceLP = getPriceLP(poolData?.priceHistory)
    return getPNL(priceLP)
  }, [poolData])

  const pnlUSD = useMemo(() => {
    if (!poolData || !poolData?.priceHistory[0]) return "$0.0"

    const BN = BigNumber.from(poolData?.priceHistory[0]?.percPNLUSD)
    return getUSDRenderValue(BN)
  }, [poolData])

  const availableLPTokens = useMemo(() => {
    if (!poolInfo || poolInfo.parameters.totalLPEmission.isZero())
      return {
        percentage: 0,
        value: BigNumber.from(0),
      }

    const total = poolInfo.parameters.totalLPEmission
    const used = poolInfo.lpSupply.add(poolInfo.lpLockedInProposals)

    const dif = total.sub(used)

    const percent = used.sub(total).mul(100).toNumber().toFixed(2)

    return {
      percentage: percent,
      value: dif,
    }
  }, [poolInfo])

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

          minInvestAmount: poolInfo?.parameters.minimalInvestment,
          emission: poolInfo?.parameters.totalLPEmission,
          // if emission.isZero() then we ain't show availableLPTokens
          availableLPTokens,
          fundManagers: poolData?.admins,
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
          // pnl: {
          //   total: {
          //     dexe: {
          //       amount,
          //       percent,
          //     },
          //     usd: {
          //       amount,
          //       percent,
          //     },
          //     eth: {
          //       amount,
          //       percent,
          //     },
          //     btc: {
          //       amount,
          //       percent,
          //     },
          //     LP_WBNB: {},
          //     LP_USD: {},
          //   },
          // },

          // poolData,
          // poolMetadata,
          // baseToken,
          // priceLP,
          // tvl,
          // apy,
          // pnl,
          // pnl24h,
          // depositors,
          // isTrader,
          // accountLPsPrice,
          // poolInfo: poolInfo as IPoolInfo,
          //
          // totalPnlPercentage,
          // totalPnlBase,
          // totalUSDPnlPerc,
          // totalUSDPnlUSD,
          //
          // baseSymbol,
          // totalPoolUSD,
          // traderFundsUSD,
          // traderFundsBase,
          // investorsFundsUSD,
          // investorsFundsBase,
          // poolUsedInPositionsUSD,
          // poolUsedToTotalPercentage,
          // tf,
          // setTf,
          // poolLockedFundHistoryChartData,
          // isPoolLockedFundHistoryChartDataFetching,
          //
          // creationTime,
          // minimalInvestment,
          // emission,
          // emissionLeft,
          // adminsCount,
          // whitelistCount,
          // commissionPercentage,
          //
          // sortino,
          // investorsCount,
          // openPositionsLen,
          // orderSize,
          // dailyProfit,
          // timePosition,
          // sortinoETH,
          // sortinoBTC,
          // totalTrades,
          // maxLoss,
          //
          // altPnlUSD_USD,
          // altPnlUSD_Percentage,
          // altPnlETH_USD,
          // altPnlETH_Percentage,
          // altPnlBTC_USD,
          // altPnlBTC_Percentage,
          // pnlPerc,
          // pnlUSD,
        }}
      >
        {children}
      </PoolProfileContext.Provider>
    </WithPoolAddressValidation>
  )
}

export default PoolProfileContextProvider
