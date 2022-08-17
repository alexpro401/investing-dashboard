import { useCallback, useEffect, useMemo, useState, MouseEvent } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { formatEther, parseEther, parseUnits } from "@ethersproject/units"
import { BigNumber, FixedNumber } from "@ethersproject/bignumber"
import { createClient, Provider as GraphProvider } from "urql"
import { format } from "date-fns/esm"

import { PriceFeed } from "abi"
import { useActiveWeb3React } from "hooks"
import { DATE_FORMAT } from "constants/time"
import usePoolPrice from "hooks/usePoolPrice"
import { percentageOfBignumbers } from "utils/formulas"
import useFundFeeHistory from "hooks/useFundFeeHistory"
import useContract, { useERC20 } from "hooks/useContract"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import { IInvestorProposal } from "constants/interfaces_v2"
import useTokenPriceOutUSD from "hooks/useTokenPriceOutUSD"
import { usePoolContract, useTraderPool } from "hooks/usePool"
import { selectPriceFeedAddress } from "state/contracts/selectors"
import { expandTimestamp, formatBigNumber, normalizeBigNumber } from "utils"

import { Flex } from "theme"
import Icon from "components/Icon"
import TokenIcon from "components/TokenIcon"
import AmountRow from "components/Amount/Row"
import PositionTrade from "components/PositionTrade"

import { accordionSummaryVariants } from "motion/variants"
import SharedS, { BodyItem, Actions } from "components/cards/position/styled"
import S from "./styled"

interface Props {
  position: IInvestorProposal
}

const poolsClient = createClient({
  url: process.env.REACT_APP_ALL_POOLS_API_URL || "",
})

