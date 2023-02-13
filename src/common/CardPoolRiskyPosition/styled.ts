import styled, { css } from "styled-components/macro"
import { ColorizedNumber, GradientBorder, respondTo } from "theme"
import { AppButton, Icon } from "common"

const bodyItemSmallTextBase = css`
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0.03em;
  color: #788ab4;
`
const bodyItemLargeTextBase = css`
  font-size: 13px;
  font-weight: 600;
  line-height: 16px;

  ${respondTo("lg")} {
    font-size: 16px;
    line-height: 19px;
  }
`

export const Root = styled.div`
  position: relative;
  color: gold;
`

// Grid
export const CardPoolRiskyPositionBody = styled(GradientBorder)<{
  isSharpBorders: boolean
}>`
  width: 100%;
  display: grid;
  justify-items: stretch;
  gap: calc(var(--app-gap) / 2) var(--app-gap);
  padding: 8px 16px;

  cursor: pointer;
  border-radius: 16px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
  background: ${({ theme }) => theme.backgroundColors.secondary};

  &::after {
    background: ${({ theme }) => theme.backgroundColors.secondary};
    ${respondTo("lg")} {
      background: #141926;
    }
  }

  &::before {
    ${respondTo("lg")} {
      background: transparent;
    }
  }

  ${respondTo("lg")} {
    min-height: 69px;
    gap: 0 var(--app-gap);
    padding: 12px 16px;
    grid-template-columns: repeat(5, minmax(0, 155px)) 1fr;
    justify-items: flex-start;

    background: #141926;
    box-shadow: none;
    border-radius: ${({ isSharpBorders }) =>
      isSharpBorders ? "16px 16px 0 0" : "16px"};
  }
`

export const CardPoolRiskyPositionDivider = styled.div`
  height: 1px;
  grid-column: 1 / span 3;

  background-color: #1d2635;

  ${respondTo("lg")} {
    display: none;
  }
`
export const CardPoolRiskyPositionBodyItem = styled.div<{
  textAlign?: string
  gridEnd?: number
}>`
  display: grid;
  align-self: stretch;
  grid-column: span ${({ gridEnd }) => gridEnd ?? 1};

  text-align: ${({ textAlign }) => textAlign ?? "initial"};

  ${respondTo("lg")} {
    width: 100%;
    grid-row: none;
    grid-column: initial;
    text-align: initial;
  }

  &:last-child {
    justify-self: flex-end;
  }
`
export const CardPoolRiskyPositionBodyItemGrid = styled(
  CardPoolRiskyPositionBodyItem
)`
  grid-template-rows: repeat(3, 1fr);
  gap: calc(var(--app-gap) / 4);

  ${respondTo("lg")} {
    grid-template-rows: initial;
  }
`

// Custom body items
export const CardPoolRiskyPositionBodyItemPoolInfoWrp = styled(
  CardPoolRiskyPositionBodyItem
)`
  ${respondTo("lg")} {
    grid-column: 1 / span 1;
  }
`

export const CardPoolRiskyPositionBodyItemTokensWrp = styled(
  CardPoolRiskyPositionBodyItem
)`
  ${respondTo("lg")} {
    grid-column: 2 / span 1;
  }
`

export const CardPoolRiskyPositionToggleWrp = styled(
  CardPoolRiskyPositionBodyItem
)`
  display: none;

  ${respondTo("lg")} {
    display: grid;
    justify-content: flex-end;
  }
`

export const CardPoolRiskyPositionBodyItemActionsWrp = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 36px;
`

// Shared items
export const CardPoolRiskyPositionBodyItemLabel = styled.div`
  font-weight: 400;
  ${bodyItemSmallTextBase};

  ${respondTo("lg")} {
    display: none;
  }
`
export const CardPoolRiskyPositionBodyItemAmount = styled.div`
  color: #e4f2ff;
  ${bodyItemLargeTextBase};
`
export const CardPoolRiskyPositionBodyItemPrice = styled.div`
  ${bodyItemSmallTextBase};
  font-weight: 500;
