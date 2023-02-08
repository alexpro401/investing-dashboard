import styled, { css } from "styled-components/macro"
import { respondTo } from "theme"
import { isNil } from "lodash"
import { AppButton, Icon } from "common"
import Tooltip from "components/Tooltip"
import TokenRating from "components/TokenRating"
import { rgba } from "polished"
import { motion } from "framer-motion"

export const Root = styled.div`
  position: relative;
`
export const CardRiskyProposalBody = styled.div`
  background: ${({ theme }) => theme.backgroundColors.secondary};
  border-radius: 16px;
`

// Divider shared styles
const dividerCss = css`
  height: 1px;
  background-color: #1d2635;
`

/* ==========================================================================
   Grid layout
   ========================================================================== */
const areasInvestor = css`
  grid-template-areas:
    "token token base-token"
    "divider-top divider-top divider-top"
    "max-size current-user-size fullness"
    "max-invest-price current-price expiration-date"
    "investors position-size invest-action"
    "description description description"
    "divider-bottom divider-bottom divider-bottom"
    "trader-size trader-size check-token";

  ${respondTo("lg")} {
    grid-template-areas:
      "token max-size fullness max-invest-price expiration-date trader-size"
      "base-token current-user-size position-size current-price investors invest-action"
      "divider-top divider-top divider-top divider-top divider-top divider-top"
      "description description description description description description";
  }
`

const areasTrader = css`
  grid-template-areas:
    "token token settings-action"
    "divider-top divider-top divider-top"
    "max-size current-user-size fullness"
    "max-invest-price current-price expiration-date"
    "investors position-size invest-action"
    "description description description";

  ${respondTo("lg")} {
    grid-template-areas:
      "token max-size fullness max-invest-price expiration-date invest-action"
      "token current-user-size position-size current-price investors settings-action"
      "divider-top divider-top divider-top divider-top divider-top divider-top"
      "description description description description description description";
  }
`

/**
 * Grid container
 *
 * Must only contain `CardRiskyProposalGridItem *` children.
 *
 * @param isTrader - If true, the grid will be using grid-template-areas for a trader, otherwise for an investor.
 */
export const CardRiskyProposalGrid = styled.div<{ isTrader: boolean }>`
  display: grid;
  ${({ isTrader }) => (isTrader ? areasTrader : areasInvestor)};
  justify-items: stretch;
  gap: 8px 5px;

  padding: 8px 16px 16px;

  ${respondTo("lg")} {
    gap: 12px var(--app-gap);
    padding: 16px;
  }
`

export const CardRiskyProposalGridTrader = styled(CardRiskyProposalGrid)`
  ${areasTrader}
`

export const CardRiskyProposalGridInvestor = styled(CardRiskyProposalGrid)`
  ${areasInvestor}
`

const CardRiskyProposalGridCell = styled.div<{ alignment?: string }>`
  width: fill-available;
  display: flex;
  align-items: stretch;
  justify-items: stretch;
  justify-self: ${({ alignment }) => alignment || "flex-start"};
`

/**
 * Grid cells
 *
 * Using grid-area to position the cells.
 */
