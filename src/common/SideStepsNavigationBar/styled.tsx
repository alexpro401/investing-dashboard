import styled, { css } from "styled-components"

import theme from "theme"

export const SideStepsTitle = styled.h4`
  font-size: 20px;
  font-weight: 700px;
  color: ${theme.textColors.primary};
`

export const SideStepsNavigationBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: max-content;
  white-space: nowrap;
  height: 100%;
  padding: 20px;
`

export const SideStepsNavigationBarItem = styled.div<{
  isPassed: boolean
  isActive: boolean
}>`
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
          color: #2669eb;
        `
      : css``}
`

export const SideStepsNavigationBarItemIcon = styled.div<{
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
          background: #2669eb;
          color: #181e2c;
        `
      : css``}
`

export const SideStepsNavigationBarItemText = styled.span<{
  isPassed: boolean
  isActive: boolean
}>``
