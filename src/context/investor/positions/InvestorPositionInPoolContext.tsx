import React, { createContext, useState, useEffect, useMemo } from "react"
import { InvestorPosition } from "interfaces/thegraphs/invest-pools"
import { usePoolContract } from "hooks"
import { usePriceFeedContract, useTraderPoolContract } from "contracts"
import usePoolPrice from "hooks/usePoolPrice"
import { useERC20Data } from "state/erc20/hooks"
import useTokenPriceOutUSD from "hooks/useTokenPriceOutUSD"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import { ZERO } from "consts"
import { BigNumber, FixedNumber } from "@ethersproject/bignumber"
import { parseEther, parseUnits } from "@ethersproject/units"
import {
  multiplyBignumbers,
  percentageOfBignumbers,
  subtractBignumbers,
} from "utils/formulas"
import { useWeb3React } from "@web3-react/core"
import { IPoolInfo } from "interfaces/contracts/ITraderPool"
import { Token } from "interfaces"
import { IPoolMetadata } from "state/ipfsMetadata/types"

interface IInvestorPositionInPoolContext {
  position: InvestorPosition
  poolInfo: IPoolInfo | null
  baseToken: Token | null
  poolMetadata: IPoolMetadata | null
  pnlPercentage: BigNumber
  positionOpenLPAmount: BigNumber
  positionOpenLPAmountUSD: BigNumber
  entryPriceBase: BigNumber
  entryPriceUSD: BigNumber
  markPriceBase: BigNumber
  markPriceUSD: BigNumber
  pnlBase: BigNumber
  pnlUSD: BigNumber
  commission: {
    period: string
    percentage: BigNumber
    amountUSD: BigNumber
    unlockTimestamp: BigNumber
  }
  fundsLockedInvestorPercentage: BigNumber
  fundsLockedInvestorUSD: BigNumber
  totalPoolInvestmentsUSD: BigNumber
}

export const InvestorPositionInPoolContext =
  createContext<IInvestorPositionInPoolContext>({
    position: {} as InvestorPosition,
    poolInfo: null,
    baseToken: null,
    poolMetadata: null,
    pnlPercentage: ZERO,
    positionOpenLPAmount: ZERO,
    positionOpenLPAmountUSD: ZERO,
    entryPriceBase: ZERO,
    entryPriceUSD: ZERO,
    markPriceBase: ZERO,
    markPriceUSD: ZERO,
    pnlBase: ZERO,
    pnlUSD: ZERO,
    commission: {
      period: "",
      percentage: ZERO,
      amountUSD: ZERO,
      unlockTimestamp: ZERO,
    },
    fundsLockedInvestorPercentage: ZERO,
    fundsLockedInvestorUSD: ZERO,
    totalPoolInvestmentsUSD: ZERO,
  })

interface IInvestorPositionInPoolContextProviderProps {
  children: React.ReactNode
  position: InvestorPosition
}

const InvestorPositionInPoolContextProvider: React.FC<
  IInvestorPositionInPoolContextProviderProps
