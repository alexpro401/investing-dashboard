import styled from "styled-components/macro"

import { GradientBorder, respondTo } from "theme"
import { AppButton } from "common"

export const Container = styled(GradientBorder)`
  width: 97%;
  max-width: 420px;
  position: absolute;
  top: 38px;
  right: 0;
  box-shadow: 7px 4px 21px #0a1420;
  border-radius: 20px;
  z-index: 101;

  &:after {
    background: ${({ theme }) => theme.backgroundColors.secondary};
  }

  ${respondTo("lg")} {
    top: 14px;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: none;

    &:after {
      background: ${({ theme }) => theme.textColors.secondaryNegative};
    }
    &:before {
      background: initial;
    }
  }
`

export const Header = styled.div`
  padding: 20px 16px;
  border-bottom: 1px solid #293c54;
`
export const HeaderTitle = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: 0.01em;
  color: #e4f2ff;
`
export const HeaderCloseButton = styled(AppButton)`
  width: 26px;
  height: 26px;
  padding: 0;
`

export const Body = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px 0;
  padding: var(--app-padding);
`

export const ButtonGroup = styled.div`
  width: 100%;
  margin: 4px 0 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`
