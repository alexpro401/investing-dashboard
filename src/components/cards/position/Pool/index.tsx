import { MouseEvent, useMemo } from "react"

import { IPosition } from "interfaces/thegraphs/all-pools"

import { Flex } from "theme"
import TokenIcon from "components/TokenIcon"
import PositionTrade from "components/PositionTrade"

import { accordionSummaryVariants } from "motion/variants"
import SharedS, { BodyItem, Actions } from "components/cards/position/styled"

import usePoolPosition from "./usePoolPosition"
import usePoolPositionCard from "./usePoolPositionCard"
import S from "./styled"
import { Icon as IconCommon, NoDataMessage } from "common"
import { useBreakpoints } from "hooks"
import { ICON_NAMES } from "consts"
import theme from "theme"
import Icon from "components/Icon"

interface Props {
  position: IPosition
}

const PoolPositionCard: React.FC<Props> = ({ position }) => {
  const { isDesktop } = useBreakpoints()
  const [
    {
      poolMetadata,
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

  const baseSymbol = useMemo(() => {
    if (!baseToken) {
      return ""
    }
    return baseToken.symbol ?? ""
  }, [baseToken])

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
              <SharedS.PNL value={pnlPercentage.format}>
                {pnlPercentage.format}%
              </SharedS.PNL>
            </Flex>
          </SharedS.Head>

          <SharedS.Body>
            {isDesktop && (
              <>
                <Flex jc={"flex-start"} gap={"8"}>
                  <Icon
                    m="0"
                    size={32}
                    source={
                      poolMetadata?.assets[poolMetadata?.assets.length - 1]
                    }
                    address={position?.traderPool?.id}
                  />
                  <S.PositionSymbol>
                    {positionToken?.symbol ?? ""}
                  </S.PositionSymbol>
                </Flex>
                <Flex jc={"flex-start"} gap={"8"}>
                  <TokenIcon address={position.positionToken} m="0" size={32} />
                  <Flex dir={"column"} gap={"4"}>
                    <S.Amount>{currentPositionVolume.format}</S.Amount>
                    <SharedS.PNL value={pnlPercentage.format}>
                      {pnlPercentage.format}%
                    </SharedS.PNL>
                  </Flex>
                </Flex>
              </>
            )}
            <BodyItem
              label={!isDesktop ? "Entry Price " + baseSymbol : null}
              amount={entryPriceBase}
              amountUSD={entryPriceUSD}
            />
            <BodyItem
              label={
                !isDesktop
                  ? (position.closed ? "Closed price " : "Current price ") +
                    baseSymbol
                  : null
              }
              amount={markPriceBase}
              amountUSD={markPriceUSD}
            />
            <BodyItem
              label={!isDesktop ? "P&L " + baseSymbol : null}
              amount={pnlBase}
              pnl={pnlPercentage.big}
              amountUSD={pnlUSD}
              ai={!isDesktop ? "flex-end" : "initial"}
            />
            {isDesktop && (
              <Flex gap={"40"} jc={position.closed ? "flex-end" : "initial"}>
                {!position.closed && (
                  <>
                    <SharedS.ActionBuy
                      text={"Buy more"}
                      onClick={(e) => onTerminalNavigate(e, true)}
                      color={"default"}
                      size={"no-paddings"}
                    />
                    <SharedS.ActionSell
                      text={"Close positions"}
                      onClick={(e) => onTerminalNavigate(e, false)}
                      color={"default"}
                      size={"no-paddings"}
                    />
                  </>
                )}
                <IconCommon
                  name={
                    showPositions ? ICON_NAMES.angleDown : ICON_NAMES.angleUp
                  }
                  color={theme.textColors.secondary}
                />
              </Flex>
            )}
          </SharedS.Body>
        </SharedS.Card>

        {!isDesktop && <Actions actions={actions} visible={openExtra} />}

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
                  baseTokenSymbol={baseSymbol}
                  timestamp={e.timestamp.toString()}
                  isBuy={e.opening}
                  amount={e.opening ? e.toVolume : e.fromVolume}
                />
              ))}
            </SharedS.TradesList>
          ) : (
            <NoDataMessage />
          )}
        </SharedS.ExtraItem>
      </SharedS.Container>
    </>
  )
}

export default PoolPositionCard
