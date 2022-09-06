import { MouseEvent } from "react"

import { IPosition } from "constants/interfaces_v2"

import { Flex } from "theme"
import TokenIcon from "components/TokenIcon"
import PositionTrade from "components/PositionTrade"

import { accordionSummaryVariants } from "motion/variants"
import SharedS, { BodyItem, Actions } from "components/cards/position/styled"

import usePoolPosition from "./usePoolPosition"
import usePoolPositionCard from "./usePoolPositionCard"
import S from "./styled"

interface Props {
  position: IPosition
}

const PoolPositionCard: React.FC<Props> = ({ position }) => {
  const [
    {
      currentPositionVolume,
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
  ] = usePoolPosition(position)

  const [
    { openExtra, showPositions },
    { togglePositions, toggleExtraContent, onTerminalNavigate },
  ] = usePoolPositionCard(
    position.traderPool.trader,
    position.traderPool.id,
    position.traderPool.baseToken,
    position.positionToken,
    position.closed
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
              <S.Amount>{currentPositionVolume.format}</S.Amount>
              <S.PositionSymbol>{positionToken?.symbol ?? ""}</S.PositionSymbol>
            </Flex>
            <Flex>
              <SharedS.PNL amount={Number(pnlPercentage.format)}>
                {pnlPercentage.format}%
              </SharedS.PNL>
            </Flex>
          </SharedS.Head>

          <SharedS.Body>
            <BodyItem
              label={"Entry Price " + baseToken?.symbol}
              amount={entryPriceBase}
              amountUSD={entryPriceUSD}
            />
            <BodyItem
              label={
                (position.closed ? "Closed price " : "Current price ") +
                baseToken?.symbol
              }
              amount={markPriceBase}
              amountUSD={markPriceUSD}
            />
            <BodyItem
              label={"P&L " + baseToken?.symbol}
              amount={pnlBase}
              pnl={pnlPercentage.big}
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
          {position.exchanges && !!position.exchanges.length ? (
            <SharedS.TradesList>
              {position.exchanges.map((e) => (
                <PositionTrade
                  key={e.id}
                  data={e}
                  baseTokenSymbol={baseToken?.symbol}
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
