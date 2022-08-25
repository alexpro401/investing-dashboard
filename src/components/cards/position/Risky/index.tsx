import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { parseEther, parseUnits } from "@ethersproject/units"
import { BigNumber, FixedNumber } from "@ethersproject/bignumber"
import { useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

import { PriceFeed } from "abi"
import { IRiskyPositionCard, PoolInfo } from "constants/interfaces_v2"
import useContract, { useERC20 } from "hooks/useContract"
import useTokenPriceOutUSD from "hooks/useTokenPriceOutUSD"
import { selectPriceFeedAddress } from "state/contracts/selectors"
import { getProposalId, normalizeBigNumber } from "utils"
import { percentageOfBignumbers } from "utils/formulas"

import { Flex } from "theme"
import TokenIcon from "components/TokenIcon"
import PositionTrade from "components/PositionTrade"

import { accordionSummaryVariants } from "motion/variants"
import SharedS, {
  BodyItem,
  Actions,
  Share,
} from "components/cards/position/styled"
import S from "./styled"
import Icon from "components/Icon"

interface Props {
  position: IRiskyPositionCard
  isTrader: boolean
  poolInfo: PoolInfo
  poolMetadata: any
}

const RiskyPositionCard: React.FC<Props> = ({
  position,
  isTrader,
  poolInfo,
  poolMetadata,
}) => {
  const navigate = useNavigate()

  const [, positionToken] = useERC20(position?.token)
  const [, baseToken] = useERC20(position.pool.baseToken)
  const priceFeedAddress = useSelector(selectPriceFeedAddress)
  const priceFeed = useContract(priceFeedAddress, PriceFeed)
  const exchanges = position.exchanges ?? []

  const [pnlUSDCurrent, setPnlUSDCurrent] = useState<BigNumber>(
    BigNumber.from("0")
  )
  const [currentPositionPriceBase, setCurrentPositionPriceBase] = useState(
    BigNumber.from(0)
  )
  const currentPositionPriceUSD = useTokenPriceOutUSD({
    tokenAddress: position.token,
  })

  const [openExtra, setOpenExtra] = useState<boolean>(false)
  const [showPositions, setShowPositions] = useState<boolean>(false)

  const togglePositions = useCallback(() => {
    setShowPositions(!showPositions)
  }, [showPositions])

  const toggleExtraContent = useCallback(() => {
    if (position.isClosed || !isTrader) {
      togglePositions()
    } else {
      if (showPositions) {
        setShowPositions(false)
      }
      setOpenExtra(!openExtra)
    }
  }, [isTrader, openExtra, position.isClosed, showPositions, togglePositions])

  const positionTokenSymbol = useMemo(() => {
    if (!positionToken || !positionToken?.symbol) return ""

    return positionToken.symbol
  }, [positionToken])

  const baseTokenSymbol = useMemo(() => {
    if (!baseToken || !baseToken?.symbol) return ""

    return baseToken.symbol
  }, [baseToken])

  /**
   * Position amount
   * if position.closed return totalPositionCloseVolume
   * otherwise return current position volume
   */
  const positionOpenAmount = useMemo<string>(() => {
    if (!position) return "0"

    if (position.isClosed) {
      return normalizeBigNumber(position.totalPositionCloseVolume, 18, 6)
    } else {
      const open = FixedNumber.fromValue(position.totalPositionOpenVolume, 18)
      const close = FixedNumber.fromValue(position.totalPositionCloseVolume, 18)
      const resFixed = open.subUnsafe(close)

      return normalizeBigNumber(parseEther(resFixed._value), 18, 6)
    }
  }, [position])

  /**
   * Entry price (in fund base token)
   * totalBaseOpenVolume/totalPositionOpenVolume
   */
  const entryPriceBase = useMemo<BigNumber>(() => {
    if (!position) return BigNumber.from("0")

    const baseOpen = FixedNumber.fromValue(position.totalBaseOpenVolume, 18)
    const posOpen = FixedNumber.fromValue(position.totalPositionOpenVolume, 18)
    const resFixed = baseOpen.divUnsafe(posOpen)

    return parseEther(resFixed._value)
  }, [position])

  /**
   * Entry price (in USD)
   * totalUSDOpenVolume/totalPositionOpenVolume
   */
  const entryPriceUSD = useMemo<BigNumber>(() => {
    if (!position) return BigNumber.from("0")

    const usdOpen = FixedNumber.fromValue(position.totalUSDOpenVolume, 18)
    const posOpen = FixedNumber.fromValue(position.totalPositionOpenVolume, 18)
    const resFixed = usdOpen.divUnsafe(posOpen)

    return parseEther(resFixed._value)
  }, [position])

  /**
   * Mark price (in fund base token)
   * if position open return currentPositionPriceBase (price for 1 position token)
   * otherwise return totalBaseCloseVolume/totalPositionCloseVolume
   */
  const markPriceBase = useMemo<BigNumber>(() => {
    if (!position) return BigNumber.from("0")

    if (!position.isClosed) {
      return currentPositionPriceBase
    } else {
      const base = FixedNumber.fromValue(position.totalBaseCloseVolume, 18)
      const pos = FixedNumber.fromValue(position.totalPositionCloseVolume, 18)
      const resFixed = base.divUnsafe(pos)

      return parseEther(resFixed._value)
    }
  }, [currentPositionPriceBase, position])

  /**
   * Mark price (in USD)
   * if position open return markPriceBase (price for 1 position token)
   * otherwise return totalUSDCloseVolume/totalPositionCloseVolume
   */
  const markPriceUSD = useMemo<BigNumber>(() => {
    if (!position) return BigNumber.from("0")

    if (!position.isClosed) {
      return currentPositionPriceUSD
    } else {
      const usd = FixedNumber.fromValue(position.totalUSDCloseVolume, 18)
      const pos = FixedNumber.fromValue(position.totalPositionCloseVolume, 18)
      const resFixed = usd.divUnsafe(pos)

      return parseEther(resFixed._value)
    }
  }, [currentPositionPriceUSD, position])

  interface IPnlPercentage {
    value: BigNumber
    normalized: string
  }
  /**
   * P&L (in %)
   */
  const pnlPercentage = useMemo<IPnlPercentage>(() => {
    if (!markPriceBase || !entryPriceBase) {
      return { value: BigNumber.from("0"), normalized: "0" }
    }

    const percentage = percentageOfBignumbers(markPriceBase, entryPriceBase)

    const resultFixed = FixedNumber.fromValue(percentage, 18).subUnsafe(
      FixedNumber.from("100", 18)
    )

    const resultBig = parseEther(resultFixed._value)

    return {
      value: resultBig,
      normalized: normalizeBigNumber(resultBig, 18, 2),
    }
  }, [markPriceBase, entryPriceBase])

  /**
   * P&L (in baseToken)
   * markPriceBase - entryPriceBase
   */
  const pnlBase = useMemo<BigNumber>(() => {
    if (!position || !pnlPercentage || !positionToken) {
      return BigNumber.from("0")
    }

    const _pnlPercentageFixed = FixedNumber.fromValue(pnlPercentage.value, 18)
    const _totalBaseOpenVolumeFixed = FixedNumber.fromValue(
      position.totalBaseOpenVolume,
      18
    )
    const _totalBaseCloseVolumeFixed = FixedNumber.fromValue(
      position.totalBaseCloseVolume,
      18
    )

    const _totalBaseVolumeFixed = position.isClosed
      ? FixedNumber.fromValue(position.totalBaseCloseVolume, 18)
      : _totalBaseOpenVolumeFixed.subUnsafe(_totalBaseCloseVolumeFixed) // current base open volume

    const _pnlBaseFixed = _totalBaseVolumeFixed.mulUnsafe(_pnlPercentageFixed)
    const res = _totalBaseVolumeFixed.addUnsafe(_pnlBaseFixed)

    return parseEther(res._value)
  }, [position, pnlPercentage, positionToken])

  /**
   * P&L (in USD)
   */
  const pnlUSD = useMemo<BigNumber>(() => {
    if (!markPriceUSD || !entryPriceUSD) return BigNumber.from("0")

    if (!position.isClosed) {
      return pnlUSDCurrent
    }

    const _markPriceFixed = FixedNumber.fromValue(markPriceUSD, 18)
    const _entryPriceUSDFixed = FixedNumber.fromValue(entryPriceUSD, 18)

    const res = _markPriceFixed.subUnsafe(_entryPriceUSDFixed)

    return parseEther(res._value)
  }, [markPriceUSD, entryPriceUSD, position.isClosed, pnlUSDCurrent])

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

  // get mark price
  useEffect(() => {
    if (!priceFeed || !position || !position.token || !position.pool) return
    ;(async () => {
      try {
        const amount = parseUnits("1", 18)

        // without extended
        const price = await priceFeed.getNormalizedExtendedPriceOut(
          position.token,
          position.pool.baseToken,
          amount,
          []
        )
        if (price && price.amountOut) {
          setCurrentPositionPriceBase(price.amountOut)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [priceFeed, position])

  /**
   * Navigate to pool page
   * @param e - click event
   */
  const navigateToPool = useCallback(
    (e: MouseEvent<HTMLElement>): void => {
      e.stopPropagation()
      navigate(`/pool/profile/BASIC_POOL/${position.pool.id}`)
    },
    [navigate, position]
  )

  /**
   * Share closed position to social networks
   * @param e - click event
   */
  const onShare = useCallback((e: MouseEvent<HTMLElement>): void => {
    e.stopPropagation()
    console.log("On share")
  }, [])

  /**
   * Navigate to risky invest terminal
   * @param e - click event
   */
  const onBuyMore = useCallback(
    (e: MouseEvent<HTMLElement>): void => {
      e.stopPropagation()
      const proposalId = getProposalId(position.id)
      if (proposalId < 0) return
      navigate(
        `/swap-risky-proposal/${position.pool.id}/${proposalId - 1}/deposit`
      )
    },
    [navigate, position]
  )

  /**
   * Navigate to risky divest terminal
   * @param e - click event
   */
  const onClosePosition = useCallback(
    (e: MouseEvent<HTMLElement>): void => {
      e.stopPropagation()
      const proposalId = getProposalId(position.id)
      if (proposalId < 0) return
      navigate(
        `/swap-risky-proposal/${position.pool.id}/${proposalId - 1}/withdraw`
      )
    },
    [navigate, position]
  )

  const actions = [
    {
      label: "All my trades",
      active: showPositions,
      onClick: togglePositions,
    },
    {
      label: "Buy more",
      onClick: onBuyMore,
    },
    {
      label: "Close Position",
      onClick: onClosePosition,
    },
  ]

  return (
    <>
      <SharedS.Container>
        <SharedS.Card onClick={toggleExtraContent}>
          <SharedS.Head>
            <Flex>
              {isTrader ? (
                <>
                  <TokenIcon
                    address={positionToken?.address ?? ""}
                    m="0"
                    size={24}
                  />
                  <S.Amount>{positionOpenAmount}</S.Amount>
                  <S.PositionSymbol>{positionTokenSymbol}</S.PositionSymbol>
                  <S.FundSymbol>/{baseTokenSymbol}</S.FundSymbol>
                </>
              ) : (
                <>
                  {!position.isClosed ? (
                    <>
                      <TokenIcon
                        address={positionToken?.address}
                        m="0"
                        size={24}
                      />
                      <S.Amount>{positionOpenAmount}</S.Amount>
                      <S.PositionSymbol>{positionTokenSymbol}</S.PositionSymbol>
                    </>
                  ) : (
                    <>
                      <S.Symbols>
                        <S.SymbolItem>
                          <TokenIcon
                            address={positionToken?.address}
                            m="0"
                            size={24}
                          />
                        </S.SymbolItem>
                        <S.SymbolItem>
                          <TokenIcon
                            address={baseToken?.address}
                            m="0"
                            size={26}
                          />
                        </S.SymbolItem>
                      </S.Symbols>
                      <S.PositionSymbol>{positionTokenSymbol}</S.PositionSymbol>
                      <S.FundSymbol>/{baseTokenSymbol}</S.FundSymbol>
                    </>
                  )}
                  <SharedS.PNL amount={+pnlPercentage.normalized}>
                    {pnlPercentage.normalized}%
                  </SharedS.PNL>
                  {!isTrader && position.isClosed && (
                    <Share onClick={onShare} />
                  )}
                </>
              )}
            </Flex>
            <Flex m={isTrader && position.isClosed ? "0 -8px 0 0" : ""}>
              {isTrader ? (
                <>
                  <SharedS.PNL amount={+pnlPercentage.normalized}>
                    {pnlPercentage.normalized}%
                  </SharedS.PNL>
                  {position.isClosed && <Share onClick={onShare} />}
                </>
              ) : (
                <Flex onClick={navigateToPool}>
                  <S.FundSymbol>{poolInfo?.ticker}</S.FundSymbol>
                  {position.isClosed ? (
                    <Icon
                      m="0"
                      size={26}
                      source={
                        poolMetadata?.assets[poolMetadata?.assets.length - 1]
                      }
                      address={position.pool.id}
                    />
                  ) : (
                    <TokenIcon address={baseToken?.address} m="0" size={26} />
                  )}
                </Flex>
              )}
            </Flex>
          </SharedS.Head>
          <SharedS.Body>
            <BodyItem
              label={`Entry Price ${baseTokenSymbol}`}
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
          {!position.isClosed && isTrader && (
            <Actions visible={openExtra} actions={actions} />
          )}
        </AnimatePresence>

        <SharedS.ExtraItem
          initial="hidden"
          animate={showPositions ? "visible" : "hidden"}
          variants={accordionSummaryVariants}
        >
          {exchanges && exchanges.length ? (
            <SharedS.TradesList>
              {exchanges.map((e) => (
                <PositionTrade
                  data={e}
                  key={e.id}
                  timestamp={e.timestamp}
                  isBuy={e.fromToken !== positionToken?.address}
                  amount={
                    e.fromToken !== positionToken?.address
                      ? e.toVolume
                      : e.fromVolume
                  }
                  baseTokenSymbol={baseTokenSymbol}
                />
              ))}
            </SharedS.TradesList>
          ) : (
            <Flex full jc="center" p="12px 0">
              <SharedS.WitoutData>No trades</SharedS.WitoutData>
            </Flex>
          )}
        </SharedS.ExtraItem>
      </SharedS.Container>
    </>
  )
}

export default RiskyPositionCard