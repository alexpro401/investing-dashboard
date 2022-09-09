import { MouseEvent, useCallback, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

import { getProposalId } from "utils"
import { IRiskyPositionCard } from "interfaces/thegraphs/basic-pools"
import { IPoolInfo } from "interfaces/contracts/ITraderPool"

import { Flex } from "theme"
import Icon from "components/Icon"
import TokenIcon from "components/TokenIcon"
import PositionTrade from "components/PositionTrade"
import { accordionSummaryVariants } from "motion/variants"
import SharedS, {
  BodyItem,
  Actions,
  Share,
} from "components/cards/position/styled"
import S from "./styled"

import useRiskyPosition from "./useRiskyPosition"

interface Props {
  position: IRiskyPositionCard
  isTrader: boolean
  poolInfo: IPoolInfo
  poolMetadata: any
}

const RiskyPositionCard: React.FC<Props> = ({
  position,
  isTrader,
  poolInfo,
  poolMetadata,
}) => {
  const navigate = useNavigate()

  const [
    {
      positionVolume,
      entryPriceBase,
      entryPriceUSD,
      markPriceBase,
      markPriceUSD,
      pnlPercentage,
      pnlBase,
      pnlUSD,
      positionToken,
      baseToken,
    },
  ] = useRiskyPosition(position)

  const exchanges = position.exchanges ?? []

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
                  <S.Amount>{positionVolume.format}</S.Amount>
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
                      <S.Amount>{positionVolume.format}</S.Amount>
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
                  <SharedS.PNL value={pnlPercentage.format}>
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
                  <SharedS.PNL value={pnlPercentage.format}>
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
