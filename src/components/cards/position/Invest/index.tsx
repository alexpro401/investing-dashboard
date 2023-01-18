import { useCallback, useState, MouseEvent } from "react"
import { generatePath, useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { format } from "date-fns/esm"

import { ICON_NAMES, ROUTE_PATHS } from "consts"
import { useBreakpoints } from "hooks"
import { DATE_FORMAT } from "consts/time"
import { IInvestorProposal } from "interfaces/thegraphs/invest-pools"
import { expandTimestamp, formatBigNumber, normalizeBigNumber } from "utils"

import theme, { Flex } from "theme"
import Icon from "components/Icon"
import TokenIcon from "components/TokenIcon"
import AmountRow from "components/Amount/Row"
import PositionTrade from "components/PositionTrade"

import { accordionSummaryVariants } from "motion/variants"
import SharedS, { BodyItem, Actions } from "components/cards/position/styled"
import * as S from "./styled"
import { NoDataMessage, Icon as IconCommon } from "common"
import useInvestorPositionCard from "./useInvestorPositionCard"

interface Props {
  position: IInvestorProposal
}

const InvestPositionCard: React.FC<Props> = ({ position }) => {
  const { isDesktop } = useBreakpoints()
  const navigate = useNavigate()

  const {
    poolInfo,
    baseToken,
    poolMetadata,
    pnlPercentage,
    positionOpenLPAmount,
    positionOpenLPAmountUSD,
    entryPriceBase,
    entryPriceUSD,
    markPriceBase,
    markPriceUSD,
    pnlBase,
    pnlUSD,
    commissionPeriod,
    commissionPercentage,
    commissionAmountUSD,
    commissionUnlockTimestamp,
    fundsLockedInvestorPercentage,
    fundsLockedInvestorUSD,
    totalPoolInvestmentsUSD,
  } = useInvestorPositionCard(position)

  const baseTokenSymbol = baseToken?.symbol ?? ""

  const [showExtra, setShowExtra] = useState<boolean>(false)
  const [showPositions, setShowPositions] = useState<boolean>(false)
  const [showComission, setShowComission] = useState<boolean>(false)
  const toggleExtraContent = useCallback(() => {
    if (position.isClosed || isDesktop) {
      setShowPositions(!showPositions)
    } else {
      if (showPositions) {
        setShowPositions(false)
      }
      if (showComission) {
        setShowComission(false)
      }
    }

    if (!isDesktop) {
      setShowExtra(!showExtra)
    }
  }, [showExtra, position.isClosed, showComission, showPositions, isDesktop])

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

  const onNavigateTerminal = (e?: MouseEvent<HTMLElement>): void => {
    if (e) e.stopPropagation()

    navigate(
      generatePath(ROUTE_PATHS.poolInvest, { poolAddress: position.pool.id })
    )
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
              <S.Amount>
                {normalizeBigNumber(positionOpenLPAmount, 18, 6)}
              </S.Amount>
              <Flex dir={"row"} ai={"flex-start"} gap={"4"}>
                <S.PositionSymbol>{poolInfo?.ticker}</S.PositionSymbol>
                <SharedS.PNL value={pnlPercentage.normalized}>
                  {Number(pnlPercentage.normalized) > 0 && "+"}
                  {pnlPercentage.normalized}%
                </SharedS.PNL>
              </Flex>
            </Flex>
            <Flex>
              <S.FundSymbol>{baseTokenSymbol}</S.FundSymbol>
              <TokenIcon address={baseToken?.address} m="0" size={24} />
            </Flex>
          </SharedS.Head>

          <SharedS.Body>
            {isDesktop && (
              <>
                <Flex ai="center" gap={"8"} jc={"flex-start"}>
                  <Icon
                    m="0"
                    size={32}
                    source={
                      poolMetadata?.assets[poolMetadata?.assets.length - 1]
                    }
                    address={position.pool.id}
                  />
                  <Flex dir={"column"} ai={"flex-start"} gap={"4"}>
                    <S.PositionSymbol>{poolInfo?.ticker}</S.PositionSymbol>
                    <SharedS.PNL value={pnlPercentage.normalized}>
                      {Number(pnlPercentage.normalized) > 0 && "+"}
                      {pnlPercentage.normalized}%
                    </SharedS.PNL>
                  </Flex>
                </Flex>
                <Flex gap={"8"} jc={"flex-start"}>
                  <TokenIcon address={baseToken?.address} m="0" size={32} />
                  <BodyItem
                    amount={positionOpenLPAmount}
                    amountUSD={positionOpenLPAmountUSD}
                  />
                </Flex>
              </>
            )}
            <BodyItem
              label={!isDesktop ? "Entry Price " + baseTokenSymbol : null}
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
              pnl={pnlPercentage.value}
              amountUSD={pnlUSD}
              ai={isDesktop ? "flex-start" : "flex-end"}
            />
            {isDesktop && (
              <Flex gap={"40"} jc={position.isClosed ? "flex-end" : "initial"}>
                {!position.isClosed && (
                  <>
                    <SharedS.ActionBuy
                      text={"Buy more"}
                      onClick={onNavigateTerminal}
                      color={"default"}
                      size={"no-paddings"}
                    />
                    <SharedS.ActionSell
                      text={"Close positions"}
                      onClick={onNavigateTerminal}
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

        <AnimatePresence>
          {!position.isClosed && !isDesktop && (
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
            <NoDataMessage />
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
            value={format(
              expandTimestamp(+commissionUnlockTimestamp.toString()),
              DATE_FORMAT
            )}
          />
          <AmountRow
            m="14px 0 0"
            title={`Investor funds locked (${formatBigNumber(
              fundsLockedInvestorPercentage,
              18,
              2
            )}%)`}
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