export const CardRiskyProposalGridItemDividerTop = styled(
  CardRiskyProposalGridCell
)`
  grid-area: divider-top;
  ${dividerCss};
`
export const CardRiskyProposalGridItemDividerBottom = styled(
  CardRiskyProposalGridCell
)`
  grid-area: divider-bottom;
  ${dividerCss};

  ${respondTo("lg")} {
    display: none;
  }
`
export const CardRiskyProposalGridItemToken = styled(CardRiskyProposalGridCell)`
  grid-area: token;
`
export const CardRiskyProposalGridItemBaseToken = styled(
  CardRiskyProposalGridCell
)`
  grid-area: base-token;
`
export const CardRiskyProposalGridItemSettingsAction = styled(
  CardRiskyProposalGridCell
)`
  grid-area: settings-action;
`
export const CardRiskyProposalGridItemMaxSize = styled(
  CardRiskyProposalGridCell
)`
  grid-area: max-size;
`
export const CardRiskyProposalGridItemCurrentUserSize = styled(
  CardRiskyProposalGridCell
)`
  grid-area: current-user-size;
`
export const CardRiskyProposalGridItemFullness = styled(
  CardRiskyProposalGridCell
)`
  grid-area: fullness;
`
export const CardRiskyProposalGridItemMaxInvestPrice = styled(
  CardRiskyProposalGridCell
)`
  grid-area: max-invest-price;
`
export const CardRiskyProposalGridItemCurrentPrice = styled(
  CardRiskyProposalGridCell
)`
  grid-area: current-price;
`
export const CardRiskyProposalGridItemExpirationDate = styled(
  CardRiskyProposalGridCell
)`
  grid-area: expiration-date;
`
export const CardRiskyProposalGridItemInvestors = styled(
  CardRiskyProposalGridCell
)`
  grid-area: investors;
`
export const CardRiskyProposalGridItemPositionSize = styled(
  CardRiskyProposalGridCell
)`
  grid-area: position-size;
`
export const CardRiskyProposalGridItemInvestAction = styled(
  CardRiskyProposalGridCell
)`
  grid-area: invest-action;
`
export const CardRiskyProposalGridItemDescription = styled(
  CardRiskyProposalGridCell
)`
  grid-area: description;
`
export const CardRiskyProposalGridItemTraderSize = styled(
  CardRiskyProposalGridCell
)`
  grid-area: trader-size;
`
export const CardRiskyProposalGridItemCheckToken = styled(
  CardRiskyProposalGridCell
)`
  grid-area: check-token;

  ${respondTo("lg")} {
    display: none;
  }
`

/* ==========================================================================
   Shared card styles
   ========================================================================== */

export const CardRiskyProposalValueWrp = styled.div<{ alignment?: string }>`
  width: fill-available;
  display: flex;
  flex-direction: column;
  justify-items: stretch;
  justify-content: space-between;
  align-items: ${({ alignment }) => alignment || "flex-start"};
  gap: 4px;
`

export const CardRiskyProposalLabelContent = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 4px;

  // FIXME: Font baseline temporary fix
  span:first-child {
    transform: translateY(1.5px);
  }
`
export const CardRiskyProposalLabelIcon = styled(motion.img)`
  width: 16px;
  height: 16px;

  ${respondTo("lg")} {
    display: none;
  }
`

export const CardRiskyProposalLabel = styled.div`
  font-weight: 500;
  font-size: 11px;
  line-height: 13px;
  color: #616d8b;

  ${respondTo("lg")} {
    font-size: 12px;
    line-height: 14px;
    color: #788ab4;
  }
`

export const CardRiskyProposalLabelTooltip = styled(Tooltip)`
  display: none;
  height: 16px;

  ${respondTo("lg")} {
    display: block;
  }
`

function getValueColor(theme, completed?: boolean) {
  if (isNil(completed) || !completed) {
    return theme.textColors.primary
  }
  return "#6781bd"
}
/**
 * Value container
 *
 * Styling values that are displayed in the card.
 *
 * @param completed - If non-exist or false, the value will be colorized with the primary color, otherwise with the secondary color.
 * @param small - If non-exist or false, the font size will be 11px, otherwise will be initial.
 */
export const CardRiskyProposalValue = styled.div<{
  completed?: boolean
  small?: boolean
}>`
  font-weight: 600;
  font-size: ${({ small }) => (!!small ? "11px" : "13px")};
  line-height: 16px;
  color: ${({ theme, completed }) => getValueColor(theme, completed)};
  transform: translateY(1.5px);

  ${respondTo("lg")} {
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;
    letter-spacing: 0.01em;
  }

  span {
    color: #788ab4;
  }
`

/* ==========================================================================
   Card unique items styles
   ========================================================================== */

/*
   Proposal Token
   ========================================================================== */

export const CardRiskyProposalTokenWrp = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  text-decoration: none;
`

