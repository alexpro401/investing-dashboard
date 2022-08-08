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
import { normalizeBigNumber } from "utils"
import useRiskyPositionExchanges from "hooks/useRiskyPositionExchanges"
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
  const exchanges = useRiskyPositionExchanges(position.pool.id)

  const [markPriceBase, setMarkPriceBase] = useState(BigNumber.from(0))
  const markPriceUSD = useTokenPriceOutUSD({
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
   * if position.closed return totalPositionOpenVolume
   * otherwise return current position volume
   */
  const positionOpenBaseAmount = useMemo<string>(() => {
    if (
      !position ||
      !position.totalPositionOpenVolume ||
      !position.totalPositionCloseVolume
    ) {
      return "0"
    }

    if (position.isClosed) {
      return normalizeBigNumber(position.totalPositionOpenVolume, 18, 6)
    } else {
      const open = FixedNumber.fromValue(position.totalPositionOpenVolume, 18)
      const close = FixedNumber.fromValue(position.totalPositionCloseVolume, 18)
      const resFixed = open.subUnsafe(close)

      return normalizeBigNumber(parseEther(resFixed._value), 18, 6)
    }
  }, [position])

  /**
   * Entry price (in fund base token)
   * totalUSDOpenVolume/totalPositionOpenVolume
   */
  const entryPriceBase = useMemo<BigNumber>(() => {
    if (
      !position ||
      !position.totalUSDOpenVolume ||
      BigNumber.from(position.totalUSDOpenVolume).isZero() ||
      !position.totalPositionOpenVolume ||
      BigNumber.from(position.totalPositionOpenVolume).isZero()
    ) {
      return BigNumber.from("0")
    }

    const usdOpen = FixedNumber.fromValue(position.totalUSDOpenVolume, 18)
    const posOpen = FixedNumber.fromValue(position.totalPositionOpenVolume, 18)
    const resFixed = usdOpen.divUnsafe(posOpen)

    return parseEther(resFixed._value)
  }, [position])

  /**
   * Entry price (in USD)
   * totalBaseOpenVolume/totalPositionOpenVolume
   */
  const entryPriceUSD = useMemo<BigNumber>(() => {
    if (
      !position ||
      !position.totalBaseOpenVolume ||
      BigNumber.from(position.totalBaseOpenVolume).isZero() ||
      !position.totalPositionOpenVolume ||
      BigNumber.from(position.totalPositionOpenVolume).isZero()
    ) {
      return BigNumber.from("0")
    }

    const baseOpen = FixedNumber.fromValue(position.totalBaseOpenVolume, 18)
    const posOpen = FixedNumber.fromValue(position.totalPositionOpenVolume, 18)
    const resFixed = baseOpen.divUnsafe(posOpen)

    return parseEther(resFixed._value)
  }, [position])

  /**
   * P&L (in baseToken)
   * markPriceBase - entryPriceBase
   */
  const pnlBase = useMemo<BigNumber>(() => {
    if (!markPriceBase || !entryPriceBase) return BigNumber.from("0")

    const _markPriceFixed = FixedNumber.fromValue(markPriceBase, 18)
    const _entryPriceBaseFixed = FixedNumber.fromValue(entryPriceBase, 18)

    const res = _markPriceFixed.subUnsafe(_entryPriceBaseFixed)

    return parseEther(res._value)
  }, [markPriceBase, entryPriceBase])

  interface IPnlPercentage {
    value: BigNumber
    normalized: string
  }

  /**
   * P&L (in %)
   */
  const pnlPercentage = useMemo<IPnlPercentage>(() => {
    if (
      !markPriceBase ||
      !entryPriceBase ||
      markPriceBase.isZero() ||
      entryPriceBase.isZero()
    ) {
      return {
        value: BigNumber.from("0"),
        normalized: "0",
      }
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
   * P&L (in USD)
   */
  const pnlUSD = useMemo<BigNumber>(() => {
    if (!markPriceUSD || !entryPriceUSD) return BigNumber.from("0")

    const _markPriceFixed = FixedNumber.fromValue(markPriceUSD, 18)
    const _entryPriceUSDFixed = FixedNumber.fromValue(entryPriceUSD, 18)

    const res = _markPriceFixed.subUnsafe(_entryPriceUSDFixed)

    return parseEther(res._value)
  }, [markPriceUSD, entryPriceUSD])

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
          setMarkPriceBase(price.amountOut)
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
      navigate(
        `/invest-risky-proposal/${position.pool.id}/${position.proposal}`
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
      navigate(
        `/invest-risky-proposal/${position.pool.id}/${position.proposal}`
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
                  <S.Amount>{positionOpenBaseAmount}</S.Amount>
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
                      <S.Amount>{positionOpenBaseAmount}</S.Amount>
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
            exchanges.map((e) => (
              <PositionTrade
                data={e}
                key={e.id}
                timestamp={e.timestamp}
                isBuy={false}
                amount={!false ? e.toVolume : e.fromVolume}
                baseTokenSymbol={baseTokenSymbol}
              />
            ))
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
