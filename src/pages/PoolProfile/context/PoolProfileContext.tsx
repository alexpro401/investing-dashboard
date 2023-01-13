import {
  createContext,
  FC,
  HTMLAttributes,
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
} from "hooks"
import { useERC20Data } from "state/erc20/hooks"
import { DATE_FORMAT, TIMEFRAME, ZERO } from "consts"
import { getPNL, getPriceLP, multiplyBignumbers } from "utils/formulas"
import { expandTimestamp } from "utils"
import WithPoolAddressValidation from "components/WithPoolAddressValidation"
import { Center } from "theme"
import { GuardSpinner } from "react-spinners-kit"
import { IPoolInfo } from "interfaces/contracts/ITraderPool"
import { format, getDay } from "date-fns"
import { formatEther } from "@ethersproject/units"
import { BigNumber } from "@ethersproject/bignumber"

interface IPoolProfileContext {
  poolData: any
  poolMetadata: any
  baseToken: any
  priceLP: any
  tvl: any
  apy: any
  pnl: any
  pnl24h: any
  depositors: any
  accountLPsPrice: any
  isTrader: boolean
  poolInfo: IPoolInfo

  totalPnlPercentage: any
  totalPnlBase: any
  totalUSDPnlPerc: any
  totalUSDPnlUSD: any

  baseSymbol: any
  totalPoolUSD: any
  traderFundsUSD: any
  traderFundsBase: any
  investorsFundsUSD: any
  investorsFundsBase: any
  poolUsedInPositionsUSD: any
  poolUsedToTotalPercentage: any
  tf: any
  setTf: any
  poolLockedFundHistoryChartData: any
  isPoolLockedFundHistoryChartDataFetching: any

  creationTime: any
  minimalInvestment: any
  emission: any
  emissionLeft: any
  adminsCount: any
  whitelistCount: any
  commissionPercentage: any

  sortino: any
  investorsCount: any
  openPositionsLen: any
  orderSize: any
  dailyProfit: any
  timePosition: any
  sortinoETH: any
  sortinoBTC: any
  totalTrades: any
  maxLoss: any
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
})

interface Props extends HTMLAttributes<HTMLDivElement> {}

