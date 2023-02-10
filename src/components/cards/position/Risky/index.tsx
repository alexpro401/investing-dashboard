import { FC, MouseEvent, useCallback, useMemo, useState } from "react"
import { generatePath, useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

import { getProposalId } from "utils"
import { IRiskyPosition } from "interfaces/thegraphs/basic-pools"
import { IPoolInfo } from "interfaces/contracts/ITraderPool"

import theme, { Flex } from "theme"
import Icon from "components/Icon"
import TokenIcon from "components/TokenIcon"
import CardPositionTrade from "components/CardPositionTrade"
import { accordionSummaryVariants } from "motion/variants"
import SharedS, {
  BodyItem,
  Actions,
  Share,
} from "components/cards/position/styled"
import S, { Body } from "./styled"

import useRiskyPosition from "./useRiskyPosition"
import { ICON_NAMES, ROUTE_PATHS } from "consts"
import { Icon as IconCommon, NoDataMessage } from "common"
import { useBreakpoints } from "hooks"

interface Props {
  position: IRiskyPosition
  isTrader: boolean
  poolInfo: IPoolInfo
  poolMetadata: any
}

const RiskyPositionCard: FC<Props> = ({
  position,
  isTrader,
  poolInfo,
  poolMetadata,
}) => {
  const { isDesktop } = useBreakpoints()
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

  const exchanges = position.proposal.exchanges ?? []

  const [openExtra, setOpenExtra] = useState<boolean>(false)
  const [showPositions, setShowPositions] = useState<boolean>(false)

  const togglePositions = useCallback(() => {
    setShowPositions(!showPositions)
  }, [showPositions])

  const toggleExtraContent = useCallback(() => {
    if (position.isClosed || !isTrader || isDesktop) {
      togglePositions()
    } else {
      if (showPositions) {
        setShowPositions(false)
      }
      setOpenExtra(!openExtra)
    }
  }, [
    isTrader,
    openExtra,
    position.isClosed,
    showPositions,
    togglePositions,
    isDesktop,
  ])

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
      navigate(
        generatePath(ROUTE_PATHS.poolProfile, {
          poolAddress: position.proposal.basicPool.id,
          "*": "",
        })
      )
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
        `/swap-risky-proposal/${position.proposal.basicPool.id}/${
          proposalId - 1
        }/deposit`
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
        `/swap-risky-proposal/${position.proposal.basicPool.id}/${
          proposalId - 1
        }/withdraw`
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
                      address={position.proposal.basicPool.id}
                    />
                  ) : (
                    <TokenIcon address={baseToken?.address} m="0" size={26} />
                  )}
                </Flex>
              )}
            </Flex>
          </SharedS.Head>
          <Body isClosed={position.isClosed}>
            {isDesktop && (
              <>
                <Flex gap={"8"} jc={"flex-start"} ai={"center"}>
                  <Icon
                    m="0"
                    size={32}
                    source={
                      poolMetadata?.assets[poolMetadata?.assets.length - 1]
                    }
                    address={position.proposal.basicPool.id}
                  />
                  <S.FundSymbol>{poolInfo?.ticker}</S.FundSymbol>
                </Flex>
                <Flex gap={"8"} jc={"flex-start"}>
                  <S.Symbols>
                    <S.SymbolItem>
                      <TokenIcon
                        address={positionToken?.address}
                        m="0"
                        size={30}
                      />
                    </S.SymbolItem>
                    <S.SymbolItem>
                      <TokenIcon address={baseToken?.address} m="0" size={32} />
                    </S.SymbolItem>
                  </S.Symbols>
                  <Flex gap={"4"} dir={"column"} jc={"flex-start"}>
                    <S.Amount>{positionVolume.format}</S.Amount>
                    <SharedS.PNL value={pnlPercentage.format}>
                      {pnlPercentage.format}%
                    </SharedS.PNL>
                  </Flex>
                </Flex>
              </>
            )}
            <BodyItem
              label={!isDesktop ? `Entry Price ${baseTokenSymbol}` : null}
              amount={entryPriceBase}
              amountUSD={entryPriceUSD}
            />
            <BodyItem
              label={
                !isDesktop
                  ? (position.isClosed ? "Closed price " : "Current price ") +
                    baseTokenSymbol
                  : null
              }
              amount={markPriceBase}
              amountUSD={markPriceUSD}
            />
            <BodyItem
              label={!isDesktop ? `P&L ${baseTokenSymbol}` : null}
              amount={pnlBase}
              pnl={pnlPercentage.big}
              amountUSD={pnlUSD}
              ai={!isDesktop ? "flex-end" : "initial"}
            />
            {isDesktop && (
              <Flex gap={"40"} jc={position.isClosed ? "flex-end" : "initial"}>
                {!position.isClosed && (
                  <>
                    <SharedS.ActionBuy
                      text={"Buy more"}
                      onClick={onBuyMore}
                      color={"default"}
                      size={"no-paddings"}
                    />
                    <SharedS.ActionSell
                      text={"Close positions"}
                      onClick={onClosePosition}
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
          </Body>
        </SharedS.Card>

        <AnimatePresence>
          {!position.isClosed && isTrader && !isDesktop && (
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
                <CardPositionTrade
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
            <NoDataMessage />
          )}
        </SharedS.ExtraItem>
      </SharedS.Container>
    </>
  )
}

export default RiskyPositionCard
