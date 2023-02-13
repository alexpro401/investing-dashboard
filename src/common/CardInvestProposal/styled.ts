import Tooltip from "components/Tooltip"
import { isNil } from "lodash"
import styled, { css } from "styled-components/macro"
import { respondTo } from "theme"

export const Root = styled.div`
  position: relative;
  color: goldenrod;
`

export const CardInvestProposalBody = styled.div`
  width: 100%;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
  background: ${({ theme }) => theme.backgroundColors.secondary};
  border-radius: 16px;
  padding: var(--app-padding);
  z-index: initial;

  ${respondTo("lg")} {
    background: rgba(20, 25, 38, 0.5);
    box-shadow: initial;
    margin-bottom: 0;
  }
`

export const CardInvestProposalGrid = styled.div`
  display: grid;
  justify-items: stretch;
  gap: var(--app-gap);
  grid-template-columns: minmax(0, 0.3fr) repeat(2, minmax(0, 0.35fr));

  ${respondTo("lg")} {
    gap: calc(var(--app-gap) / 2) var(--app-gap);
    grid-template-columns: initial;
  }
`

export const CardInvestProposalGridItem = styled.div<{
  gridColumn?: string
  gridRow?: string
}>`
  display: flex;
  grid-column: ${({ gridColumn }) => gridColumn ?? "auto"};
  grid-row: ${({ gridRow }) => gridRow ?? "auto"};
`

export const CardInvestProposalGridItemFlexy = styled(
  CardInvestProposalGridItem
)`
  display: flex;
`

const dividers = {
  row: css`
    grid-column: 1 / span -1;
  `,
  column: css`
    grid-row: 1 / -1;
  `,
}

export const CardInvestProposalGridDivider = styled(
  CardInvestProposalGridItem
)<{ divider?: "row" | "column" }>`
  ${({ divider }) => (divider ? dividers[divider] : "")};

  height: 1px;
  background-color: #1d2635;
`

// shared
export const CardInvestProposalValueWrp = styled.div<{ alignment?: string }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-items: stretch;
  justify-content: flex-start;
  align-items: ${({ alignment }) => alignment || "flex-start"};
  gap: 4px;
`

export const CardInvestProposalLabelContent = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 4px;

  // FIXME: Font baseline temporary fix
  span:first-child {
    transform: translateY(1.5px);
  }
`
export const CardInvestProposalLabelIcon = styled.img`
  width: 16px;
  height: 16px;

  ${respondTo("lg")} {
    display: none;
  }
`

export const CardInvestProposalLabel = styled.div`
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

export const CardInvestProposalLabelTooltip = styled(Tooltip)`
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
export const CardInvestProposalValue = styled.div<{
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
export const CardInvestProposalValueWithIconWrp = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${respondTo("lg")} {
    align-items: flex-start;
  }
`

// custom

export const CardInvestProposalFundTickerWrp = styled(
  CardInvestProposalValueWithIconWrp
)`
  width: 100%;
  flex-direction: row-reverse;
  justify-content: flex-end;

  ${respondTo("lg")} {
    flex-direction: row;
  }
`
export const CardInvestProposalSettingsActionWrp = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: calc(var(--app-gap) / 2);
`
export const CardInvestProposalStatus = styled.div<{ active: boolean }>`
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

export const CardInvestProposalDescriptionWrp = styled.div`
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

export const CardInvestProposalUpdateFormWrp = styled.div`
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
