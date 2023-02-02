import * as React from "react"
import { isEmpty } from "lodash"
import { AnimatePresence } from "framer-motion"
import { SpiralSpinner } from "react-spinners-kit"
import { generatePath, useNavigate } from "react-router-dom"

import { useBreakpoints, useInvestorPositionVests } from "hooks"
import { ICON_NAMES, MAX_PAGINATION_COUNT, ROUTE_PATHS } from "consts"
import { normalizeBigNumber } from "utils"

import { NoDataMessage } from "common"
import { accordionSummaryVariants } from "motion/variants"

import Icon from "components/Icon"
import LoadMore from "components/LoadMore"
import TokenIcon from "components/TokenIcon"
import CardActions from "components/CardActions"
import PositionTrade from "components/PositionTrade"

import InvestorPositionCommission from "./InvestorPositionCommission"
import * as S from "./styled"
import { InvestorPositionInPoolContext } from "context/investor/positions/InvestorPositionInPoolContext"

const CardInvestorPosition: React.FC = () => {
  const navigate = useNavigate()
  const { isDesktop } = useBreakpoints()

  const {
    position,
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
    commission,
  } = React.useContext(InvestorPositionInPoolContext)

  const [showActions, setShowActions] = React.useState(false)
  const [showPositions, setShowPositions] = React.useState(false)
  const [showCommission, setShowCommission] = React.useState(false)

  const togglePositions = React.useCallback(() => {
    if (!showPositions && showCommission) {
      setShowCommission(false)
    }
    setShowPositions((prev) => !prev)
  }, [showCommission, showPositions])

  const toggleCommission = React.useCallback(() => {
    if (!showCommission && showPositions) {
      setShowPositions(false)
    }
    setShowCommission((prev) => !prev)
  }, [showCommission, showPositions])

  const onToggleActions = React.useCallback((): void => {
    setShowActions((prev) => !prev)

    if (position.isClosed || isDesktop) {
      setShowPositions((prev) => !prev)
    } else {
      if (showPositions) setShowPositions(false)
      if (showCommission) setShowCommission(false)
    }
  }, [position, isDesktop, showPositions, showCommission])

  React.useEffect(() => {
    if (isDesktop) {
      if (showCommission) {
        setShowCommission(false)
        setShowPositions(true)
      }
    }
  }, [isDesktop, showCommission])

  const onNavigateTerminal = React.useCallback(
    (
      e: React.MouseEvent<HTMLElement>,
      initialDirection: "deposit" | "withdraw"
    ): void => {
      e.stopPropagation()

      navigate(
        generatePath(ROUTE_PATHS.poolInvest, {
          poolAddress: position.pool.id,
        }),
        {
          state: {
            initialDirection,
          },
        }
      )
    },
    [navigate, position]
  )

  const actions = React.useMemo(
    () =>
      isDesktop || position.isClosed
        ? []
        : [
            {
              label: "All trades",
              active: showPositions,
              onClick: togglePositions,
            },
            {
              label: "Buy more",
              onClick: (e) => onNavigateTerminal(e, "deposit"),
            },
            {
              label: "Commission",
              active: showCommission,
              onClick: toggleCommission,
            },
            {
              label: "Close",
              onClick: (e) => onNavigateTerminal(e, "withdraw"),
            },
          ],
    [
      position,
      isDesktop,
      showPositions,
      showCommission,
      togglePositions,
      toggleCommission,
      onNavigateTerminal,
    ]
  )

  const baseTokenSymbol = baseToken?.symbol ?? ""
  const pnlPercentageValue = React.useMemo(
    () => Number(normalizeBigNumber(pnlPercentage, 18, 2)),
    [pnlPercentage]
  )

  const [{ data: vests, loading: loadingVests }, fetchMoreVests, resetVests] =
    useInvestorPositionVests(position?.id, !showPositions)

  React.useEffect(() => {
    if (!showPositions) {
      resetVests()
    }
  }, [showPositions, resetVests])

  return (
    <S.Root>
      <S.CardInvestorPositionBody
        onClick={onToggleActions}
        sharpBottomCorners={showPositions}
        bigGap={position.isClosed}
      >
        <S.CardInvestorPositionBodyItem gridEnd={2}>
          <S.CardInvestorPositionBodyItemPoolInfoWrp>
            <Icon
              m="0"
              size={isDesktop ? 32 : 24}
              source={poolMetadata?.assets[poolMetadata?.assets.length - 1]}
              address={position.pool.id}
            />
            <S.CardInvestorPositionBodyItemPoolInfoContentWrp>
              {!isDesktop && (
                <S.CardInvestorPositionBodyItemAmount>
                  ${normalizeBigNumber(positionOpenLPAmount, 18, 6)}
                </S.CardInvestorPositionBodyItemAmount>
              )}
              <S.CardInvestorPositionFundTicker>
                {poolInfo?.ticker}
              </S.CardInvestorPositionFundTicker>
              <S.PNL value={pnlPercentageValue}>
                {pnlPercentageValue > 0 && "+"}
                {pnlPercentageValue}%
              </S.PNL>
            </S.CardInvestorPositionBodyItemPoolInfoContentWrp>
          </S.CardInvestorPositionBodyItemPoolInfoWrp>
        </S.CardInvestorPositionBodyItem>
        <S.CardInvestorPositionBodyItem>
          <S.CardInvestorPositionBodyItemVolumeWrp>
            {isDesktop ? (
              <S.CardInvestorPositionBodyItemGrid>
                <S.CardInvestorPositionBodyItemAmount>
                  {normalizeBigNumber(positionOpenLPAmount, 18, 6)}
                </S.CardInvestorPositionBodyItemAmount>
                <S.CardInvestorPositionBodyItemPrice>
                  ${normalizeBigNumber(positionOpenLPAmountUSD, 18, 2)}
                </S.CardInvestorPositionBodyItemPrice>
              </S.CardInvestorPositionBodyItemGrid>
            ) : (
              <S.CardInvestorPositionFundToken>
                {baseTokenSymbol}
              </S.CardInvestorPositionFundToken>
            )}

            <TokenIcon
              m="0"
              size={isDesktop ? 32 : 24}
              address={baseToken?.address}
            />
          </S.CardInvestorPositionBodyItemVolumeWrp>
        </S.CardInvestorPositionBodyItem>

        <S.CardInvestorPositionDivider />

        <S.CardInvestorPositionBodyItemGrid>
          <S.CardInvestorPositionBodyItemLabel>
            {String("Entry Price ").concat(baseTokenSymbol)}
          </S.CardInvestorPositionBodyItemLabel>
          <S.CardInvestorPositionBodyItemAmount>
            {normalizeBigNumber(entryPriceBase, 18, 6)}
          </S.CardInvestorPositionBodyItemAmount>
          <S.CardInvestorPositionBodyItemPrice>
            ${normalizeBigNumber(entryPriceUSD, 18, 2)}
          </S.CardInvestorPositionBodyItemPrice>
        </S.CardInvestorPositionBodyItemGrid>

        <S.CardInvestorPositionBodyItemGrid>
          <S.CardInvestorPositionBodyItemLabel>
            {String(
              position.isClosed ? "Closed price " : "Current price "
            ).concat(baseTokenSymbol)}
          </S.CardInvestorPositionBodyItemLabel>
          <S.CardInvestorPositionBodyItemAmount>
            {normalizeBigNumber(markPriceBase, 18, 6)}
          </S.CardInvestorPositionBodyItemAmount>
          <S.CardInvestorPositionBodyItemPrice>
            ${normalizeBigNumber(markPriceUSD, 18, 2)}
          </S.CardInvestorPositionBodyItemPrice>
        </S.CardInvestorPositionBodyItemGrid>

        <S.CardInvestorPositionBodyItemGrid
          textAlign={!isDesktop ? "right" : undefined}
        >
          <S.CardInvestorPositionBodyItemLabel>
            {String("P&L ").concat(baseTokenSymbol)}
          </S.CardInvestorPositionBodyItemLabel>
          <S.CardInvestorPositionBodyItemAmount>
            {normalizeBigNumber(pnlBase, 18, 6)}
          </S.CardInvestorPositionBodyItemAmount>
          <S.CardInvestorPositionBodyItemPrice>
            {pnlUSD.isNegative() && "-"}$
            {normalizeBigNumber(pnlUSD.abs(), 18, 2)}
          </S.CardInvestorPositionBodyItemPrice>
        </S.CardInvestorPositionBodyItemGrid>

        {isDesktop && (
          <>
            <S.CardInvestorPositionBodyItem>
              <S.CardInvestorPositionBodyItemAmount>
                {normalizeBigNumber(commission.percentage, 25, 0)}%
              </S.CardInvestorPositionBodyItemAmount>
            </S.CardInvestorPositionBodyItem>
            <S.CardInvestorPositionBodyItem>
              <S.CardInvestorPositionBodyItemActionsWrp>
                {!position.isClosed && (
                  <>
                    <S.ActionPositive
                      text={"Buy More"}
                      color={"default"}
                      size={"no-paddings"}
                      onClick={(e) => onNavigateTerminal(e, "deposit")}
                    />
                    <S.ActionNegative
                      text={"Close position"}
                      color={"default"}
                      size={"no-paddings"}
                      onClick={(e) => onNavigateTerminal(e, "withdraw")}
                    />
                  </>
                )}
                <S.CardInvestorPositionToggleIconIndicator
                  name={ICON_NAMES.angleDown}
                  isActive={showPositions}
                />
              </S.CardInvestorPositionBodyItemActionsWrp>
            </S.CardInvestorPositionBodyItem>
          </>
        )}
      </S.CardInvestorPositionBody>

      <AnimatePresence>
        <CardActions actions={actions} visible={showActions} />
      </AnimatePresence>
      <S.CardInvestorPositionExtra
        initial="hidden"
        animate={
          (isDesktop && showActions) || showPositions ? "visible" : "hidden"
        }
        variants={accordionSummaryVariants}
      >
        <S.CardInvestorPositionVestsWrp>
          {isEmpty(vests) && loadingVests && (
            <S.CardInvestorPositionVestsLoaderWrp>
              <SpiralSpinner size={30} loading />
            </S.CardInvestorPositionVestsLoaderWrp>
          )}
          {isEmpty(vests) && !loadingVests && <NoDataMessage />}
          {!isEmpty(vests) ? (
            <>
              {vests.map((v) => (
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
              {vests.length >= MAX_PAGINATION_COUNT && (
                <LoadMore
                  isLoading={loadingVests && !!vests.length}
                  handleMore={fetchMoreVests}
                />
              )}
            </>
          ) : null}
        </S.CardInvestorPositionVestsWrp>
      </S.CardInvestorPositionExtra>
      <S.CardInvestorPositionExtra
        initial="hidden"
        animate={showCommission && !isDesktop ? "visible" : "hidden"}
        variants={accordionSummaryVariants}
      >
        <S.CardInvestorPositionCommissionWrp>
          <InvestorPositionCommission />
        </S.CardInvestorPositionCommissionWrp>
      </S.CardInvestorPositionExtra>
    </S.Root>
  )
}

export default CardInvestorPosition
