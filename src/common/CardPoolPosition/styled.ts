import { AppButton, Icon } from "common"
import styled, { css } from "styled-components/macro"
import { ColorizedNumber, GradientBorder, respondTo } from "theme"

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
`
export const CardPoolPositionBody = styled(GradientBorder)<{
  sharpBottomCorners: boolean
  bigGap: boolean
}>`
  width: 100%;
  display: grid;
  justify-items: stretch;
  gap: calc(var(--app-gap) / 2) var(--app-gap);
  padding: 8px 16px;

  cursor: pointer;
  border-radius: 16px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);

  &::after {
    background: #181e2c;
  }

  ${respondTo("lg")} {
    min-height: 69px;
    gap: 0 var(--app-gap);
    padding: 12px 16px;
    grid-template-columns: ${({ bigGap }) =>
      `repeat(5, ${bigGap ? "1fr" : "minmax(0, 142px)"}) 1fr`};
    justify-items: flex-start;

    box-shadow: none;
    border-radius: ${({ sharpBottomCorners }) =>
      sharpBottomCorners ? "16px 16px 0 0" : "16px"};

    &::after {
      background: ${({ theme }) => theme.backgroundColors.secondary};
    }
    &::before {
      background: transparent;
    }
  }
`
export const CardInvestorPositionDivider = styled.div`
  height: 1px;
  grid-column: 1 / span 3;

  background-color: #1d2635;

  ${respondTo("lg")} {
    display: none;
  }
`
export const CardPoolPositionBodyItem = styled.div<{
  textAlign?: string
  gridEnd?: number
}>`
  display: grid;
  align-self: stretch;
  grid-column: span ${({ gridEnd }) => gridEnd ?? 1};

  ${respondTo("lg")} {
    width: 100%;
    grid-row: none;
    grid-column: initial;
  }
  text-align: ${({ textAlign }) => textAlign ?? "initial"};

  &:last-child {
    justify-self: flex-end;
  }
`
export const CardPoolPositionBodyItemGrid = styled(CardPoolPositionBodyItem)`
  grid-template-rows: repeat(3, 1fr);
  gap: 4px;

  ${respondTo("lg")} {
    grid-template-rows: initial;
  }
`

// Wrappers
export const CardPoolPositionBodyTokensWrp = styled.div`
  display: flex;
  align-items: center;
  gap: calc(var(--app-gap) / 4);

  ${respondTo("lg")} {
  }
`
export const CardPoolPositionBodyVolumeWrp = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: calc(var(--app-gap) / 4);

  ${respondTo("lg")} {
    justify-content: flex-start;
  }
`
export const CardPoolPositionBodyVolumeInfoWrp = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: calc(var(--app-gap) / 4);
`
export const CardPoolPositionBodyItemActionsWrp = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 36px;
`

// Shared
export const CardPoolPositionBodyItemLabel = styled.div`
  font-weight: 400;
  ${bodyItemSmallTextBase};

  ${respondTo("lg")} {
    display: none;
  }
`
export const CardPoolPositionBodyItemAmount = styled.div`
  color: #e4f2ff;
  ${bodyItemLargeTextBase};
`
export const CardInvestorPositionBodyItemPrice = styled.div`
  ${bodyItemSmallTextBase};
  font-weight: 500;
`

export const PNL = styled(ColorizedNumber)`
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
export const CardPoolPositionToggleIconIndicator = styled(Icon)<{
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
export const CardPoolPositionExtra = styled(GradientBorder)`
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
      background: ${({ theme }) => theme.backgroundColors.secondary};
    }
    &::before {
      background: transparent;
    }
  }
`

export const CardPoolPositionExchangesWrp = styled.div`
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

export const CardPoolPositionExchangesLoaderWrp = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  width: 100%;
`
