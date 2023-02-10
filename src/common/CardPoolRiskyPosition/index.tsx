import * as React from "react"
import { generatePath, useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { isEmpty } from "lodash"
import { useTranslation } from "react-i18next"
import { SpiralSpinner } from "react-spinners-kit"

import {
  useBreakpoints,
  usePoolRiskyPositionsExchangesList,
  usePoolRiskyPositionView,
} from "hooks"
import { normalizeBigNumber } from "utils"
import { IPoolInfo } from "interfaces/contracts/ITraderPool"
import { WrappedPoolRiskyProposalPositionView } from "interfaces/thegraphs/basic-pools"
import { ICON_NAMES, MAX_PAGINATION_COUNT, ROUTE_PATHS } from "consts"

import { NoDataMessage } from "common"
import { accordionSummaryVariants } from "motion/variants"

import Icon from "components/Icon"
import LoadMore from "components/LoadMore"
import TokenIcon from "components/TokenIcon"
import CardActions from "components/CardActions"
import CardPositionTrade from "components/CardPositionTrade"

import * as S from "./styled"

interface Props {
  payload: WrappedPoolRiskyProposalPositionView
  isTrader: boolean
  poolInfo: IPoolInfo
  poolMetadata: any
}

const CardPoolRiskyPosition: React.FC<Props> = ({
  payload,
  isTrader,
  poolInfo,
  poolMetadata,
}) => {
  const { position, utilityIds } = payload
  const { isDesktop } = useBreakpoints()
  const navigate = useNavigate()
  const { t } = useTranslation()

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
      proposalToken,
      poolBaseToken,
    },
  ] = usePoolRiskyPositionView(position, utilityIds)

  const [showActions, setShowActions] = React.useState(false)
  const [showExchanges, setShowExchanges] = React.useState(false)

  const togglePositions = React.useCallback(() => {
    setShowExchanges((prev) => !prev)
  }, [])

  const onCardClick = React.useCallback(
    (e: React.MouseEvent<HTMLElement>): void => {
      e.stopPropagation()
      if (isDesktop || isTrader) {
        togglePositions()
      } else {
        setShowActions((prev) => !prev)
        if (showExchanges) setShowExchanges(false)
      }
    },
    [isDesktop, isTrader, showExchanges, togglePositions]
  )

  const positionTokenSymbol = React.useMemo(
    () => proposalToken?.symbol ?? "",
    [proposalToken]
  )

  const baseTokenSymbol = React.useMemo(
    () => poolBaseToken?.symbol ?? "",
    [poolBaseToken]
  )

  /**
   * Navigate to pool page
   * @param e - click event
   */
  const navigateToPool = React.useCallback(
    (e: React.MouseEvent<HTMLElement>): void => {
      e.stopPropagation()
      navigate(
        generatePath(ROUTE_PATHS.poolProfile, {
          poolAddress: utilityIds.poolAddress,
          "*": "",
        })
      )
    },
    [navigate, utilityIds]
  )

  /**
   * Share closed position to social networks
   * @param e - click event
   */
  const onShare = React.useCallback(
    (e: React.MouseEvent<HTMLElement>): void => {
      e.stopPropagation()
      console.log("On share")
    },
    []
  )

  const onNavigateTerminal = React.useCallback(
    (e: React.MouseEvent<HTMLElement>, direction: "deposit" | "withdraw") => {
      e.stopPropagation()

      navigate(
        generatePath(ROUTE_PATHS.riskyProposalSwap, {
          poolAddress: utilityIds.poolAddress,
          proposalId: String(utilityIds.proposalId ?? 1),
          direction: direction,
        })
      )
    },
    [navigate, utilityIds]
  )

  const actions = React.useMemo(
    () =>
      isDesktop || isTrader
        ? []
        : [
            {
              label: t("card-pool-risky-position.action-toggle-exchanges"),
              active: showExchanges,
              onClick: togglePositions,
            },
            {
              label: t("card-pool-risky-position.action-invest"),
              onClick: (e) => onNavigateTerminal(e, "deposit"),
            },
            {
              label: t("card-pool-risky-position.action-divest"),
              onClick: (e) => onNavigateTerminal(e, "withdraw"),
            },
          ],
    [t, isDesktop, isTrader, showExchanges, togglePositions, onNavigateTerminal]
  )

  const [
    { data: exchanges, loading: loadingExchanges },
    fetchMoreExchanges,
    resetExchanges,
  ] = usePoolRiskyPositionsExchangesList(position.id, !showExchanges)

  React.useEffect(() => {
    if (!showExchanges) {
      resetExchanges()
    }
  }, [showExchanges, resetExchanges])

  return (
    <S.Root>
      <S.CardPoolRiskyPositionBody
        onClick={onCardClick}
        isSharpBorders={showExchanges}
      >
        <S.CardPoolRiskyPositionBodyItemTokensWrp gridEnd={2}>
          <S.CardPoolRiskyPositionTokensWrp>
            <S.CardPoolRiskyPositionTokensIconsWrp>
              <S.CardPoolRiskyPositionTokensIconPool>
                <TokenIcon address={proposalToken?.address} m="0" size={24} />
              </S.CardPoolRiskyPositionTokensIconPool>
              <S.CardPoolRiskyPositionTokensIconProposal>
                <TokenIcon
                  m="0"
                  size={26}
                  address={utilityIds.poolBaseTokenAddress}
                />
              </S.CardPoolRiskyPositionTokensIconProposal>
            </S.CardPoolRiskyPositionTokensIconsWrp>
            <S.CardPoolRiskyPositionSizeWrp>
              {position.isClosed ? (
                <S.CardPoolRiskyPositionBodyItemAmount>
                  {t("card-pool-risky-position.amount-lp2", {
                    amount: normalizeBigNumber(positionVolume, 18, 6),
                  })}
                </S.CardPoolRiskyPositionBodyItemAmount>
              ) : (
                <S.CardPoolRiskyPositionTokenNamesWrp>
                  <S.CardPoolRiskyPositionTokenNameProposal>
                    {positionTokenSymbol}
                  </S.CardPoolRiskyPositionTokenNameProposal>
                  <S.CardPoolRiskyPositionTokenNamePool>
                    /{baseTokenSymbol}
                  </S.CardPoolRiskyPositionTokenNamePool>
                </S.CardPoolRiskyPositionTokenNamesWrp>
              )}
              <S.CardPoolRiskyPositionPnlChip
                value={normalizeBigNumber(pnlPercentage, 18, 2)}
              >
                {normalizeBigNumber(pnlPercentage, 18, 2)}%
              </S.CardPoolRiskyPositionPnlChip>
            </S.CardPoolRiskyPositionSizeWrp>
          </S.CardPoolRiskyPositionTokensWrp>
        </S.CardPoolRiskyPositionBodyItemTokensWrp>

        <S.CardPoolRiskyPositionBodyItemPoolInfoWrp
          textAlign={"end"}
          onClick={navigateToPool}
        >
          <S.CardPoolRiskyPositionPoolInfoWrp>
            <S.CardPoolRiskyPositionPoolInfoName>
              {poolInfo?.ticker ?? ""}
            </S.CardPoolRiskyPositionPoolInfoName>
            <Icon
              m="0"
              size={isDesktop ? 32 : 26}
              source={poolMetadata?.assets[poolMetadata?.assets.length - 1]}
              address={utilityIds.poolAddress}
            />
          </S.CardPoolRiskyPositionPoolInfoWrp>
        </S.CardPoolRiskyPositionBodyItemPoolInfoWrp>

        <S.CardPoolRiskyPositionDivider />

        <S.CardPoolRiskyPositionBodyItemGrid>
          <S.CardPoolRiskyPositionBodyItemLabel>
            {t("card-pool-risky-position.label-entry-price", {
              currency: baseTokenSymbol,
            })}
          </S.CardPoolRiskyPositionBodyItemLabel>
          <S.CardPoolRiskyPositionBodyItemAmount>
            {normalizeBigNumber(entryPriceBase, 18, 6)}
          </S.CardPoolRiskyPositionBodyItemAmount>
          <S.CardPoolRiskyPositionBodyItemPrice>
            {entryPriceUSD.isNegative() && "-"}$
            {normalizeBigNumber(entryPriceUSD.abs(), 18, 2)}
          </S.CardPoolRiskyPositionBodyItemPrice>
        </S.CardPoolRiskyPositionBodyItemGrid>

        <S.CardPoolRiskyPositionBodyItemGrid>
          <S.CardPoolRiskyPositionBodyItemLabel>
            {t(
              position.isClosed
                ? "card-pool-risky-position.label-closed-price"
                : "card-pool-risky-position.label-current-price",
              {
                currency: baseTokenSymbol,
              }
            )}
          </S.CardPoolRiskyPositionBodyItemLabel>
          <S.CardPoolRiskyPositionBodyItemAmount>
            {normalizeBigNumber(markPriceBase, 18, 6)}
          </S.CardPoolRiskyPositionBodyItemAmount>
          <S.CardPoolRiskyPositionBodyItemPrice>
            {markPriceUSD.isNegative() && "-"}$
            {normalizeBigNumber(markPriceUSD.abs(), 18, 2)}
          </S.CardPoolRiskyPositionBodyItemPrice>
        </S.CardPoolRiskyPositionBodyItemGrid>

        <S.CardPoolRiskyPositionBodyItemGrid textAlign={"end"}>
          <S.CardPoolRiskyPositionBodyItemLabel>
            {t("card-pool-risky-position.label-pnl", {
              currency: baseTokenSymbol,
            })}
          </S.CardPoolRiskyPositionBodyItemLabel>
          <S.CardPoolRiskyPositionBodyItemAmount>
            {normalizeBigNumber(pnlBase, 18, 6)}
          </S.CardPoolRiskyPositionBodyItemAmount>
          <S.CardPoolRiskyPositionBodyItemPrice>
            {pnlUSD.isNegative() && "-"}$
            {normalizeBigNumber(pnlUSD.abs(), 18, 2)}
          </S.CardPoolRiskyPositionBodyItemPrice>
        </S.CardPoolRiskyPositionBodyItemGrid>

        {isDesktop && (
          <S.CardPoolRiskyPositionBodyItem>
            <S.CardPoolRiskyPositionBodyItemActionsWrp>
              {!position.isClosed && (
                <>
                  <S.ActionPositive
                    text={t("card-pool-risky-position.action-invest")}
                    color={"default"}
                    size={"no-paddings"}
                    onClick={(e) => onNavigateTerminal(e, "deposit")}
                  />
                  <S.ActionNegative
                    text={t("card-pool-risky-position.action-divest")}
                    color={"default"}
                    size={"no-paddings"}
                    onClick={(e) => onNavigateTerminal(e, "withdraw")}
                  />
                </>
              )}
              <S.CardPoolRiskyPositionToggleIconIndicator
                name={ICON_NAMES.angleDown}
                isActive={showExchanges}
              />
            </S.CardPoolRiskyPositionBodyItemActionsWrp>
          </S.CardPoolRiskyPositionBodyItem>
        )}
      </S.CardPoolRiskyPositionBody>

      <AnimatePresence>
        <CardActions actions={actions} visible={showActions} />
      </AnimatePresence>

      <S.CardPoolRiskyPositionExtra
        initial="hidden"
        animate={showExchanges ? "visible" : "hidden"}
        variants={accordionSummaryVariants}
      >
        <S.CardPoolRiskyPositionExchangesWrp>
          {isEmpty(exchanges) && loadingExchanges && (
            <S.CardPoolRiskyPositionExchangesLoaderWrp>
              <SpiralSpinner size={30} loading />
            </S.CardPoolRiskyPositionExchangesLoaderWrp>
          )}
          {isEmpty(exchanges) && !loadingExchanges && <NoDataMessage />}
          {!isEmpty(exchanges) ? (
            <>
              {exchanges.map((e) => (
                <CardPositionTrade
                  data={e}
                  key={e.id}
                  timestamp={e.timestamp}
                  isBuy={e.fromToken !== utilityIds.proposalTokenAddress}
                  amount={
                    e.fromToken !== utilityIds.proposalTokenAddress
                      ? e.toVolume
                      : e.fromVolume
                  }
                  baseTokenSymbol={baseTokenSymbol}
                  itemMaxWidthLg={"155px"}
                />
              ))}
              {exchanges.length >= MAX_PAGINATION_COUNT && (
                <LoadMore
                  isLoading={loadingExchanges && !!exchanges.length}
                  handleMore={fetchMoreExchanges}
                />
              )}
            </>
          ) : null}
        </S.CardPoolRiskyPositionExchangesWrp>
      </S.CardPoolRiskyPositionExtra>
    </S.Root>
  )
}

export default CardPoolRiskyPosition