export const CardRiskyProposalTokenInfoWrp = styled.div`
  display: grid;
  grid-template-areas: "token-info-value token-info-rating token-info-tooltip";
  justify-items: start;
  gap: 4px;

  ${respondTo("lg")} {
    grid-template-areas:
      "token-info-label token-info-label token-info-tooltip"
      "token-info-value token-info-rating token-info-rating";
  }
`
export const CardRiskyProposalTokenInfoLabel = styled(CardRiskyProposalLabel)`
  grid-area: token-info-label;
  display: none;

  ${respondTo("lg")} {
    display: block;
  }
`
export const CardRiskyProposalTokenInfoValue = styled(CardRiskyProposalValue)`
  grid-area: token-info-value;
  text-decoration: none;

  ${respondTo("lg")} {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
`
export const CardRiskyProposalTokenInfoRating = styled(TokenRating)`
  grid-area: token-info-rating;
  ${respondTo("lg")} {
  }
`
export const CardRiskyProposalTokenInfoTooltip = styled(Tooltip)`
  grid-area: token-info-tooltip;
  ${respondTo("lg")} {
  }
`
export const CardRiskyProposalTokenInfoIcon = styled(Icon)`
  display: none;

  ${respondTo("lg")} {
    display: block;
    width: 1.2em;
    height: 1.2em;
    color: ${({ theme }) => theme.textColors.primary};
  }
`

/*
   Pool base token
   ========================================================================== */

export const CardRiskyProposalBaseTokenWrp = styled.div`
  width: fill-available;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;

  ${respondTo("lg")} {
    justify-content: flex-start;
    flex-direction: row-reverse;
  }
`
export const CardRiskyProposalBaseTokenValue = styled(CardRiskyProposalValue)`
  color: #788ab4;
`

/*
   Trader size
   ========================================================================== */

export const CardRiskyProposalTraderSizeWrp = styled(motion.div)`
  width: fill-available;
  display: flex;
  align-items: center;
  gap: 4px;

  ${respondTo("lg")} {
    display: none;
  }
`
export const CardRiskyProposalTraderSizeIconWrp = styled.div`
  position: relative;
`
export const CardRiskyProposalTraderSizeQualityIcon = styled.img`
  width: 10px;
  height: 10px;
  position: absolute;
  bottom: 0;
  right: 0;
`
export const CardRiskyProposalTraderSizeInfoWrp = styled.div`
  width: fill-available;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`
export const CardRiskyProposalTraderSizeProgressWrp = styled.div`
  width: 137px;
`
export const CardRiskyProposalTraderSizeText = styled.div`
  font-weight: 600;
  font-size: 13px;
  line-height: 100%;
  color: ${({ theme }) => theme.textColors.primary};
  margin-bottom: 4px;
`

/*
   Other helpers
   ========================================================================== */

export const CardRiskyProposalSettingsActionMobWrp = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;

  ${respondTo("lg")} {
    display: none;
  }
`

export const CardRiskyProposalInvestMoreButton = styled(AppButton)`
  margin-left: 0.5px;
  padding: 0;
  font-size: 11px;
  border-radius: 0;

  ${respondTo("lg")} {
    margin-left: 4px;
    background: ${({ theme }) => theme.brandColors.secondary};
    font-size: 12px;
    line-height: 14px;
    padding: 2px 6px;
    border-radius: 16px;
  }
`

export const CardRiskyProposalDescriptionWrp = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 16px;

  font-weight: 400;
  font-size: 13px;
  line-height: 130%;
  letter-spacing: 0.01em;
  color: ${({ theme }) => theme.textColors.primary};

  ${respondTo("lg")} {
    font-weight: 500;
    font-size: 14px;
    line-height: 170%;
  }
`

export const CardRiskyProposalSettingsButton = styled(AppButton)`
  display: none;
  background: ${({ theme }) => rgba(theme.brandColors.secondary, 0.15)};

  ${respondTo("lg")} {
    display: block;
  }
`
export const CardRiskyProposalStatus = styled.div<{ active: boolean }>`
  padding: 5px 6px;
  border-radius: 36px;
  white-space: nowrap;
  border: 1px solid ${(props) => (props.active ? "#9ae2cb" : "#788AB4")};
  color: ${(props) => (props.active ? "#9ae2cb" : "#788AB4")};
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 600;
  font-size: 11px;
  line-height: 13px;
`

export const CardRiskyProposalCheckTokenWrp = styled.div`
  width: fill-available;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

export const CardRiskyProposalUpdateFormWrp = styled.div`
  width: 100%;
  max-width: 420px;
  position: absolute;
  top: 38px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 101;

  ${respondTo("lg")} {
    top: 14px;
    background: #141926;
  }
`
