import styled, { css } from "styled-components/macro"
import { respondTo } from "theme"
import { isNil } from "lodash"
import { AppButton } from "common"
import Tooltip from "components/Tooltip"

export const Root = styled.div`
  position: relative;
`
export const CardRiskyProposalBody = styled.div`
  background: #141926;
  border-radius: 16px;
  color: #f7ff79;
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
  gap: 8px 5px;

  padding: 8px 16px 16px;

  & > * {
    display: flex;
    align-items: stretch;
    justify-items: stretch;
  }
`

/**
 * Grid cells
 *
 * Using grid-area to position the cells.
 */
export const CardRiskyProposalGridItemDividerTop = styled.div`
  grid-area: divider-top;
  ${dividerCss};
`
export const CardRiskyProposalGridItemDividerBottom = styled.div`
  grid-area: divider-bottom;
  ${dividerCss};
`
export const CardRiskyProposalGridItemToken = styled.div`
  grid-area: token;
`
export const CardRiskyProposalGridItemBaseToken = styled.div`
  grid-area: base-token;
`
export const CardRiskyProposalGridItemSettingsAction = styled.div`
  grid-area: settings-action;
`
export const CardRiskyProposalGridItemMaxSize = styled.div`
  grid-area: max-size;
`
export const CardRiskyProposalGridItemCurrentUserSize = styled.div`
  grid-area: current-user-size;
`
export const CardRiskyProposalGridItemFullness = styled.div`
  grid-area: fullness;
`
export const CardRiskyProposalGridItemMaxInvestPrice = styled.div`
  grid-area: max-invest-price;
`
export const CardRiskyProposalGridItemCurrentPrice = styled.div`
  grid-area: current-price;
`
export const CardRiskyProposalGridItemExpirationDate = styled.div`
  grid-area: expiration-date;
`
export const CardRiskyProposalGridItemInvestors = styled.div`
  grid-area: investors;
`
export const CardRiskyProposalGridItemPositionSize = styled.div`
  grid-area: position-size;
`
export const CardRiskyProposalGridItemInvestAction = styled.div`
  grid-area: invest-action;
`
export const CardRiskyProposalGridItemDescription = styled.div`
  grid-area: description;
`
export const CardRiskyProposalGridItemTraderSize = styled.div`
  grid-area: trader-size;
`
export const CardRiskyProposalGridItemCheckToken = styled.div`
  grid-area: check-token;
`

/* ==========================================================================
   Shared card styles
   ========================================================================== */

export const CardRiskyProposalValueWrp = styled.div<{ alignment?: string }>`
  display: flex;
  flex-direction: column;
  //justify-items: stretch;
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

export const CardRiskyProposalLabel = styled.div`
  //white-space: nowrap;
  font-weight: 500;
  font-size: 11px;
  line-height: 13px;
  color: #788ab4;

  ${respondTo("lg")} {
    font-size: 12px;
    line-height: 14px;
    color: #6781bd;
  }
`

export const CardRiskyProposalLabelTooltip = styled(Tooltip)`
  height: 16px;
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

  ${respondTo("lg")} {
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;
    letter-spacing: 0.01em;
  }
`

/* ==========================================================================
   Card items unique styles
   ========================================================================== */

export const CardRiskyProposalTokenWrp = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const CardRiskyProposalTokenInfoWrp = styled.div`
  display: flex;
  gap: 4px;

  ${respondTo("lg")} {
    flex-direction: column;
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
