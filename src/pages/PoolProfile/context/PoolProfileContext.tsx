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
import { usePoolContract, usePoolPrice, usePoolStatistics } from "hooks"
import { useERC20Data } from "state/erc20/hooks"
import { ZERO } from "consts"
import { multiplyBignumbers } from "utils/formulas"
import { normalizeBigNumber } from "utils"
import WithPoolAddressValidation from "components/WithPoolAddressValidation"
import { Center } from "theme"
import { GuardSpinner } from "react-spinners-kit"
import { IPoolInfo } from "interfaces/contracts/ITraderPool"

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
    if (accountLPs.isZero() || priceUSD.isZero()) {
      return "0.0"
    }
    const BN = multiplyBignumbers([accountLPs, 18], [priceUSD, 18])
    return normalizeBigNumber(BN, 18, 2)
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

  console.log("context", poolData)

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
        }}
      >
        {children}
      </PoolProfileContext.Provider>
    </WithPoolAddressValidation>
  )
}

export default PoolProfileContextProvider