const InvestPositionCard: React.FC<Props> = ({ position }) => {
  const navigate = useNavigate()
  const { account } = useActiveWeb3React()
  const traderPool = useTraderPool(position.pool.id)
  const [, poolInfo] = usePoolContract(position.pool.id)
  const { priceBase, priceUSD } = usePoolPrice(position.pool.id)
  const [, baseToken] = useERC20(position.pool.token)
  const priceFeedAddress = useSelector(selectPriceFeedAddress)
  const priceFeed = useContract(priceFeedAddress, PriceFeed)

  const [{ poolMetadata }] = usePoolMetadata(
    position.pool.id,
    poolInfo?.parameters.descriptionURL
  )

  const [markPriceOpen, setMarkPriceOpenOpen] = useState(BigNumber.from(0))
  const markPriceOpenUSD = useTokenPriceOutUSD({
    tokenAddress: position.pool.token,
  })
  const [pnlUSDCurrent, setPnlUSDCurrent] = useState<BigNumber>(
    BigNumber.from("0")
  )
  const [commissionUnlockTimestamp, setCommissionUnlockTimestamp] =
    useState<BigNumber>(BigNumber.from("0"))

  const [owedBaseCommission, setOwedBaseCommission] = useState<BigNumber>(
    BigNumber.from("0")
  )
  const [commissionAmountUSD, setCommissionAmountUSD] = useState<{
    big: BigNumber
    format: string
  }>({ big: BigNumber.from("0"), format: "0" })

  const [_totalAccountInvestedLP, _setTotalAccountInvestedLP] =
    useState<BigNumber>(BigNumber.from("0"))

  const [showExtra, setShowExtra] = useState<boolean>(false)
  const [showPositions, setShowPositions] = useState<boolean>(false)
  const [showComission, setShowComission] = useState<boolean>(false)
  const toggleExtraContent = useCallback(() => {
    if (position.isClosed) {
      setShowPositions(!showPositions)
    } else {
      if (showPositions) {
        setShowPositions(false)
      }
      if (showComission) {
        setShowComission(false)
      }
    }
    setShowExtra(!showExtra)
  }, [showExtra, position.isClosed, showComission, showPositions])

  const togglePositions = useCallback(() => {
    if (!showPositions && showComission) {
      setShowComission(false)
    }
    setShowPositions(!showPositions)
  }, [showComission, showPositions])

  const toggleComission = useCallback(() => {
    if (!showComission && showPositions) {
      setShowPositions(false)
    }
    setShowComission(!showComission)
  }, [showComission, showPositions])

  const baseTokenSymbol = useMemo<string>(() => {
    if (!baseToken || !baseToken.symbol) {
      return ""
    }
    return baseToken.symbol
  }, [baseToken])

  const positionOpenLPAmount = useMemo<string>(() => {
    if (!position.totalLPInvestVolume || !position.totalLPDivestVolume) {
      return "0"
    }

    if (position.isClosed) {
      return normalizeBigNumber(position.totalLPInvestVolume, 18, 6)
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

      return normalizeBigNumber(parseEther(res._value), 18, 6)
    }
  }, [position])

  const entryPriceBase = useMemo<BigNumber>(() => {
    if (!position) return BigNumber.from("0")

    const baseFixed = FixedNumber.fromValue(position.totalBaseInvestVolume, 18)
    const lpFixed = FixedNumber.fromValue(position.totalLPInvestVolume, 18)
    const resFixed = baseFixed.divUnsafe(lpFixed)

    return parseEther(resFixed._value)
  }, [position])

  const entryPriceUSD = useMemo<BigNumber>(() => {
    if (!position) return BigNumber.from("0")

    const usdFixed = FixedNumber.fromValue(position.totalUSDInvestVolume, 18)
    const lpFixed = FixedNumber.fromValue(position.totalLPInvestVolume, 18)
    const resFixed = usdFixed.divUnsafe(lpFixed)

    return parseEther(resFixed._value)
  }, [position])

  const markPriceBase = useMemo(() => {
    if (!position) BigNumber.from("0")

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
      return BigNumber.from("0")
    }

    const { isClosed, totalUSDDivestVolume, totalLPDivestVolume } = position

    if (isClosed) {
      const usdFixed = FixedNumber.fromValue(totalUSDDivestVolume, 18)
      const lpFixed = FixedNumber.fromValue(totalLPDivestVolume, 18)
      const resFixed = usdFixed.divUnsafe(lpFixed)

      return parseEther(resFixed._value)
    }

    return markPriceOpenUSD
  }, [markPriceOpenUSD, position])

  const pnlPercentage = useMemo(() => {
    if (!markPriceBase || !entryPriceBase)
      return { value: BigNumber.from("0"), normalized: "0" }

    const percentage = percentageOfBignumbers(markPriceBase, entryPriceBase)
    const resultFixed = FixedNumber.fromValue(percentage, 18).subUnsafe(
      FixedNumber.from("100", 18)
    )

    return {
      value: parseEther(resultFixed._value),
      normalized: normalizeBigNumber(parseEther(resultFixed._value), 18, 2),
    }
  }, [markPriceBase, entryPriceBase])

  const pnlBase = useMemo(() => {
    if (!position || !pnlPercentage) {
      return BigNumber.from("0")
    }

    const _pnlPercentage = FixedNumber.fromValue(pnlPercentage.value, 18)

    const _totalBaseInvestVolume = FixedNumber.fromValue(
      position.totalBaseInvestVolume,
      18
    )
    const _totalBaseDivestVolume = FixedNumber.fromValue(
      position.totalBaseDivestVolume,
      18
    )

    const _totalBaseVolumeFixed = position.isClosed
      ? _totalBaseDivestVolume
      : _totalBaseInvestVolume.subUnsafe(_totalBaseDivestVolume) // current base open volume

    const _pnlBaseFixed = _totalBaseVolumeFixed.mulUnsafe(_pnlPercentage)
    const res = _totalBaseVolumeFixed.addUnsafe(_pnlBaseFixed)

    return parseEther(res._value)
  }, [pnlPercentage, position])

  const pnlUSD = useMemo(() => {
    if (!position || !markPriceUSD || !entryPriceUSD) return BigNumber.from("0")

    if (!position.isClosed) {
      return pnlUSDCurrent
    }

    const _markPriceFixed = FixedNumber.fromValue(markPriceUSD, 18)
    const _entryPriceUSDFixed = FixedNumber.fromValue(entryPriceUSD, 18)

    const res = _markPriceFixed.subUnsafe(_entryPriceUSDFixed)

    return parseEther(res._value)
  }, [entryPriceUSD, markPriceUSD, pnlUSDCurrent, position])

  // Commission data

  /**
   * Pool commission percentage
   */
  const commissionPercentage = useMemo(() => {
    if (!poolInfo || !poolInfo.parameters) {
      return "0"
    }

    return normalizeBigNumber(poolInfo.parameters.commissionPercentage, 25, 0)
  }, [poolInfo])

  /**
   * Next commission epoch starts
   */
  const commissionUnlockDate = useMemo<string>(() => {
    if (commissionUnlockTimestamp.isZero()) return "-"
    return format(
      expandTimestamp(+commissionUnlockTimestamp.toString()),
      DATE_FORMAT
    )
  }, [commissionUnlockTimestamp])

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
      return { big: BigNumber.from("0"), format: "0" }
    }

    const usd = FixedNumber.fromValue(priceUSD, 18)
    const lp = FixedNumber.fromValue(_totalAccountInvestedLP, 18)
    const res = usd.mulUnsafe(lp)

    return {
      big: parseEther(res._value),
      format: formatBigNumber(parseEther(res._value), 18, 2),
    }
  }, [_totalAccountInvestedLP, priceUSD])

  /**
   * Total investments in pool (in baseToken)
   */
  const totalPoolInvestmentsUSD = useMemo<{
    big: BigNumber
    format: string
  }>(() => {
    if (!poolInfo || !priceUSD || priceUSD.isZero()) {
      return { big: BigNumber.from("0"), format: "0" }
    }
    const usd = FixedNumber.fromValue(priceUSD, 18)
    const supply = FixedNumber.fromValue(poolInfo.lpSupply, 18)
    const traderLP = FixedNumber.fromValue(poolInfo.traderLPBalance, 18)

    const res = usd.mulUnsafe(supply.subUnsafe(traderLP))

    return {
      big: parseEther(res._value),
      format: formatBigNumber(parseEther(res._value), 18, 2),
    }
  }, [poolInfo, priceUSD])

  /**
   * Total account locked in pool amount in percents
   */
  const fundsLockedInvestorPercentage = useMemo(() => {
    if (
      !fundsLockedInvestorUSD ||
      fundsLockedInvestorUSD.big.isZero() ||
      !totalPoolInvestmentsUSD ||
      totalPoolInvestmentsUSD.big.isZero()
    ) {
      return "0"
    }
    const percent = percentageOfBignumbers(
      fundsLockedInvestorUSD.big,
      totalPoolInvestmentsUSD.big
    )
    return formatBigNumber(percent, 18, 2)
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
          if (pnlBase.lt(BigNumber.from("0"))) {
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
          setCommissionUnlockTimestamp(usersData[0].commissionUnlockTimestamp)
          setOwedBaseCommission(usersData[0].owedBaseCommission)
          _setTotalAccountInvestedLP(usersData[0].poolLPBalance)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [traderPool, position, account])

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
          setCommissionAmountUSD({
            big: price.amountOut,
            format: formatBigNumber(price.amountOut, 18, 2),
          })
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [baseToken, owedBaseCommission, priceFeed])

  const onBuyMore = (e?: MouseEvent<HTMLElement>): void => {
    if (e) {
      e.stopPropagation()
    }
    navigate(`/pool/invest/${position.pool.id}`)
  }

  const onClosePosition = (e?: MouseEvent<HTMLElement>): void => {
    if (e) {
      e.stopPropagation()
    }
    navigate(`/pool/ivest/${position.pool.id}`)
  }

  const actions = [
    {
      label: "All trades",
      active: showPositions,
      onClick: togglePositions,
    },
    {
      label: "Buy more",
      onClick: onBuyMore,
    },
    {
      label: "Comission",
      active: showComission,
      onClick: toggleComission,
    },
    {
      label: "Close",
      onClick: onClosePosition,
    },
  ]

  return (
    <>
      <SharedS.Container>
        <SharedS.Card onClick={toggleExtraContent}>
          <SharedS.Head>
            <Flex ai="center">
              <Icon
                m="0"
                size={24}
                source={poolMetadata?.assets[poolMetadata?.assets.length - 1]}
                address={position.pool.id}
              />
              <S.Amount>{positionOpenLPAmount}</S.Amount>
              <S.PositionSymbol>{poolInfo?.ticker}</S.PositionSymbol>
              <SharedS.PNL amount={+pnlPercentage.normalized}>
                {Number(pnlPercentage.normalized) > 0 && "+"}
                {pnlPercentage.normalized}%
              </SharedS.PNL>
            </Flex>
            <Flex>
              <S.FundSymbol>{baseTokenSymbol}</S.FundSymbol>
              <TokenIcon address={baseToken?.address} m="0" size={24} />
            </Flex>
          </SharedS.Head>

          <SharedS.Body>
            <BodyItem
              label={"Entry Price " + baseTokenSymbol}
              amount={entryPriceBase}
              amountUSD={entryPriceUSD}
            />
            <BodyItem
              label={
                (position.isClosed ? "Closed price " : "Current price ") +
                baseTokenSymbol
              }
              amount={markPriceBase}
              amountUSD={markPriceUSD}
            />
            <BodyItem
              label={`P&L ${baseTokenSymbol}`}
              amount={pnlBase}
              pnl={pnlPercentage.value}
              amountUSD={pnlUSD}
              ai="flex-end"
            />
          </SharedS.Body>
        </SharedS.Card>

        <AnimatePresence>
          {!position.isClosed && (
            <Actions actions={actions} visible={showExtra} />
          )}
        </AnimatePresence>

        <SharedS.ExtraItem
          initial="hidden"
          animate={showPositions ? "visible" : "hidden"}
          variants={accordionSummaryVariants}
        >
          {position.vest && position.vest.length > 0 ? (
            <SharedS.TradesList>
              {position.vest.map((v) => (
                <PositionTrade
                  key={v.id}
                  isBuy={v.isInvest}
                  timestamp={v.timestamp}
                  amount={v.volumeBase}
                  priceBase={v.volumeLP}
                  priceUsd={v.volumeUSD}
                  baseTokenSymbol={baseTokenSymbol}
                  data={v}
                />
              ))}
            </SharedS.TradesList>
          ) : (
            <Flex full jc="center" p="12px 0">
              <SharedS.WitoutData>No trades</SharedS.WitoutData>
            </Flex>
          )}
        </SharedS.ExtraItem>
        <SharedS.ExtraItem
          initial="hidden"
          animate={showComission ? "visible" : "hidden"}
          variants={accordionSummaryVariants}
          p="16px"
        >
          <AmountRow
            title={`${commissionPeriod} month Performance Fee`}
            value={`${commissionPercentage}%`}
          />
          <AmountRow
            m="14px 0 0"
            title="Paid Performance Fee  "
            value={`$${commissionAmountUSD.format}`}
          />
          <AmountRow
            full
            m="14px 0 0"
            title="Date of withdrawal"
            value={commissionUnlockDate}
          />
          <AmountRow
            m="14px 0 0"
            title={`Investor funds locked (${fundsLockedInvestorPercentage}%)`}
            value={`$${fundsLockedInvestorUSD.format}/$${totalPoolInvestmentsUSD.format}`}
          />
        </SharedS.ExtraItem>
      </SharedS.Container>
    </>
  )
}

const InvestPositionCardWithProvider = (props) => {
  return (
    <GraphProvider value={poolsClient}>
      <InvestPositionCard {...props} />
    </GraphProvider>
  )
}

export default InvestPositionCardWithProvider
