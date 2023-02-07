import styled, { css } from "styled-components/macro"
import { ColorizedNumber, GradientBorder, respondTo } from "theme"
import { Icon } from "common"

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
export const CardInvestorRiskyPositionBody = styled(GradientBorder)<{
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

export const CardInvestorRiskyPositionDivider = styled.div`
  height: 1px;
  grid-column: 1 / span 3;

  background-color: #1d2635;

  ${respondTo("lg")} {
    display: none;
  }
`
export const CardInvestorRiskyPositionBodyItem = styled.div<{
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
export const CardInvestorRiskyPositionBodyItemGrid = styled(
  CardInvestorRiskyPositionBodyItem
)`
  grid-template-rows: repeat(3, 1fr);
  gap: calc(var(--app-gap) / 4);

  ${respondTo("lg")} {
    grid-template-rows: initial;
  }
`

// Custom body items
export const CardInvestorRiskyPositionBodyItemPoolInfoWrp = styled(
  CardInvestorRiskyPositionBodyItem
)`
  ${respondTo("lg")} {
    grid-column: 1 / span 1;
  }
`

export const CardInvestorRiskyPositionBodyItemTokensWrp = styled(
  CardInvestorRiskyPositionBodyItem
)`
  ${respondTo("lg")} {
    grid-column: 2 / span 1;
  }
`

export const CardInvestorRiskyPositionToggleWrp = styled(
  CardInvestorRiskyPositionBodyItem
)`
  display: none;

  ${respondTo("lg")} {
    display: grid;
    justify-content: flex-end;
  }
`

// Shared items
export const CardInvestorRiskyPositionBodyItemLabel = styled.div`
  font-weight: 400;
  ${bodyItemSmallTextBase};

  ${respondTo("lg")} {
    display: none;
  }
`
export const CardInvestorRiskyPositionBodyItemAmount = styled.div`
  color: #e4f2ff;
  ${bodyItemLargeTextBase};
`
export const CardInvestorRiskyPositionBodyItemPrice = styled.div`
  ${bodyItemSmallTextBase};
  font-weight: 500;
`

export const CardInvestorRiskyPositionExtra = styled(GradientBorder)`
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
export const CardInvestorRiskyPositionPoolInfoWrp = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: calc(var(--app-gap) / 4);

  ${respondTo("lg")} {
    flex-direction: row-reverse;
  }
`
export const CardInvestorRiskyPositionPoolInfoName = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  color: #616d8b;
  transform: translateY(2px);
`

export const CardInvestorRiskyPositionTokensWrp = styled.div`
  display: flex;
  align-items: center;
  gap: calc(var(--app-gap) / 4);

  ${respondTo("lg")} {
  }
`
export const CardInvestorRiskyPositionTokensIconsWrp = styled.div`
  position: relative;
  width: 41px;
  height: 26px;
`

export const CardInvestorRiskyPositionTokensIconPool = styled.div`
  position: absolute;
  z-index: 1;
  left: 0;
  top: 0;
`
export const CardInvestorRiskyPositionTokensIconProposal = styled.div`
  position: absolute;
  z-index: 2;
  right: 0;
  top: -1px;
`

export const CardInvestorRiskyPositionSizeWrp = styled.div`
  display: flex;
  align-items: center;
  gap: calc(var(--app-gap) / 4);

  ${respondTo("lg")} {
    flex-direction: column;
    align-items: flex-start;
  }
`

export const CardInvestorRiskyPositionTokenNamesWrp = styled.div`
  display: flex;
  align-items: center;
  gap: calc(var(--app-gap) / 4);

  font-weight: 600;
  font-size: 14px;
  line-height: 100%;
`

export const CardInvestorRiskyPositionTokenNamePool = styled.div`
  color: #788ab4;
`

export const CardInvestorRiskyPositionTokenNameProposal = styled.div`
  color: #e4f2ff;
`

export const CardInvestorRiskyPositionToggleIconIndicator = styled(Icon)<{
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

export const CardInvestorRiskyPositionPnlChip = styled(ColorizedNumber)`
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

export const CardInvestorRiskyPositionVestsWrp = styled.div`
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

export const CardInvestorRiskyPositionVestsLoaderWrp = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  width: 100%;
`
