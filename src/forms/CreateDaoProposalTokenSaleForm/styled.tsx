import styled, { css } from "styled-components/macro"

import theme, { Flex } from "theme"

export const SideBarNavigationWrapper = styled.div`
  min-width: 300px;
  position: sticky;
  top: 0px;
  height: min-content;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: max-content;
  white-space: nowrap;
  height: 100%;
  overflow-y: auto;
  padding: 20px;
`

export const SideStepsTitle = styled.h4`
  font-size: 20px;
  font-weight: 700px;
  color: ${theme.textColors.primary};
`

export const StepItem = styled.div<{ isActive }>`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #293c54;
  font-weight: 700;
  font-size: 14px;
  line-height: 1.5;
  letter-spacing: 0.01em;
  padding: 16px;
  border-radius: 14px;

  ${(props) =>
    props.isActive
      ? css`
          background: #181e2c;
          color: ${theme.brandColors.secondary};
        `
      : css``}
`

export const StepIcon = styled.div<{
  isPassed: boolean
  isActive: boolean
}>`
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1.5px solid #293c54;

  ${(props) =>
    props.isPassed
      ? css`
          background: #293c54;
        `
      : css``}

  ${(props) =>
    props.isActive
      ? css`
          background: ${theme.brandColors.secondary};
          color: #181e2c;
        `
      : css``}

  ${(props) =>
    !props.isActive && !props.isPassed
      ? css`
          color: #293c54;
        `
      : css``}
`

export const AddTokenSale = styled.button<{ isDisabled: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: transparent;
  border: none;
  padding: 16px;
  font-weight: 700;
  font-size: 14px;
  line-height: 1.5;
  letter-spacing: 0.01em;

  ${(props) =>
    props.isDisabled
      ? css`
          color: #293c54;

          svg {
            path:first-child {
              stroke: #293c54;
            }
            path:last-child {
              fill: #293c54;
            }
          }
        `
      : css`
          cursor: pointer;
          color: ${theme.brandColors.secondary};

          svg {
            path:first-child {
              stroke: ${theme.brandColors.secondary};
            }
            path:last-child {
              fill: ${theme.brandColors.secondary};
            }
          }
        `}
`

export const TokenSellProposalWrapper = styled(Flex).attrs(() => ({
  dir: "column",
  ai: "center",
  jc: "space-between",
  gap: "8",
}))<{ isEnabled?: boolean }>`
  background-color: rgba(24, 30, 44, 0.5);
  padding: 16px;
  width: auto;
  border-radius: 14px;

  ${(props) =>
    props.isEnabled
      ? css`
          cursor: pointer;
          &:hover {
            background-color: rgba(24, 30, 44, 0.3);
          }
        `
      : css``}
`

export const TokenSellProposalHeader = styled(Flex).attrs(() => ({
  ai: "center",
  jc: "space-between",
}))`
  width: 100%;
`

export const TokenSellProposalHeaderLeft = styled(Flex).attrs(() => ({
  ai: "center",
  jc: "space-between",
  gap: "8",
}))``

export const TokenSellProposalHeaderRight = styled(Flex).attrs(() => ({
  ai: "center",
  jc: "center",
}))<{ isActive?: boolean }>`
  ${(props) =>
    props.isActive
      ? css`
          transform: rotate(180deg);
          svg {
            color: #6781bd;
          }
        `
      : css`
          svg {
            color: #293c54;
          }
        `}
`

export const TokenSellProposalTitle = styled.span<{ isSelected?: boolean }>`
  color: #293c54;
  font-weight: 700;
  font-size: 14px;
  line-height: 1.5;
  letter-spacing: 0.01em;

  ${(props) =>
    props.isSelected
      ? css`
          color: ${theme.brandColors.secondary};
        `
      : css``}
`

export const TokenSellSteps = styled(Flex).attrs(() => ({
  dir: "column",
  ai: "flex-start",
  jc: "flex-start",
  gap: "20",
}))`
  width: auto;
  margin-top: 12px;
`

export const TokenSellStep = styled(Flex).attrs(() => ({
  ai: "center",
  jc: "flex-start",
  gap: "8",
}))<{ isActive: boolean }>`
  width: 100%;
  font-weight: 700;
  font-size: 14px;
  line-height: 1.5;
  letter-spacing: 0.01em;

  ${(props) =>
    props.isActive
      ? css`
          span {
            color: ${theme.brandColors.secondary};
          }
        `
      : css`
          span {
            color: #293c54;
          }
        `}
`
