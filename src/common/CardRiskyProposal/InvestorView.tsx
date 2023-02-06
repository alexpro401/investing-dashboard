import * as React from "react"
import { useTranslation } from "react-i18next"
import { v4 as uuidv4 } from "uuid"
import { formatUnits } from "@ethersproject/units"

import * as S from "./styled"

import { useBreakpoints, useRiskyProposalView } from "hooks"
import { normalizeBigNumber } from "utils"
import { ICON_NAMES, ROUTE_PATHS } from "consts"

import { Flex } from "theme"
import { AppButton, Icon as IconCommon } from "common"

import Icon from "components/Icon"
import ReadMore from "components/ReadMore"
import TokenIcon from "components/TokenIcon"
import ExternalLink from "components/ExternalLink"
import ProgressColorized from "components/ProgressColorized"

import checkGreenIcon from "assets/icons/green-check.svg"
import traderBadgeDangerIcon from "assets/icons/trader-badge-danger.svg"
import traderBadgeWarningIcon from "assets/icons/trader-badge-warning.svg"
import traderBadgeSuccessIcon from "assets/icons/trader-badge-success.svg"
import { WrappedRiskyProposalView } from "types"
import { generatePath, useNavigate } from "react-router-dom"
import { accordionSummaryVariants } from "motion/variants"

function getTraderQualityIcon(quality) {
  switch (quality) {
    case "danger":
      return traderBadgeDangerIcon
    case "warning":
      return traderBadgeWarningIcon
    case "success":
    default:
      return traderBadgeSuccessIcon
  }
}

type Props = {
  payload: WrappedRiskyProposalView
}

