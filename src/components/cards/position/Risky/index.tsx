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
import {
  calcPositionPnlPercentage,
  multiplyBignumbers,
  subtractBignumbers,
} from "utils/formulas"

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

const BIG_ZERO: BigNumber = BigNumber.from(0)

interface IAmount {
  big: BigNumber
  format: string
}

const INITIAL_AMOUNT: IAmount = {
  big: BIG_ZERO,
  format: "0",
}

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

  const [currentPositionPriceBase, setCurrentPositionPriceBase] =
    useState(BIG_ZERO)
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
   * Position volume
   * if position.closed return totalPositionCloseVolume
   * otherwise return current position volume
   */
  const positionVolume = useMemo<IAmount>(() => {
    if (!position) return INITIAL_AMOUNT

    const { totalPositionOpenVolume, totalPositionCloseVolume } = position

    if (position.isClosed) {
      return {
        big: totalPositionCloseVolume,
        format: normalizeBigNumber(totalPositionCloseVolume),
      }
    }

    const big = subtractBignumbers(
      [totalPositionOpenVolume, 18],
      [totalPositionCloseVolume, 18]
    )
    return { big, format: normalizeBigNumber(big) }
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

  /**
   * P&L (in %)
   */
  const pnlPercentage = useMemo<IAmount>(() => {
    if (!markPriceBase || !entryPriceBase) {
      return INITIAL_AMOUNT
    }

    const big = calcPositionPnlPercentage(markPriceBase, entryPriceBase)

    return {
      big,
      format: normalizeBigNumber(big, 18, 2),
    }
  }, [markPriceBase, entryPriceBase])

  /**
   * P&L (in baseToken)
   * (markPriceBase - entryPriceBase) * positionVolume
   */
  const pnlBase = useMemo<BigNumber>(() => {
    if (!markPriceBase || !entryPriceBase || !positionVolume) {
      return BIG_ZERO
    }

    const priceDiff = subtractBignumbers(
      [markPriceBase, 18],
      [entryPriceBase, 18]
    )

    return multiplyBignumbers([priceDiff, 18], [positionVolume.big, 18])
  }, [markPriceBase, entryPriceBase, positionVolume])

  /**
   * P&L (in USD)
   */
  const pnlUSD = useMemo<BigNumber>(() => {
    if (!markPriceUSD || !entryPriceUSD || !positionVolume) {
      return BIG_ZERO
    }

    const priceDiff = subtractBignumbers(
      [markPriceUSD, 18],
      [entryPriceUSD, 18]
    )

    return multiplyBignumbers([priceDiff, 18], [positionVolume.big, 18])
  }, [markPriceUSD, entryPriceUSD, positionVolume])

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
                  <S.Amount>{positionVolume}</S.Amount>
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
                      <S.Amount>{positionVolume}</S.Amount>
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
                  <SharedS.PNL amount={+pnlPercentage.format}>
                    {pnlPercentage.format}%
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
                  <SharedS.PNL amount={+pnlPercentage.format}>
                    {pnlPercentage.format}%
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
              pnl={pnlPercentage.big}
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
