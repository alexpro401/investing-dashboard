import { useCallback, useEffect, useMemo, useState, MouseEvent } from "react"
import { useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { parseEther, parseUnits } from "@ethersproject/units"
import { BigNumber, FixedNumber } from "@ethersproject/bignumber"
import { format } from "date-fns/esm"

import { ZERO } from "consts"
import { useActiveWeb3React, useBreakpoints } from "hooks"
import { DATE_FORMAT } from "consts/time"
import usePoolPrice from "hooks/usePoolPrice"
import { useERC20Data } from "state/erc20/hooks"
import {
  multiplyBignumbers,
  percentageOfBignumbers,
  subtractBignumbers,
} from "utils/formulas"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import useTokenPriceOutUSD from "hooks/useTokenPriceOutUSD"
import { usePoolContract } from "hooks/usePool"
import { usePriceFeedContract, useTraderPoolContract } from "contracts"
import { IInvestorProposal } from "interfaces/thegraphs/invest-pools"
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

const InvestPositionCard: React.FC<Props> = ({ position }) => {
  const navigate = useNavigate()
  const { account } = useActiveWeb3React()
  const traderPool = useTraderPoolContract(position.pool.id)
  const [, poolInfo] = usePoolContract(position.pool.id)
  const [{ priceUSD }] = usePoolPrice(position.pool.id)
  const [baseToken] = useERC20Data(position.pool.token)
  const priceFeed = usePriceFeedContract()

  const [{ poolMetadata }] = usePoolMetadata(
    position.pool.id,
    poolInfo?.parameters.descriptionURL
  )

  const isTrader = useMemo<boolean>(() => {
    if (!account || !poolInfo) return false
    return account === poolInfo.parameters.trader
  }, [account, poolInfo])

  const [markPriceOpen, setMarkPriceOpenOpen] = useState(ZERO)
  const markPriceOpenUSD = useTokenPriceOutUSD({
    tokenAddress: position.pool.token,
  })
  const [, setPnlUSDCurrent] = useState<BigNumber>(ZERO)
  const [commissionUnlockTimestamp, setCommissionUnlockTimestamp] =
    useState<BigNumber>(ZERO)

  const [owedBaseCommission, setOwedBaseCommission] = useState<BigNumber>(ZERO)
  const [commissionAmountUSD, setCommissionAmountUSD] =
    useState<BigNumber>(ZERO)

  const [_totalAccountInvestedLP, _setTotalAccountInvestedLP] =
    useState<BigNumber>(ZERO)

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

  const positionOpenLPAmount = useMemo<BigNumber>(() => {
    if (!position.totalLPInvestVolume || !position.totalLPDivestVolume) {
      return ZERO
    }

    if (position.isClosed) {
      return position.totalLPInvestVolume
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
    if (!position) ZERO

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

    return markPriceOpenUSD
  }, [markPriceOpenUSD, position])

  const pnlPercentage = useMemo(() => {
    if (!markPriceBase || !entryPriceBase)
      return { value: ZERO, normalized: "0" }

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
   * Next commission epoch starts
   */
  const commissionUnlockDate = useMemo<string>(() => {
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
      return "0"
    }
    const percent = percentageOfBignumbers(
      fundsLockedInvestorUSD,
      totalPoolInvestmentsUSD
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

  const onNavigateTerminal = (e?: MouseEvent<HTMLElement>): void => {
    if (e) {
      e.stopPropagation()
    }
    navigate(`/pool/invest/${position.pool.id}`)
  }

  const actions = [
    {
      label: "All trades",
      active: showPositions,
      onClick: togglePositions,
    },
    {
      label: "Buy more",
      onClick: onNavigateTerminal,
    },
    {
      label: "Comission",
      active: showComission,
      onClick: toggleComission,
    },
    {
      label: "Close",
      onClick: onNavigateTerminal,
    },
  ]

  const { isDesktop } = useBreakpoints()

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
              {!isDesktop && (
                <S.Amount>
                  {normalizeBigNumber(positionOpenLPAmount, 18, 6)}
                </S.Amount>
              )}
              <S.PositionSymbol>{poolInfo?.ticker}</S.PositionSymbol>
              <SharedS.PNL value={pnlPercentage.normalized}>
                {Number(pnlPercentage.normalized) > 0 && "+"}
                {pnlPercentage.normalized}%
              </SharedS.PNL>
            </Flex>
            <Flex>
              <S.FundSymbol>{baseTokenSymbol}</S.FundSymbol>
              {isDesktop && (
                <S.Amount>
                  {normalizeBigNumber(positionOpenLPAmount, 18, 6)}
                </S.Amount>
              )}
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
            value={`${normalizeBigNumber(commissionPercentage, 25, 0)}%`}
          />
          <AmountRow
            m="14px 0 0"
            title="Paid Performance Fee  "
            value={`$${formatBigNumber(commissionAmountUSD, 18, 2)}`}
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
            value={`$${formatBigNumber(
              fundsLockedInvestorUSD,
              18,
              2
            )}/$${formatBigNumber(totalPoolInvestmentsUSD, 18, 2)}`}
          />
        </SharedS.ExtraItem>
      </SharedS.Container>
    </>
  )
}

export default InvestPositionCard
