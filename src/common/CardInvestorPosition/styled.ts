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
`
export const CardInvestorPositionBody = styled.div<{
  sharpBottomCorners: boolean
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

  ${respondTo("lg")} {
    min-height: 69px;
    gap: 0 var(--app-gap);
    padding: 12px 16px;
    grid-template-columns: repeat(5, minmax(0, 145px)) 1fr;
    justify-items: flex-start;

    background: #141926;
    box-shadow: none;
    border-radius: ${({ sharpBottomCorners }) =>
      sharpBottomCorners ? "16px 16px 0 0" : "16px"};
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
export const CardInvestorPositionBodyItem = styled.div<{
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
export const CardInvestorPositionBodyItemGrid = styled(
  CardInvestorPositionBodyItem
)`
  grid-template-rows: repeat(3, 1fr);
  gap: 4px;

  ${respondTo("lg")} {
    grid-template-rows: initial;
  }
`

export const CardInvestorPositionBodyItemPoolInfoWrp = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
`
export const CardInvestorPositionBodyItemPoolInfoContentWrp = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 8px;

  ${respondTo("lg")} {
    align-items: flex-start;
    flex-direction: column;
  }
`

export const CardInvestorPositionBodyItemVolumeWrp = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;

  ${respondTo("lg")} {
    flex-direction: row-reverse;
  }
`
export const CardInvestorPositionBodyItemActionsWrp = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 36px;
`

export const CardInvestorPositionBodyItemLabel = styled.div`
  font-weight: 400;
  ${bodyItemSmallTextBase};

  ${respondTo("lg")} {
    display: none;
  }
`

export const CardInvestorPositionBodyItemAmount = styled.div`
  color: #e4f2ff;
  ${bodyItemLargeTextBase};
`
export const CardInvestorPositionFundTicker = styled.div`
  color: #e4f2ff;
  ${bodyItemLargeTextBase};

  ${respondTo("lg")} {
    color: ${({ theme }) => theme.brandColors.secondary};
  }
`
export const CardInvestorPositionFundToken = styled.div`
  color: #616d8b;
  ${bodyItemLargeTextBase};
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
    background: ${(props) => (props.value > 0 ? "#337833" : "#68282C")};
    border-radius: 5px;
  }
`

export const CardInvestorPositionBodyItemPrice = styled.div`
  ${bodyItemSmallTextBase};
  font-weight: 500;
`

export const ActionPositive = styled(AppButton)`
  font-size: 14px;
  line-height: 17px;
  color: #5baa99;
`
export const ActionNegative = styled(AppButton)`
  font-size: 14px;
  line-height: 17px;
  color: #a75b5b;
`

export const CardInvestorPositionExtra = styled(GradientBorder)`
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

export const CardInvestorPositionVestsWrp = styled.div`
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
export const CardInvestorPositionVestsLoaderWrp = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  width: 100%;
`
export const CardInvestorPositionCommissionWrp = styled.div`
  padding: var(--app-padding);
`
export const CardInvestorPositionToggleIconIndicator = styled(Icon)<{
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