`

export const CardPoolRiskyPositionExtra = styled(GradientBorder)`
  width: 100%;
  flex-direction: column;
  border-radius: 20px;
  margin-top: 8px;
  padding: 0;

  &::after {
    background: #181e2c;
  }

  ${respondTo("lg")} {
    margin-top: 0;
    border-radius: 0 0 20px 20px;
    &::after {
      background: #141926;
    }
    &::before {
      background: transparent;
    }
  }
`

// Custom card items
export const CardPoolRiskyPositionPoolInfoWrp = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: calc(var(--app-gap) / 4);

  ${respondTo("lg")} {
    flex-direction: row-reverse;
  }
`
export const CardPoolRiskyPositionPoolInfoName = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  color: #616d8b;
  transform: translateY(2px);
`

export const CardPoolRiskyPositionTokensWrp = styled.div`
  display: flex;
  align-items: center;
  gap: calc(var(--app-gap) / 4);

  ${respondTo("lg")} {
  }
`
export const CardPoolRiskyPositionTokensIconsWrp = styled.div`
  position: relative;
  width: 41px;
  height: 26px;
`

export const CardPoolRiskyPositionTokensIconPool = styled.div`
  position: absolute;
  z-index: 1;
  left: 0;
  top: 0;
`
export const CardPoolRiskyPositionTokensIconProposal = styled.div`
  position: absolute;
  z-index: 2;
  right: 0;
  top: -1px;
`

export const CardPoolRiskyPositionSizeWrp = styled.div`
  display: flex;
  align-items: center;
  gap: calc(var(--app-gap) / 4);

  ${respondTo("lg")} {
    flex-direction: column;
    align-items: flex-start;
  }
`

export const CardPoolRiskyPositionTokenNamesWrp = styled.div`
  display: flex;
  align-items: center;
  gap: calc(var(--app-gap) / 4);

  font-weight: 600;
  font-size: 14px;
  line-height: 100%;
`

export const CardPoolRiskyPositionTokenNamePool = styled.div`
  color: #788ab4;
`

export const CardPoolRiskyPositionTokenNameProposal = styled.div`
  color: #e4f2ff;
`

export const CardPoolRiskyPositionToggleIconIndicator = styled(Icon)<{
  isActive: boolean
}>`
  width: 1.4em;
  height: 1.4em;
  color: ${(props) => props.theme.textColors.secondary};
  padding: 4px;
  transition: transform 0.2s ease-in-out;

  ${(props) =>
    props.isActive
      ? css`
          transform: rotate(180deg);
        `
      : ""}
`

export const CardPoolRiskyPositionPnlChip = styled(ColorizedNumber)`
  font-style: normal;
  font-weight: 600;
  line-height: 100%;
  letter-spacing: 0.01em;
  font-size: 12px;

  ${respondTo("lg")} {
    width: auto;
    padding: 2px 8px;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 12px;
    font-weight: 500;
    line-height: 14px;

    color: #e4f2ff;
    background: ${({ theme, value }) =>
      value > 0 ? "#337833" : theme.statusColors.error};
    border-radius: 5px;
  }
`

export const CardPoolRiskyPositionExchangesWrp = styled.div`
  max-height: 180px;
  overflow-y: auto;
  background: #181e2c;
  border-radius: 20px;

  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }

  ${respondTo("lg")} {
    max-height: initial;
    overflow-y: initial;

    background: #141926;
    border-top: 1px solid ${(props) => props.theme.backgroundColors.secondary};
  }
`

export const CardPoolRiskyPositionExchangesLoaderWrp = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  width: 100%;
`

export const ActionPositive = styled(AppButton)`
  font-size: 14px;
  line-height: 17px;
  color: ${(props) => props.theme.statusColors.success};
`
export const ActionNegative = styled(AppButton)`
  font-size: 14px;
  line-height: 17px;
  color: ${(props) => props.theme.statusColors.error};
`
