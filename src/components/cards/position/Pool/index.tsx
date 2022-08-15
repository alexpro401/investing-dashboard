import { MouseEvent, useState, useCallback, useEffect, useMemo } from "react"
import { useSelector } from "react-redux"
import { parseEther, parseUnits } from "@ethersproject/units"
import { BigNumber, FixedNumber } from "@ethersproject/bignumber"
import { useNavigate } from "react-router-dom"

import { PriceFeed } from "abi"
import { normalizeBigNumber } from "utils"
import { useActiveWeb3React } from "hooks"
import { IPosition } from "constants/interfaces_v2"
import { percentageOfBignumbers } from "utils/formulas"
import useContract, { useERC20 } from "hooks/useContract"
import useTokenPriceOutUSD from "hooks/useTokenPriceOutUSD"
import { useTraderPoolRegistryContract } from "hooks/useContract"
import { selectPriceFeedAddress } from "state/contracts/selectors"

import { Flex } from "theme"
import PositionTrade from "components/PositionTrade"
import TokenIcon from "components/TokenIcon"

import { accordionSummaryVariants } from "motion/variants"
import SharedS, { BodyItem, Actions } from "components/cards/position/styled"
import S from "./styled"

interface Props {
  position: IPosition
}

const PoolPositionCard: React.FC<Props> = ({ position }) => {
  const navigate = useNavigate()
  const { account } = useActiveWeb3React()
  const traderPoolRegistry = useTraderPoolRegistryContract()
  const [, baseToken] = useERC20(position.traderPool.baseToken)
  const [, positionToken] = useERC20(position.positionToken)

  const priceFeedAddress = useSelector(selectPriceFeedAddress)
  const priceFeed = useContract(priceFeedAddress, PriceFeed)
  const isTrader = useMemo<boolean>(() => {
    if (!account || !position) {
      return false
    }

    return String(account).toLowerCase() === position.traderPool.trader
  }, [account, position])

  const [markPrice, setMarkPriceBase] = useState<BigNumber>(BigNumber.from("0"))
  const currentPriceUSD = useTokenPriceOutUSD({
    tokenAddress: position.positionToken,
  })
  const [pnlUSDCurrent, setPnlUSDCurrent] = useState<BigNumber>(
    BigNumber.from("0")
  )

  const [poolType, setPoolType] = useState<string | undefined>(undefined)

  const [openExtra, setOpenExtra] = useState<boolean>(false)
  const [showPositions, setShowPositions] = useState<boolean>(false)

  const togglePositions = useCallback(() => {
    setShowPositions(!showPositions)
  }, [showPositions])

  const toggleExtraContent = useCallback(() => {
    if (isTrader && !position.closed) {
      if (openExtra) {
        setShowPositions(false)
      }
      setOpenExtra(!openExtra)
    } else {
      togglePositions()
    }
  }, [isTrader, openExtra, position.closed, togglePositions])

  const baseTokenSymbol = useMemo<string>(() => {
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

    if (position.closed) {
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
   * Mark price (in fund base token)
   * if position open return markPrice (price for 1 position token)
   * otherwise return totalBaseCloseVolume/totalPositionCloseVolume
   */
  const markPriceBase = useMemo<BigNumber>(() => {
    if (!position) return BigNumber.from("0")

    if (!position.closed) {
      return markPrice
    } else {
      const base = FixedNumber.fromValue(position.totalUSDCloseVolume, 18)
      const pos = FixedNumber.fromValue(position.totalPositionCloseVolume, 18)
      const resFixed = base.divUnsafe(pos)

      return parseEther(resFixed._value)
    }
  }, [markPrice, position])

  /**
   * Mark price (in USD)
   * if position open return markPriceBase (price for 1 position token)
   * otherwise return totalUSDCloseVolume/totalPositionCloseVolume
   */
  const markPriceUSD = useMemo<BigNumber>(() => {
    if (!position) return BigNumber.from("0")

    if (!position.closed) {
      return currentPriceUSD
    } else {
      const usd = FixedNumber.fromValue(position.totalBaseCloseVolume, 18)
      const pos = FixedNumber.fromValue(position.totalPositionCloseVolume, 18)
      const resFixed = usd.divUnsafe(pos)

      return parseEther(resFixed._value)
    }
  }, [currentPriceUSD, position])

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
   * P&L (in base token)
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

    const _totalBaseVolumeFixed = position.closed
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

    if (!position.closed) {
      return pnlUSDCurrent
    }

    const _markPriceFixed = FixedNumber.fromValue(markPriceUSD, 18)
    const _entryPriceUSDFixed = FixedNumber.fromValue(entryPriceUSD, 18)

    const res = _markPriceFixed.subUnsafe(_entryPriceUSDFixed)

    return parseEther(res._value)
  }, [markPriceUSD, entryPriceUSD, position.closed, pnlUSDCurrent])

  // get mark price of position token in fund base token
  useEffect(() => {
    if (!priceFeed || !position || !position.traderPool) return
    ;(async () => {
      try {
        const amount = parseUnits("1", 18)

        const price = await priceFeed.getNormalizedExtendedPriceOut(
          position.positionToken,
          position.traderPool.baseToken,
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
  }, [
    priceFeed,
    position.traderPool.baseToken,
    position.positionToken,
    position,
  ])

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

  // check pool type
  useEffect(() => {
    if (!traderPoolRegistry || !position) return
    ;(async () => {
      try {
        const isBasePool = await traderPoolRegistry.isBasicPool(
          position.traderPool.id
        )
        if (isBasePool) {
          setPoolType("BASIC_POOL")
        } else {
          setPoolType("INVEST_POOL")
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [position, traderPoolRegistry])

  /**
   * Navigate to terminal
   * @param e - click event
   * @param invest - terminal type (true = invest, false = divest)
   */
  const onTerminalNavigate = useCallback(
    (e: MouseEvent<HTMLElement>, invest = true) => {
      e.stopPropagation()

      if (!position || !baseToken || !positionToken || !poolType) {
        return
      }

      let url = `/pool/swap/${poolType}/${position.traderPool.id}`

      if (invest) {
        url += `/${baseToken.address}/${positionToken.address}`
      } else {
        url += `/${positionToken.address}/${baseToken.address}`
      }

      navigate(url)
    },
    [baseToken, navigate, poolType, position, positionToken]
  )

  const actions = [
    {
      label: "All my trades",
      active: showPositions,
      onClick: togglePositions,
    },
    {
      label: "Buy more",
      onClick: (e: MouseEvent<HTMLElement>) => onTerminalNavigate(e, true),
    },
    {
      label: "Close Position",
      onClick: (e: MouseEvent<HTMLElement>) => onTerminalNavigate(e, false),
    },
  ]

  return (
    <>
      <SharedS.Container>
        <SharedS.Card onClick={toggleExtraContent}>
          <SharedS.Head>
            <Flex>
              <TokenIcon address={position.positionToken} m="0" size={24} />
              <S.Amount>{positionOpenBaseAmount}</S.Amount>
              <S.PositionSymbol>{positionToken?.symbol ?? ""}</S.PositionSymbol>
            </Flex>
            <Flex>
              <SharedS.PNL amount={+pnlPercentage.normalized}>
                {pnlPercentage.normalized}%
              </SharedS.PNL>
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
                (position.closed ? "Closed price " : "Current price ") +
                baseTokenSymbol
              }
              amount={markPriceBase}
              amountUSD={markPriceUSD}
            />
            <BodyItem
              label={"P&L " + baseTokenSymbol}
              amount={pnlBase}
              pnl={pnlPercentage.value}
              amountUSD={pnlUSD}
              ai="flex-end"
            />
          </SharedS.Body>
        </SharedS.Card>

        <Actions actions={actions} visible={openExtra} />

        <SharedS.ExtraItem
          initial="hidden"
          variants={accordionSummaryVariants}
          animate={showPositions ? "visible" : "hidden"}
        >
          {position.exchanges && position.exchanges.length > 0 ? (
            <SharedS.TradesList>
              {position.exchanges.map((e) => (
                <PositionTrade
                  key={e.id}
                  data={e}
                  baseTokenSymbol={baseTokenSymbol}
                  timestamp={e.timestamp.toString()}
                  isBuy={e.opening}
                  amount={e.opening ? e.toVolume : e.fromVolume}
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

export default PoolPositionCard
