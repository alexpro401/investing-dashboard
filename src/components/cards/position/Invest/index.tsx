import { useCallback, useEffect, useMemo, useState, MouseEvent } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { parseEther, parseUnits } from "@ethersproject/units"
import { BigNumber, FixedNumber } from "@ethersproject/bignumber"
import { createClient, Provider as GraphProvider } from "urql"

import { PriceFeed } from "abi"
import { IInvestorProposal } from "constants/interfaces_v2"
import useContract, { useERC20 } from "hooks/useContract"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import useTokenPriceOutUSD from "hooks/useTokenPriceOutUSD"
import { selectPriceFeedAddress } from "state/contracts/selectors"
import { usePoolContract } from "hooks/usePool"
import { normalizeBigNumber } from "utils"
import { percentageOfBignumbers } from "utils/formulas"
import useFundFeeHistory from "hooks/useFundFeeHistory"

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
  const [, poolInfo] = usePoolContract(position.pool.id)
  const fundFeeHistories = useFundFeeHistory(position.pool.id)
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
  const commissionPercentage = useMemo(() => {
    if (!poolInfo || !poolInfo.parameters) {
      return "0"
    }

    return normalizeBigNumber(poolInfo.parameters.commissionPercentage, 25, 0)
  }, [poolInfo])

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

  const commissionAmount = useMemo(() => {
    if (!fundFeeHistories || fundFeeHistories.length === 0) {
      return "0"
    }

    return normalizeBigNumber(fundFeeHistories[0].fundProfit, 18, 6)
  }, [fundFeeHistories])

  const commissionNextEpoch = useMemo(() => {
    if (!fundFeeHistories || fundFeeHistories.length === 0) {
      return "0"
    }

    return normalizeBigNumber(fundFeeHistories[0].day, 18, 6)
  }, [fundFeeHistories])

  const fundsLockedTotal = useMemo(() => {
    if (!poolInfo || !poolInfo.lpSupply || !poolInfo.lpLockedInProposals) {
      return "0"
    }

    const lpSupplyFixed = FixedNumber.fromValue(poolInfo.lpSupply, 18)
    const lpLockedInProposalsFixed = FixedNumber.fromValue(
      poolInfo.lpLockedInProposals,
      18
    )

    const resFixed = lpSupplyFixed.addUnsafe(lpLockedInProposalsFixed)

    return normalizeBigNumber(parseEther(resFixed._value), 18, 2)
  }, [poolInfo])

  const fundsLockedInvestor = useMemo(() => {
    if (!poolInfo) return "0"

    return "0"
  }, [poolInfo])

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
            title="Performance Fee"
            value={`${commissionAmount}`}
          />
          <AmountRow
            m="14px 0 0"
            title="Date of withdrawal"
            value={commissionNextEpoch}
          />
          <AmountRow
            m="14px 0 0"
            title="Investor funds locked (3%)"
            value={`$${fundsLockedInvestor}/$${fundsLockedTotal}`}
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
