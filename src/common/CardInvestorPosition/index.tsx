import * as React from "react"
import { isEmpty } from "lodash"
import { createPortal } from "react-dom"
import { useTranslation } from "react-i18next"
import { AnimatePresence } from "framer-motion"
import { SpiralSpinner } from "react-spinners-kit"
import { generatePath, useNavigate } from "react-router-dom"

import { normalizeBigNumber } from "utils"
import { useBreakpoints, useInvestorPositionVests } from "hooks"
import { ICON_NAMES, MAX_PAGINATION_COUNT, ROUTE_PATHS } from "consts"
import { InvestorPositionInPoolContext } from "context/investor/positions/InvestorPositionInPoolContext"

import { NoDataMessage } from "common"
import { accordionSummaryVariants } from "motion/variants"

import Icon from "components/Icon"
import LoadMore from "components/LoadMore"
import TokenIcon from "components/TokenIcon"
import CardActions from "components/CardActions"
import CardPositionTrade from "components/CardPositionTrade"

import InvestorPositionCommission from "./InvestorPositionCommission"
import * as S from "./styled"

const CardInvestorPosition: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
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

  const desktopCommissionWrpElId = React.useMemo<string>(
    () => (!!position ? String("#commission-").concat(position.id) : ""),
    [position]
  )
  const [desktopCommissionWrpEl, setDesktopCommissionWrpEl] =
    React.useState<Element | null>(null)

  React.useEffect(() => {
    if (!isEmpty(desktopCommissionWrpElId) && isDesktop) {
      setDesktopCommissionWrpEl(
        document.querySelector(desktopCommissionWrpElId)
      )
    } else {
      setDesktopCommissionWrpEl(null)
    }
  }, [desktopCommissionWrpElId, isDesktop])

  const [showActions, setShowActions] = React.useState(false)
  const [showPositions, setShowPositions] = React.useState(false)
  const [showCommission, setShowCommission] = React.useState(false)

  const togglePositions = React.useCallback(() => {
    setShowPositions((prev) => !prev)

    if (!isDesktop && !showPositions && showCommission) {
      setShowCommission(false)
    }
  }, [isDesktop, showCommission, showPositions])

  const toggleCommission = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation()
      setShowCommission((prev) => !prev)

      if (!isDesktop && !showCommission && showPositions) {
        setShowPositions(false)
      }
    },
    [isDesktop, showCommission, showPositions]
  )

  const onCardClick = React.useCallback(
    (e: React.MouseEvent<HTMLElement>): void => {
      e.stopPropagation()
      if (isDesktop) {
        setShowPositions((prev) => !prev)
      } else {
        setShowActions((prev) => !prev)
        if (showPositions) setShowPositions(false)
        if (showCommission) setShowCommission(false)
      }
    },
    [isDesktop, showPositions, showCommission]
  )

  React.useEffect(() => {
    if (!isDesktop) {
      if (showCommission || showPositions) {
        setShowActions(true)
      }
      if (showCommission && showPositions) {
        setShowCommission(false)
        setShowPositions(true)
      }
    }
  }, [isDesktop, showCommission, showPositions])

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
      isDesktop
        ? []
        : [
            {
              label: t("investor-position-card.action-toggle-vests"),
              active: showPositions,
              onClick: togglePositions,
            },
            ...(!position.isClosed
              ? [
                  {
                    label: t("investor-position-card.action-invest"),
                    onClick: (e) => onNavigateTerminal(e, "deposit"),
                  },
                ]
              : []),
            {
              label: t("investor-position-card.action-toggle-commission"),
              active: showCommission,
              onClick: toggleCommission,
            },
            ...(!position.isClosed
              ? [
                  {
                    label: t("investor-position-card.action-divest--short"),
                    onClick: (e) => onNavigateTerminal(e, "withdraw"),
                  },
                ]
              : []),
          ],
    [
      t,
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
        onClick={onCardClick}
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
            {t("investor-position-card.label-entry-price", {
              currency: baseTokenSymbol,
            })}
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
            {t(
              position.isClosed
                ? "investor-position-card.label-closed-price"
                : "investor-position-card.label-current-price",
              {
                currency: baseTokenSymbol,
              }
            )}
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
            {t("investor-position-card.label-pnl", {
              currency: baseTokenSymbol,
            })}
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
            <S.CardInvestorPositionBodyItem onClick={toggleCommission}>
              <S.CardInvestorPositionBodyItemCommissionWrp>
                <S.CardInvestorPositionBodyItemAmount>
                  {normalizeBigNumber(commission.percentage, 25, 0)}%
                </S.CardInvestorPositionBodyItemAmount>
                <S.CardInvestorPositionBodyItemCommissionIconWrp
                  id={String("commission-").concat(position.id)}
                >
                  <S.CardInvestorPositionToggleIconIndicator
                    name={ICON_NAMES.angleDown}
                    isActive={showCommission}
                  />
                </S.CardInvestorPositionBodyItemCommissionIconWrp>
              </S.CardInvestorPositionBodyItemCommissionWrp>
            </S.CardInvestorPositionBodyItem>
            <S.CardInvestorPositionBodyItem>
              <S.CardInvestorPositionBodyItemActionsWrp>
                {!position.isClosed && (
                  <>
                    <S.ActionPositive
                      text={t("investor-position-card.action-invest")}
                      color={"default"}
                      size={"no-paddings"}
                      onClick={(e) => onNavigateTerminal(e, "deposit")}
                    />
                    <S.ActionNegative
                      text={t("investor-position-card.action-divest")}
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
        animate={showPositions ? "visible" : "hidden"}
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
                <CardPositionTrade
                  key={v.id}
                  isBuy={v.isInvest}
                  timestamp={v.timestamp}
                  amount={v.volumeBase}
                  priceBase={v.volumeLP}
                  priceUsd={v.volumeUSD}
                  baseTokenSymbol={baseTokenSymbol}
                  data={v}
                  itemMaxWidthLg={position.isClosed ? "134.5px" : "115.5px"}
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
      {isDesktop && desktopCommissionWrpEl ? (
        createPortal(
          <S.CardInvestorPositionCommissionWrp
            initial="hidden"
            animate={showCommission ? "visible" : "hidden"}
            variants={accordionSummaryVariants}
          >
            <InvestorPositionCommission />
          </S.CardInvestorPositionCommissionWrp>,
          desktopCommissionWrpEl
        )
      ) : (
        <S.CardInvestorPositionExtra
          initial="hidden"
          animate={showCommission ? "visible" : "hidden"}
          variants={accordionSummaryVariants}
        >
          <S.CardInvestorPositionCommissionWrp>
            <InvestorPositionCommission />
          </S.CardInvestorPositionCommissionWrp>
        </S.CardInvestorPositionExtra>
      )}
    </S.Root>
  )
}

export default CardInvestorPosition
