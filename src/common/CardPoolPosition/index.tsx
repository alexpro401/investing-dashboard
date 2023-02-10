import * as React from "react"
import { AnimatePresence } from "framer-motion"

import * as S from "./styled"
import usePoolPosition from "./usePoolPosition"

import { NoDataMessage } from "common"
import { accordionSummaryVariants } from "motion/variants"

import Icon from "components/Icon"
import TokenIcon from "components/TokenIcon"
import CardActions from "components/CardActions"
import CardPositionTrade from "components/CardPositionTrade"

import { ICON_NAMES, MAX_PAGINATION_COUNT } from "consts"
import { useBreakpoints, usePoolPositionExchangesList } from "hooks"
import { normalizeBigNumber } from "utils"
import { IPosition } from "interfaces/thegraphs/all-pools"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import LoadMore from "components/LoadMore"
import { isEmpty } from "lodash"
import { SpiralSpinner } from "react-spinners-kit"

interface Props {
  position: IPosition
}

const CardPoolPosition: React.FC<Props> = ({ position }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
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
      poolType,
    },
  ] = usePoolPosition(position)

  const [showActions, setShowActions] = React.useState(false)
  const [showPositions, setShowPositions] = React.useState(false)

  const togglePositions = React.useCallback(() => {
    setShowPositions((prev) => !prev)
  }, [])

  const onCardClick = React.useCallback(
    (e: React.MouseEvent<HTMLElement>): void => {
      e.stopPropagation()
      if (isDesktop) {
        togglePositions()
      } else {
        setShowActions((prev) => !prev)
        if (showPositions) setShowPositions(false)
      }
    },
    [isDesktop, showPositions, togglePositions]
  )

  React.useEffect(() => {
    if (!isDesktop && showPositions && !showActions) {
      setShowActions(true)
      return
    }

    if (isDesktop && !showPositions && showActions) {
      setShowPositions(true)
      return
    }
  }, [isDesktop])

  const onTerminalNavigate = React.useCallback(
    (e: React.MouseEvent<HTMLElement>, isInvest = true) => {
      e.stopPropagation()

      if (
        !position.traderPool.id ||
        !poolType ||
        !positionToken ||
        !baseToken
      ) {
        return
      }

      let url = `/pool/swap/${poolType}/${position.traderPool.id}`

      if (isInvest) {
        url += `/${baseToken}/${positionToken}`
      } else {
        url += `/${positionToken}/${baseToken}`
      }

      navigate(url, {
        state: {
          pathname: `/fund-positions/${position.traderPool.id}/${
            position.closed ? "closed" : "open"
          }`,
        },
      })
    },
    [baseToken, navigate, position, poolType, positionToken]
  )

  const baseSymbol = React.useMemo(() => baseToken?.symbol ?? "", [baseToken])
  const positionTokenymbol = React.useMemo(
    () => positionToken?.symbol ?? "",
    [positionToken]
  )

  const actions = React.useMemo(
    () =>
      isDesktop
        ? []
        : [
            {
              label: t("card-pool-position.action-toggle-positions"),
              active: showPositions,
              onClick: togglePositions,
            },
            {
              label: t("card-pool-position.action-invest"),
              onClick: (e: React.MouseEvent<HTMLElement>) =>
                onTerminalNavigate(e, true),
            },
            {
              label: t("card-pool-position.action-divest"),
              onClick: (e: React.MouseEvent<HTMLElement>) =>
                onTerminalNavigate(e, false),
            },
          ],
    [t, showPositions, onTerminalNavigate, togglePositions, isDesktop]
  )

  const [
    { data: exchanges, loading: loadingExchanges },
    fetchMoreExchanges,
    resetExchanges,
  ] = usePoolPositionExchangesList(position.id, !showPositions)

  React.useEffect(() => {
    if (!showPositions) {
      resetExchanges()
    }
  }, [showPositions, resetExchanges])

  return (
    <S.Root>
      <S.CardPoolPositionBody
        onClick={onCardClick}
        sharpBottomCorners={showPositions}
        bigGap={position.closed}
      >
        <S.CardPoolPositionBodyItem gridEnd={2}>
          <S.CardPoolPositionBodyTokensWrp>
            {isDesktop ? (
              <Icon
                m="0"
                size={32}
                source={poolMetadata?.assets[poolMetadata?.assets.length - 1]}
                address={position?.traderPool?.id}
              />
            ) : (
              <>
                <TokenIcon
                  address={position.positionToken}
                  m="0"
                  size={isDesktop ? 32 : 24}
                />
                <S.CardPoolPositionBodyItemAmount>
                  {normalizeBigNumber(currentPositionVolume, 18, 6)}
                </S.CardPoolPositionBodyItemAmount>
              </>
            )}

            <S.CardPoolPositionBodyItemAmount>
              {positionTokenymbol}
            </S.CardPoolPositionBodyItemAmount>
          </S.CardPoolPositionBodyTokensWrp>
        </S.CardPoolPositionBodyItem>

        <S.CardPoolPositionBodyItem textAlign={isDesktop ? "initial" : "end"}>
          <S.CardPoolPositionBodyVolumeWrp>
            {isDesktop ? (
              <>
                <TokenIcon address={position.positionToken} m="0" size={32} />
                <S.CardPoolPositionBodyVolumeInfoWrp>
                  <S.CardPoolPositionBodyItemAmount>
                    {normalizeBigNumber(currentPositionVolume, 18, 6)}
                  </S.CardPoolPositionBodyItemAmount>

                  <S.PNL value={normalizeBigNumber(pnlPercentage, 18, 2)}>
                    {normalizeBigNumber(pnlPercentage, 18, 2)}%
                  </S.PNL>
                </S.CardPoolPositionBodyVolumeInfoWrp>
              </>
            ) : (
              <S.PNL value={normalizeBigNumber(pnlPercentage, 18, 2)}>
                {normalizeBigNumber(pnlPercentage, 18, 2)}%
              </S.PNL>
            )}
          </S.CardPoolPositionBodyVolumeWrp>
        </S.CardPoolPositionBodyItem>

        <S.CardInvestorPositionDivider />

        <S.CardPoolPositionBodyItemGrid>
          <S.CardPoolPositionBodyItemLabel>
            {t("card-pool-position.label-entry-price", {
              currency: baseSymbol,
            })}
          </S.CardPoolPositionBodyItemLabel>
          <S.CardPoolPositionBodyItemAmount>
            {normalizeBigNumber(entryPriceBase, 18, 6)}
          </S.CardPoolPositionBodyItemAmount>
          <S.CardInvestorPositionBodyItemPrice>
            {entryPriceUSD.isNegative() && "-"}$
            {normalizeBigNumber(entryPriceUSD.abs(), 18, 2)}
          </S.CardInvestorPositionBodyItemPrice>
        </S.CardPoolPositionBodyItemGrid>

        <S.CardPoolPositionBodyItemGrid>
          <S.CardPoolPositionBodyItemLabel>
            {t(
              position.closed
                ? "card-pool-position.label-closed-price"
                : "card-pool-position.label-current-price",
              {
                currency: baseSymbol,
              }
            )}
          </S.CardPoolPositionBodyItemLabel>
          <S.CardPoolPositionBodyItemAmount>
            {normalizeBigNumber(markPriceBase, 18, 6)}
          </S.CardPoolPositionBodyItemAmount>
          <S.CardInvestorPositionBodyItemPrice>
            {markPriceUSD.isNegative() && "-"}$
            {normalizeBigNumber(markPriceUSD.abs(), 18, 2)}
          </S.CardInvestorPositionBodyItemPrice>
        </S.CardPoolPositionBodyItemGrid>

        <S.CardPoolPositionBodyItemGrid
          textAlign={!isDesktop ? "right" : "initial"}
        >
          <S.CardPoolPositionBodyItemLabel>
            {t("card-pool-position.label-pnl", {
              currency: baseSymbol,
            })}
          </S.CardPoolPositionBodyItemLabel>
          <S.CardPoolPositionBodyItemAmount>
            {normalizeBigNumber(pnlBase, 18, 6)}
          </S.CardPoolPositionBodyItemAmount>
          <S.CardInvestorPositionBodyItemPrice>
            {pnlUSD.isNegative() && "-"}$
            {normalizeBigNumber(pnlUSD.abs(), 18, 2)}
          </S.CardInvestorPositionBodyItemPrice>
        </S.CardPoolPositionBodyItemGrid>

        {isDesktop && (
          <S.CardPoolPositionBodyItem>
            <S.CardPoolPositionBodyItemActionsWrp>
              {!position.closed && (
                <>
                  <S.ActionPositive
                    text={t("card-pool-position.action-invest")}
                    onClick={(e) => onTerminalNavigate(e, true)}
                    color={"default"}
                    size={"no-paddings"}
                  />
                  <S.ActionNegative
                    text={t("card-pool-position.action-divest")}
                    onClick={(e) => onTerminalNavigate(e, false)}
                    color={"default"}
                    size={"no-paddings"}
                  />
                </>
              )}
              <S.CardPoolPositionToggleIconIndicator
                name={ICON_NAMES.angleDown}
                isActive={showPositions}
              />
            </S.CardPoolPositionBodyItemActionsWrp>
          </S.CardPoolPositionBodyItem>
        )}
      </S.CardPoolPositionBody>

      <AnimatePresence>
        <CardActions actions={actions} visible={showActions} />
      </AnimatePresence>

      <S.CardPoolPositionExtra
        initial="hidden"
        variants={accordionSummaryVariants}
        animate={showPositions ? "visible" : "hidden"}
      >
        <S.CardPoolPositionExchangesWrp>
          {isEmpty(exchanges) && loadingExchanges && (
            <S.CardPoolPositionExchangesLoaderWrp>
              <SpiralSpinner size={30} loading />
            </S.CardPoolPositionExchangesLoaderWrp>
          )}
          {isEmpty(exchanges) && !loadingExchanges && <NoDataMessage />}
          {!isEmpty(exchanges) ? (
            <>
              {exchanges.map((e) => (
                <CardPositionTrade
                  key={e.id}
                  data={e}
                  baseTokenSymbol={baseSymbol}
                  timestamp={e.timestamp.toString()}
                  isBuy={e.opening}
                  amount={e.opening ? e.toVolume : e.fromVolume}
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
        </S.CardPoolPositionExchangesWrp>
      </S.CardPoolPositionExtra>
    </S.Root>
  )
}

export default CardPoolPosition