const CardRiskyProposalInvestorMarkup: React.FC<Props> = ({ payload }) => {
  const {
    proposal,
    utilityIds,
    userActiveInvestmentsInfo,
    proposalTokenMarkPrice,
    poolInfo,
  } = payload
  const { proposalId, basicPoolAddress: poolAddress } = utilityIds

  const [
    {
      tokenRating,
      canInvest,
      proposalTokenLink,
      maxSizeLP,
      traderSizeLP,
      fullness,
      maxInvestPrice,
      expirationDate,
      investors,
      positionSize,
      traderSizePercentage,
      description,
      maximumPoolInvestors,
      poolMetadata,
      proposalToken,
    },
  ] = useRiskyProposalView(payload)

  const proposalTokenSymbol = React.useMemo<string>(
    () => proposalToken?.symbol ?? "",
    [proposalToken]
  )

  const { isDesktop } = useBreakpoints()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const navigateToPool = React.useCallback((): void => {
    navigate(
      generatePath(ROUTE_PATHS.poolProfile, {
        poolAddress: poolAddress,
        "*": "",
      })
    )
  }, [navigate, poolAddress])

  const onInvest = React.useCallback((): void => {
    navigate(
      generatePath(ROUTE_PATHS.riskyProposalSwap, {
        poolAddress,
        proposalId: String(proposalId),
        direction: "deposit",
      })
    )
  }, [navigate, poolAddress, proposalId])

  return (
    <S.Root>
      <S.CardRiskyProposalBody>
        <S.CardRiskyProposalGrid isTrader={false}>
          <S.CardRiskyProposalGridItemToken>
            <S.CardRiskyProposalTokenWrp>
              <TokenIcon
                m="0"
                size={isDesktop ? 36 : 24}
                address={proposal.proposalInfo.token}
              />
              <S.CardRiskyProposalTokenInfoWrp>
                <S.CardRiskyProposalTokenInfoLabel>
                  {t("risky-proposal-card.label-proposal-token")}
                </S.CardRiskyProposalTokenInfoLabel>

                <S.CardRiskyProposalTokenInfoValue
                  as="a"
                  target="_blank"
                  href={proposalTokenLink}
                  rel="noopener noreferrer"
                >
                  {proposalTokenSymbol}
                  <S.CardRiskyProposalTokenInfoIcon
                    name={ICON_NAMES.externalLink}
                  />
                </S.CardRiskyProposalTokenInfoValue>
                <S.CardRiskyProposalTokenInfoRating rating={tokenRating} />
                <S.CardRiskyProposalTokenInfoTooltip
                  id={uuidv4()}
                  size={isDesktop ? "normal" : "small"}
                >
                  {t("risky-proposal-card.tooltip-msg-rating")}
                </S.CardRiskyProposalTokenInfoTooltip>
              </S.CardRiskyProposalTokenInfoWrp>
            </S.CardRiskyProposalTokenWrp>
          </S.CardRiskyProposalGridItemToken>

          <S.CardRiskyProposalGridItemBaseToken onClick={navigateToPool}>
            <S.CardRiskyProposalBaseTokenWrp>
              <S.CardRiskyProposalValueWrp
                alignment={!isDesktop ? "flex-end" : undefined}
              >
                {isDesktop && (
                  <S.CardRiskyProposalLabel>
                    {t("risky-proposal-card.label-fund-ticker")}
                  </S.CardRiskyProposalLabel>
                )}
                <S.CardRiskyProposalValue completed={!isDesktop}>
                  {poolInfo?.ticker ?? ""}
                </S.CardRiskyProposalValue>
              </S.CardRiskyProposalValueWrp>
              <TokenIcon
                m="0"
                size={isDesktop ? 36 : 24}
                address={poolInfo?.parameters.baseToken}
              />
            </S.CardRiskyProposalBaseTokenWrp>
          </S.CardRiskyProposalGridItemBaseToken>

          <S.CardRiskyProposalGridItemDividerTop />

          <S.CardRiskyProposalGridItemMaxSize>
            <S.CardRiskyProposalValueWrp>
              <S.CardRiskyProposalLabel>
                <S.CardRiskyProposalLabelContent>
                  <span>
                    {t("risky-proposal-card.label-max-size", {
                      currency: "LP",
                    })}
                  </span>
                  <S.CardRiskyProposalLabelTooltip id={uuidv4()}>
                    {t("risky-proposal-card.tooltip-msg-max-size")}
                  </S.CardRiskyProposalLabelTooltip>
                </S.CardRiskyProposalLabelContent>
              </S.CardRiskyProposalLabel>
              <S.CardRiskyProposalValue>
                {normalizeBigNumber(maxSizeLP, 18, 6)}
              </S.CardRiskyProposalValue>
            </S.CardRiskyProposalValueWrp>
          </S.CardRiskyProposalGridItemMaxSize>

          <S.CardRiskyProposalGridItemCurrentUserSize>
            <S.CardRiskyProposalValueWrp>
              <S.CardRiskyProposalLabel>
                <S.CardRiskyProposalLabelContent>
                  {t("risky-proposal-card.label-your-size", {
                    currency: "LP",
                  })}
                  <S.CardRiskyProposalLabelTooltip id={uuidv4()}>
                    {t("risky-proposal-card.tooltip-msg-your-size")}
                  </S.CardRiskyProposalLabelTooltip>
                </S.CardRiskyProposalLabelContent>
              </S.CardRiskyProposalLabel>
              <S.CardRiskyProposalValue>
                {normalizeBigNumber(
                  userActiveInvestmentsInfo.lpInvested,
                  18,
                  6
                )}
              </S.CardRiskyProposalValue>
            </S.CardRiskyProposalValueWrp>
          </S.CardRiskyProposalGridItemCurrentUserSize>

          <S.CardRiskyProposalGridItemFullness>
            <S.CardRiskyProposalValueWrp
              alignment={!isDesktop ? "flex-end" : undefined}
            >
              <S.CardRiskyProposalLabel>
                <S.CardRiskyProposalLabelContent>
                  <span>
                    {t("risky-proposal-card.label-fullness", {
                      currency: "LP",
                    })}
                  </span>
                  <S.CardRiskyProposalLabelTooltip id={uuidv4()}>
                    {t("risky-proposal-card.tooltip-msg-fullness")}
                  </S.CardRiskyProposalLabelTooltip>
                  <S.CardRiskyProposalLabelIcon
                    src={checkGreenIcon}
                    initial="hidden"
                    animate={fullness.completed ? "visible" : "hidden"}
                    variants={accordionSummaryVariants}
                  />
                </S.CardRiskyProposalLabelContent>
              </S.CardRiskyProposalLabel>
              <S.CardRiskyProposalValue completed={fullness.completed}>
                {normalizeBigNumber(fullness.value, 18, 6)}
              </S.CardRiskyProposalValue>
            </S.CardRiskyProposalValueWrp>
          </S.CardRiskyProposalGridItemFullness>

          <S.CardRiskyProposalGridItemMaxInvestPrice>
            <S.CardRiskyProposalValueWrp>
              <S.CardRiskyProposalLabel>
                <S.CardRiskyProposalLabelContent>
                  <span>
                    {t("risky-proposal-card.label-max-invest-price", {
                      currency: proposalTokenSymbol,
                    })}
                  </span>
                  <S.CardRiskyProposalLabelTooltip id={uuidv4()}>
                    {t("risky-proposal-card.tooltip-msg-max-invest-price")}
                  </S.CardRiskyProposalLabelTooltip>
                  <S.CardRiskyProposalLabelIcon
                    src={checkGreenIcon}
                    initial="hidden"
                    animate={maxInvestPrice.completed ? "visible" : "hidden"}
                    variants={accordionSummaryVariants}
                  />
                </S.CardRiskyProposalLabelContent>
              </S.CardRiskyProposalLabel>
              <S.CardRiskyProposalValue completed={maxInvestPrice.completed}>
                {normalizeBigNumber(maxInvestPrice.value, 18, 2)}
              </S.CardRiskyProposalValue>
            </S.CardRiskyProposalValueWrp>
          </S.CardRiskyProposalGridItemMaxInvestPrice>

          <S.CardRiskyProposalGridItemCurrentPrice>
            <S.CardRiskyProposalValueWrp>
              <S.CardRiskyProposalLabel>
                <S.CardRiskyProposalLabelContent>
                  <span>
                    {t("risky-proposal-card.label-current-price", {
                      currency: proposalTokenSymbol,
                    })}
                  </span>
                  <S.CardRiskyProposalLabelTooltip id={uuidv4()}>
                    {t("risky-proposal-card.tooltip-msg-current-price")}
                  </S.CardRiskyProposalLabelTooltip>
                </S.CardRiskyProposalLabelContent>
              </S.CardRiskyProposalLabel>
              <S.CardRiskyProposalValue>
                {normalizeBigNumber(proposalTokenMarkPrice, 18, 2)}
              </S.CardRiskyProposalValue>
            </S.CardRiskyProposalValueWrp>
          </S.CardRiskyProposalGridItemCurrentPrice>

          <S.CardRiskyProposalGridItemExpirationDate>
            <S.CardRiskyProposalValueWrp
              alignment={!isDesktop ? "flex-end" : undefined}
            >
              <S.CardRiskyProposalLabel>
                <S.CardRiskyProposalLabelContent>
                  <span>{t("risky-proposal-card.label-expiration-date")}</span>
                  <S.CardRiskyProposalLabelTooltip id={uuidv4()}>
                    {t("risky-proposal-card.tooltip-msg-expiration-date")}
                  </S.CardRiskyProposalLabelTooltip>
                  <S.CardRiskyProposalLabelIcon
                    src={checkGreenIcon}
                    initial="hidden"
                    animate={expirationDate.completed ? "visible" : "hidden"}
                    variants={accordionSummaryVariants}
                  />
                </S.CardRiskyProposalLabelContent>
              </S.CardRiskyProposalLabel>
              <S.CardRiskyProposalValue
                completed={expirationDate.completed}
                small={!isDesktop}
              >
                {expirationDate.value}
              </S.CardRiskyProposalValue>
            </S.CardRiskyProposalValueWrp>
          </S.CardRiskyProposalGridItemExpirationDate>

          <S.CardRiskyProposalGridItemInvestors>
            <S.CardRiskyProposalValueWrp>
              <S.CardRiskyProposalLabel>
                <S.CardRiskyProposalLabelContent>
                  <span>{t("risky-proposal-card.label-investors")}</span>
                  <S.CardRiskyProposalLabelTooltip id={uuidv4()}>
                    {t("risky-proposal-card.tooltip-msg-investors")}
                  </S.CardRiskyProposalLabelTooltip>
                  <S.CardRiskyProposalLabelIcon
                    src={checkGreenIcon}
                    initial="hidden"
                    animate={investors.completed ? "visible" : "hidden"}
                    variants={accordionSummaryVariants}
                  />
                </S.CardRiskyProposalLabelContent>
              </S.CardRiskyProposalLabel>
              <S.CardRiskyProposalValue completed={investors.completed}>
                {investors.value.toString()}{" "}
                <span>/ {formatUnits(maximumPoolInvestors, "wei")}</span>
              </S.CardRiskyProposalValue>
            </S.CardRiskyProposalValueWrp>
          </S.CardRiskyProposalGridItemInvestors>

          <S.CardRiskyProposalGridItemPositionSize>
            <S.CardRiskyProposalValueWrp>
              <S.CardRiskyProposalLabel>
                <S.CardRiskyProposalLabelContent>
                  <span>
                    {t("risky-proposal-card.label-position-size", {
                      currency: proposalTokenSymbol,
                    })}
                  </span>
                  <S.CardRiskyProposalLabelTooltip id={uuidv4()}>
                    {t("risky-proposal-card.tooltip-msg-position-size")}
                  </S.CardRiskyProposalLabelTooltip>
                </S.CardRiskyProposalLabelContent>
              </S.CardRiskyProposalLabel>
              <S.CardRiskyProposalValue>
                {normalizeBigNumber(positionSize, 18, 6)}
              </S.CardRiskyProposalValue>
            </S.CardRiskyProposalValueWrp>
          </S.CardRiskyProposalGridItemPositionSize>

          <S.CardRiskyProposalGridItemInvestAction>
            <AppButton
              full
              text={t("risky-proposal-card.action-stake")}
              onClick={onInvest}
              size="x-small"
              disabled={!canInvest}
              color={canInvest ? "tertiary" : "secondary"}
            />
          </S.CardRiskyProposalGridItemInvestAction>

          <S.CardRiskyProposalGridItemDescription>
            <S.CardRiskyProposalDescriptionWrp>
              {isDesktop && <IconCommon name={ICON_NAMES.fileDock} />}
              <ReadMore
                content={
                  description.length > 0
                    ? description
                    : t("risky-proposal-card.empty-description-msg")
                }
                maxLen={isDesktop ? 140 : undefined}
              />
            </S.CardRiskyProposalDescriptionWrp>
          </S.CardRiskyProposalGridItemDescription>

          <S.CardRiskyProposalGridItemDividerBottom />

          <S.CardRiskyProposalGridItemTraderSize>
            {isDesktop && (
              <S.CardRiskyProposalValueWrp>
                <S.CardRiskyProposalLabel>
                  <S.CardRiskyProposalLabelContent>
                    <span>
                      {t("risky-proposal-card.label-trader-size", {
                        currency: "LP",
                      })}
                    </span>
                    <S.CardRiskyProposalLabelTooltip id={uuidv4()}>
                      {t("risky-proposal-card.tooltip-msg-trader-size")}
                    </S.CardRiskyProposalLabelTooltip>
                  </S.CardRiskyProposalLabelContent>
                </S.CardRiskyProposalLabel>
                <S.CardRiskyProposalValue>
                  <Flex gap={"4"} ai={"center"}>
                    <IconCommon name={ICON_NAMES.warnCircledFilled} />
                    {normalizeBigNumber(traderSizeLP, 18, 2)} (
                    {normalizeBigNumber(traderSizePercentage, 18, 2)}%)
                  </Flex>
                </S.CardRiskyProposalValue>
              </S.CardRiskyProposalValueWrp>
            )}
            <S.CardRiskyProposalTraderSizeWrp>
              <S.CardRiskyProposalTraderSizeIconWrp>
                <Icon
                  size={24}
                  m="0"
                  source={poolMetadata?.assets[poolMetadata?.assets.length - 1]}
                  address={poolAddress}
                />
                <S.CardRiskyProposalTraderSizeQualityIcon
                  src={getTraderQualityIcon(undefined)}
                />
              </S.CardRiskyProposalTraderSizeIconWrp>
              <S.CardRiskyProposalTraderSizeInfoWrp>
                <S.CardRiskyProposalTraderSizeText>
                  {t("risky-proposal-card.values-trader-size", {
                    value: normalizeBigNumber(traderSizeLP, 18, 2),
                    currency: "LP",
                    percent: normalizeBigNumber(traderSizePercentage, 18, 2),
                  })}
                </S.CardRiskyProposalTraderSizeText>
                <S.CardRiskyProposalTraderSizeProgressWrp>
                  <ProgressColorized
                    size={Number(
                      normalizeBigNumber(traderSizePercentage, 18, 2)
                    )}
                  />
                </S.CardRiskyProposalTraderSizeProgressWrp>
              </S.CardRiskyProposalTraderSizeInfoWrp>
            </S.CardRiskyProposalTraderSizeWrp>
          </S.CardRiskyProposalGridItemTraderSize>

          <S.CardRiskyProposalGridItemCheckToken>
            <S.CardRiskyProposalCheckTokenWrp>
              <ExternalLink color="#2680EB" href={proposalTokenLink}>
                {t("risky-proposal-card.action-check-token")}
              </ExternalLink>
            </S.CardRiskyProposalCheckTokenWrp>
          </S.CardRiskyProposalGridItemCheckToken>
        </S.CardRiskyProposalGrid>
      </S.CardRiskyProposalBody>
    </S.Root>
  )
}

export default React.memo(CardRiskyProposalInvestorMarkup)