> = ({ children, position }) => {
  const { account } = useWeb3React()
  const traderPool = useTraderPoolContract(position.pool.id)
  const [, poolInfo] = usePoolContract(position.pool.id)
  const [{ priceUSD }] = usePoolPrice(position.pool.id)
  const [baseToken] = useERC20Data(position.pool.token)
  const priceFeed = usePriceFeedContract()

  const tokenCurrentPriceUSD = useTokenPriceOutUSD({
    tokenAddress: position.pool.token,
  })

  const [{ poolMetadata }] = usePoolMetadata(
    position.pool.id,
    poolInfo?.parameters.descriptionURL
  )

  const isTrader = useMemo<boolean>(() => {
    if (!account || !poolInfo) return false
    return account === poolInfo.parameters.trader
  }, [account, poolInfo])

  const [markPriceOpen, setMarkPriceOpenOpen] = useState(ZERO)

  const [, setPnlUSDCurrent] = useState<BigNumber>(ZERO)
  const [commissionUnlockTimestamp, setCommissionUnlockTimestamp] =
    useState<BigNumber>(ZERO)

  const [owedBaseCommission, setOwedBaseCommission] = useState<BigNumber>(ZERO)
  const [commissionAmountUSD, setCommissionAmountUSD] =
    useState<BigNumber>(ZERO)

  const [_totalAccountInvestedLP, _setTotalAccountInvestedLP] =
    useState<BigNumber>(ZERO)

  const positionOpenLPAmount = useMemo<BigNumber>(() => {
    if (!position.totalLPInvestVolume || !position.totalLPDivestVolume) {
      return ZERO
    }

    if (position.isClosed) {
      return BigNumber.from(position.totalLPInvestVolume)
    } else {
      const investFixed = FixedNumber.fromValue(
        position.totalLPInvestVolume,
        18
      )
      const divestFixed = FixedNumber.fromValue(
        position.totalLPDivestVolume,
        18
      )
      const res = investFixed.subUnsafe(divestFixed)

      return parseEther(res._value)
    }
  }, [position])

  const positionOpenLPAmountUSD = useMemo<BigNumber>(() => {
    if (positionOpenLPAmount.isZero() || tokenCurrentPriceUSD.isZero()) {
      return ZERO
    }

    return multiplyBignumbers(
      [positionOpenLPAmount, 18],
      [tokenCurrentPriceUSD, 18]
    )
  }, [positionOpenLPAmount, tokenCurrentPriceUSD])

  const entryPriceBase = useMemo<BigNumber>(() => {
    if (!position) return ZERO

    const baseFixed = FixedNumber.fromValue(position.totalBaseInvestVolume, 18)
    const lpFixed = FixedNumber.fromValue(position.totalLPInvestVolume, 18)
    const resFixed = baseFixed.divUnsafe(lpFixed)

    return parseEther(resFixed._value)
  }, [position])

  const entryPriceUSD = useMemo<BigNumber>(() => {
    if (!position) return ZERO

    const usdFixed = FixedNumber.fromValue(position.totalUSDInvestVolume, 18)
    const lpFixed = FixedNumber.fromValue(position.totalLPInvestVolume, 18)
    const resFixed = usdFixed.divUnsafe(lpFixed)

    return parseEther(resFixed._value)
  }, [position])

  const markPriceBase = useMemo(() => {
    if (!position) return ZERO

    const { isClosed, totalBaseDivestVolume, totalLPDivestVolume } = position

    if (isClosed) {
      const baseDivestFixed = FixedNumber.fromValue(totalBaseDivestVolume, 18)
      const lpDivestFixed = FixedNumber.fromValue(totalLPDivestVolume, 18)
      const resFixed = baseDivestFixed.divUnsafe(lpDivestFixed)

      return parseEther(resFixed._value)
    }

    return markPriceOpen
  }, [markPriceOpen, position])

  const markPriceUSD = useMemo(() => {
    if (!position) {
      return ZERO
    }

    const { isClosed, totalUSDDivestVolume, totalLPDivestVolume } = position

    if (isClosed) {
      const usdFixed = FixedNumber.fromValue(totalUSDDivestVolume, 18)
      const lpFixed = FixedNumber.fromValue(totalLPDivestVolume, 18)
      const resFixed = usdFixed.divUnsafe(lpFixed)

      return parseEther(resFixed._value)
    }

    return tokenCurrentPriceUSD
  }, [tokenCurrentPriceUSD, position])

  const pnlPercentage = useMemo(() => {
    if (!markPriceBase || !entryPriceBase) return ZERO

    const percentage = percentageOfBignumbers(markPriceBase, entryPriceBase)
    const resultFixed = FixedNumber.fromValue(percentage, 18).subUnsafe(
      FixedNumber.from("100", 18)
    )

    return parseEther(resultFixed._value)
  }, [markPriceBase, entryPriceBase])

  const pnlBase = useMemo(() => {
    if (!markPriceBase || !entryPriceBase || !positionOpenLPAmount) {
      return ZERO
    }

    const priceDiff = subtractBignumbers(
      [markPriceBase, 18],
      [entryPriceBase, 18]
    )

    return multiplyBignumbers([priceDiff, 18], [positionOpenLPAmount, 18])
  }, [markPriceBase, entryPriceBase, positionOpenLPAmount])

  const pnlUSD = useMemo(() => {
    if (!markPriceUSD || !entryPriceUSD || !positionOpenLPAmount) {
      return ZERO
    }

    const priceDiff = subtractBignumbers(
      [markPriceUSD, 18],
      [entryPriceUSD, 18]
    )

    return multiplyBignumbers([priceDiff, 18], [positionOpenLPAmount, 18])
  }, [entryPriceUSD, markPriceUSD, positionOpenLPAmount])

  // Commission data

  /**
   * InvestedFund commission percentage
   */
  const commissionPercentage = useMemo(() => {
    if (!poolInfo || !poolInfo.parameters) {
      return ZERO
    }

    return poolInfo.parameters.commissionPercentage
  }, [poolInfo])

  /**
   * Commission period (show in month)
   */
  const commissionPeriod = useMemo(() => {
    if (!poolInfo || !poolInfo.parameters) {
      return ""
    }

    switch (poolInfo.parameters.commissionPeriod) {
      case 0:
        return "1"
      case 1:
        return "3"
      case 2:
        return "12"
      default:
        return ""
    }
  }, [poolInfo])

  /**
   * Total account locked in pool amount in baseToken
   */
  const fundsLockedInvestorUSD = useMemo(() => {
    if (
      !priceUSD ||
      !_totalAccountInvestedLP ||
      priceUSD.isZero() ||
      _totalAccountInvestedLP.isZero()
    ) {
      return ZERO
    }

    const usd = FixedNumber.fromValue(priceUSD, 18)
    const lp = FixedNumber.fromValue(_totalAccountInvestedLP, 18)
    const res = usd.mulUnsafe(lp)

    return parseEther(res._value)
  }, [_totalAccountInvestedLP, priceUSD])

  /**
   * Total investments in pool (in baseToken)
   */
  const totalPoolInvestmentsUSD = useMemo<BigNumber>(() => {
    if (!poolInfo || !priceUSD || priceUSD.isZero()) {
      return ZERO
    }

    if (isTrader) {
      return fundsLockedInvestorUSD
    }

    const usd = FixedNumber.fromValue(priceUSD, 18)
    const supply = FixedNumber.fromValue(poolInfo.lpSupply, 18)
    const traderLP = FixedNumber.fromValue(poolInfo.traderLPBalance, 18)

    const res = usd.mulUnsafe(supply.subUnsafe(traderLP))

    return parseEther(res._value)
  }, [fundsLockedInvestorUSD, isTrader, poolInfo, priceUSD])

  /**
   * Total account locked in pool amount in percents
   */
  const fundsLockedInvestorPercentage = useMemo(() => {
    if (
      !fundsLockedInvestorUSD ||
      fundsLockedInvestorUSD.isZero() ||
      !totalPoolInvestmentsUSD ||
      totalPoolInvestmentsUSD.isZero()
    ) {
      return ZERO
    }

    return percentageOfBignumbers(
      fundsLockedInvestorUSD,
      totalPoolInvestmentsUSD
    )
  }, [fundsLockedInvestorUSD, totalPoolInvestmentsUSD])

  // get mark price in base token
  useEffect(() => {
    if (
      !priceFeed ||
      !position ||
      !position.pool ||
      !baseToken ||
      !baseToken.address
    ) {
      return
    }

    ;(async () => {
      try {
        const amount = parseUnits("1", 18)

        // without extended
        const price = await priceFeed.getNormalizedExtendedPriceOut(
          position.pool.token,
          baseToken.address,
          amount,
          []
        )
        if (price && price.amountOut) {
          setMarkPriceOpenOpen(price.amountOut)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [priceFeed, baseToken, position.pool.token, position])

  // fetch pnl price in USD
  useEffect(() => {
    if (!priceFeed || !pnlBase || !baseToken) return
    ;(async () => {
      try {
        const price = await priceFeed.getNormalizedPriceOutUSD(
          baseToken.address,
          pnlBase.abs().toHexString()
        )

        if (price?.amountOut) {
          if (pnlBase.lt(ZERO)) {
            const res = FixedNumber.fromValue(price.amountOut, 18).mulUnsafe(
              FixedNumber.from("-1")
            )
            setPnlUSDCurrent(parseEther(res._value))
          } else {
            setPnlUSDCurrent(price.amountOut)
          }
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [baseToken, pnlBase, priceFeed])

  // Fetch users info
  useEffect(() => {
    if (!traderPool || !position || !account) return
    ;(async () => {
      try {
        const usersData = await traderPool.getUsersInfo(account, 0, 0)
        if (usersData && !!usersData.length) {
          setCommissionUnlockTimestamp(
            usersData[isTrader ? 1 : 0].commissionUnlockTimestamp
          )
          setOwedBaseCommission(usersData[isTrader ? 1 : 0].owedBaseCommission)
          _setTotalAccountInvestedLP(usersData[isTrader ? 1 : 0].poolLPBalance)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [isTrader, traderPool, position, account])

  // fetch investor commission amount is usd
  useEffect(() => {
    if (!priceFeed || owedBaseCommission.isZero() || !baseToken) return
    ;(async () => {
      try {
        const price = await priceFeed.getNormalizedPriceOutUSD(
          baseToken.address,
          owedBaseCommission.toHexString()
        )
        if (price && price.amountOut) {
          setCommissionAmountUSD(price.amountOut)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [baseToken, owedBaseCommission, priceFeed])

  const providerValue = useMemo(
    () => ({
      position,
      poolInfo,
      baseToken,
      poolMetadata,
      pnlPercentage,
      positionOpenLPAmount,
      positionOpenLPAmountUSD,
      entryPriceBase,
      entryPriceUSD,
      markPriceBase,
      markPriceUSD,
      pnlBase,
      pnlUSD,
      commission: {
        period: commissionPeriod,
        percentage: commissionPercentage,
        amountUSD: commissionAmountUSD,
        unlockTimestamp: commissionUnlockTimestamp,
      },
      fundsLockedInvestorPercentage,
      fundsLockedInvestorUSD,
      totalPoolInvestmentsUSD,
    }),
    [
      position,
      poolInfo,
      baseToken,
      poolMetadata,
      pnlPercentage,
      positionOpenLPAmount,
      positionOpenLPAmountUSD,
      entryPriceBase,
      entryPriceUSD,
      markPriceBase,
      markPriceUSD,
      pnlBase,
      pnlUSD,
      commissionPeriod,
      commissionPercentage,
      commissionAmountUSD,
      commissionUnlockTimestamp,
      fundsLockedInvestorPercentage,
      fundsLockedInvestorUSD,
      totalPoolInvestmentsUSD,
    ]
  )

  return (
    <InvestorPositionInPoolContext.Provider value={providerValue}>
      {children}
    </InvestorPositionInPoolContext.Provider>
  )
}

export default InvestorPositionInPoolContextProvider
