import styled from "styled-components/macro"
import { respondTo, Text } from "theme"

export const Root = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  position: relative;

  &::before {
    content: "";
    height: 0;
    border: 1px dashed #788ab4;

    position: absolute;
    left: 0;
    right: 0;
    top: calc(50% - 1px);
    transform: translateY(-50%);
    z-index: -1;

    ${respondTo("sm")} {
      content: none;
    }
  }
`

export const PoolPriceDiffLabel = styled(Text)`
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  color: ${({ theme }) => theme.textColors.secondary};

  ${respondTo("sm")} {
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.01em;
  }
`

export const PoolPriceDiffValue = styled(Text)`
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  color: ${({ theme }) => theme.textColors.primary};

  ${respondTo("sm")} {
    font-weight: 900;
    font-size: 24px;
    line-height: 30px;
    letter-spacing: -0.01em;
  }
`