const PoolProfileContextProvider: FC<Props> = ({ children }) => {
  const { poolAddress } = useParams()

  const { account } = useWeb3React()

  const traderPool = useTraderPoolContract(poolAddress)
  const poolData = useSelector((s: AppState) =>
    selectPoolByAddress(s, poolAddress)
  )

  const { priceLP, tvl, apy, pnl, pnl24h, depositors } =
    usePoolStatistics(poolData)

  const [, poolInfo] = usePoolContract(poolAddress)
  const [{ poolMetadata }] = usePoolMetadata(
    poolData?.id,
    poolData?.descriptionURL
  )

  const [{ priceUSD }] = usePoolPrice(poolAddress)

  const [baseToken] = useERC20Data(poolData?.baseToken)

  const [isTrader, setIsTrader] = useState(false)

  const [accountLPs, setAccountLPs] = useState(ZERO)

  const accountLPsPrice = useMemo(() => {
    if (accountLPs.isZero() || priceUSD.isZero()) return BigNumber.from(0)

    return multiplyBignumbers([accountLPs, 18], [priceUSD, 18])
  }, [priceUSD, accountLPs])

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

  const loader = useMemo(
    () => (
      <Center>
        <GuardSpinner size={20} loading />
      </Center>
    ),
    []
  )

  const [
    ,
    { totalPnlPercentage, totalPnlBase, totalUSDPnlPerc, totalUSDPnlUSD },
  ] = usePoolPnlInfo(poolData.id)

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
  ] = usePoolLockedFunds(poolData, poolInfo, baseToken)

  const [tf, setTf] = useState(TIMEFRAME.d)
  const [
    poolLockedFundHistoryChartData,
    isPoolLockedFundHistoryChartDataFetching,
  ] = usePoolLockedFundsHistory(poolData.id, tf)

  const creationTime = useMemo(() => {
    if (!!poolData) {
      return format(expandTimestamp(poolData.creationTime), DATE_FORMAT)
    }

    return "-"
  }, [poolData])

  const minimalInvestment = useMemo(() => {
    if (!poolInfo || !baseToken) return "0"

    const res = formatEther(poolInfo.parameters.minimalInvestment)

    return `${res} ${baseToken.symbol}`
  }, [poolInfo, baseToken])

  const emission = useMemo(() => {
    if (!poolInfo) return { unlimited: true, value: BigNumber.from(0) }

    const value = poolInfo.parameters.totalLPEmission

    const unlimited = value.isZero()

    return { unlimited, value: value }
  }, [poolInfo])

  const emissionLeft = useMemo(() => {
    if (!poolInfo || emission.unlimited)
      return {
        percentage: 0,
        value: BigNumber.from(0),
      }

    const total = poolInfo.parameters.totalLPEmission
    const used = poolInfo.lpSupply.add(poolInfo.lpLockedInProposals)

    const dif = total.sub(used)

    function percentage(used, total) {
      return (used / total) * 100
    }

    const percent = percentage(
      Number(formatEther(used)).toFixed(2),
      Number(formatEther(total)).toFixed(2)
    )

    return {
      percentage: percent,
      value: dif,
    }
  }, [poolInfo, emission])

  const adminsCount = useMemo(
    () => (poolData ? poolData.admins.length : 0),
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

  const sortino = usePoolSortino(poolData.id, sortinoTokens)

  const investorsCount = Number(poolData?.investorsCount) || 0

  const openPositionsLen = Number(poolInfo?.openPositions.length) || 0

  const orderSize = useMemo(() => {
    if (!poolData) return BigNumber.from(0)

    return poolData.orderSize
  }, [poolData])

  const dailyProfit = useMemo(() => {
    if (!poolData) return "0"

    const days = getDay(expandTimestamp(poolData.creationTime))
    if (days === 0) return "0"

    const priceLP = getPriceLP(poolData.priceHistory)
    const pnl = getPNL(priceLP)

    return (Number(pnl) / days).toFixed(2)
  }, [poolData])

  const timePosition = useMemo(() => {
    if (!poolData) return ""
    const date = new Date(poolData.averagePositionTime * 1000)
    return `${date.getUTCHours()}H`
  }, [poolData])

  const sortinoETH = useMemo(() => {
    if (!sortino) return <>♾️</>

    return Number([sortino[sortinoTokens[0]]]).toFixed(2)
  }, [sortino, sortinoTokens])

  const sortinoBTC = useMemo(() => {
    if (!sortino) return <>♾️</>

    return Number([sortino[sortinoTokens[1]]]).toFixed(2)
  }, [sortino, sortinoTokens])

  const totalTrades = useMemo(() => {
    if (!poolData) return "0"

    return poolData.totalTrades
  }, [poolData])

  const maxLoss = useMemo(() => {
    if (!poolData) return BigNumber.from(0)

    return BigNumber.from(poolData.maxLoss)
  }, [poolData])

  return (
    <WithPoolAddressValidation poolAddress={poolAddress ?? ""} loader={loader}>
      <PoolProfileContext.Provider
        value={{
          poolData,
          poolMetadata,
          baseToken,
          priceLP,
          tvl,
          apy,
          pnl,
          pnl24h,
          depositors,
          isTrader,
          accountLPsPrice,
          poolInfo: poolInfo as IPoolInfo,

          totalPnlPercentage,
          totalPnlBase,
          totalUSDPnlPerc,
          totalUSDPnlUSD,

          baseSymbol,
          totalPoolUSD,
          traderFundsUSD,
          traderFundsBase,
          investorsFundsUSD,
          investorsFundsBase,
          poolUsedInPositionsUSD,
          poolUsedToTotalPercentage,
          tf,
          setTf,
          poolLockedFundHistoryChartData,
          isPoolLockedFundHistoryChartDataFetching,

          creationTime,
          minimalInvestment,
          emission,
          emissionLeft,
          adminsCount,
          whitelistCount,
          commissionPercentage,

          sortino,
          investorsCount,
          openPositionsLen,
          orderSize,
          dailyProfit,
          timePosition,
          sortinoETH,
          sortinoBTC,
          totalTrades,
          maxLoss,
        }}
      >
        {children}
      </PoolProfileContext.Provider>
    </WithPoolAddressValidation>
  )
}

export default PoolProfileContextProvider
