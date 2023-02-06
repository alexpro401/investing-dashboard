import * as React from "react"
import { v4 as uuidv4 } from "uuid"
import { useTranslation } from "react-i18next"
import { formatUnits } from "@ethersproject/units"

import * as S from "./styled"
import { useBreakpoints, useRiskyProposalView } from "hooks"
import { normalizeBigNumber } from "utils"
import { ICON_NAMES, ROUTE_PATHS } from "consts"

import { AppButton, Icon as IconCommon } from "common"

import ReadMore from "components/ReadMore"
import TokenIcon from "components/TokenIcon"
import IconButton from "components/IconButton"

import settingsIcon from "assets/icons/settings.svg"
import checkGreenIcon from "assets/icons/green-check.svg"
import settingsGreenIcon from "assets/icons/settings-green.svg"
import { WrappedRiskyProposalView } from "types"
import UpdateRiskyProposalForm from "forms/UpdateRiskyProposalForm"
import { generatePath, useNavigate } from "react-router-dom"
import { accordionSummaryVariants } from "motion/variants"

type Props = {
  payload: WrappedRiskyProposalView
}

const CardRiskyProposalTraderMarkup: React.FC<Props> = ({ payload }) => {
  const {
    proposal,
    utilityIds,
    userActiveInvestmentsInfo,
    proposalTokenMarkPrice,
  } = payload
  const { proposalId, basicPoolAddress: poolAddress } = utilityIds

  const [
    {
      tokenRating,
      canInvest,
      proposalTokenLink,
      maxSizeLP,
      fullness,
      maxInvestPrice,
      expirationDate,
      investors,
      positionSize,
      proposalToken,
      description,
      maximumPoolInvestors,
      proposalContract,
    },
    { onUpdateRestrictions },
  ] = useRiskyProposalView(payload)

  const proposalTokenSymbol = React.useMemo<string>(
    () => proposalToken?.symbol ?? "",
    [proposalToken]
  )

  const { isDesktop } = useBreakpoints()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [isSettingsOpen, setIsSettingsOpen] = React.useState<boolean>(false)

  const onInvest = React.useCallback((): void => {
    navigate(
      generatePath(ROUTE_PATHS.riskyProposalInvest, {
        poolAddress: poolAddress,
        proposalId: String(proposalId),
      })
    )
  }, [navigate, poolAddress, proposalId])

  return (
    <S.Root>
      <S.CardRiskyProposalBody>
        <S.CardRiskyProposalGrid isTrader={true}>
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

          <S.CardRiskyProposalGridItemSettingsAction>
            <S.CardRiskyProposalSettingsButton
              full
              text={t("risky-proposal-card.action-settings")}
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              size="small"
              color={"default"}
            />
            <S.CardRiskyProposalSettingsActionMobWrp>
              <S.CardRiskyProposalStatus active={canInvest ?? false}>
                {t(
                  canInvest
                    ? "risky-proposal-card.status-open"
                    : "risky-proposal-card.status-closed"
                )}
              </S.CardRiskyProposalStatus>
              <IconButton
                size={12}
                media={isSettingsOpen ? settingsGreenIcon : settingsIcon}
                onClick={() => {
                  setIsSettingsOpen(!isSettingsOpen)
                }}
              />
            </S.CardRiskyProposalSettingsActionMobWrp>
          </S.CardRiskyProposalGridItemSettingsAction>

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
                  <S.CardRiskyProposalInvestMoreButton
                    text={t("risky-proposal-card.action-invest")}
                    onClick={onInvest}
                    size={"x-small"}
                    color={isDesktop ? "secondary" : "default"}
                  />
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
              text={t("risky-proposal-card.action-terminal")}
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
        </S.CardRiskyProposalGrid>
      </S.CardRiskyProposalBody>
      <S.CardRiskyProposalUpdateFormWrp>
        <UpdateRiskyProposalForm
          visible={isSettingsOpen}
          setVisible={setIsSettingsOpen}
          defaultState={{
            timestamp: expirationDate.initial,
            maxSizeLP: maxSizeLP,
            maxInvestPrice: maxInvestPrice.value,
          }}
          proposalContract={proposalContract}
          fullness={fullness.value}
          currentPrice={proposalTokenMarkPrice}
          proposalId={proposalId}
          successCallback={onUpdateRestrictions}
          proposalSymbol={proposalTokenSymbol}
          poolAddress={poolAddress}
        />
      </S.CardRiskyProposalUpdateFormWrp>
    </S.Root>
  )
}

export default React.memo(CardRiskyProposalTraderMarkup)
