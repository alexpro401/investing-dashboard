import styled, { css } from "styled-components/macro"
import { respondTo } from "theme"

const SharedAmount = css`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 100%;
  color: #e4f2ff;
  transform: translateY(2px);
`

export const PositionSymbol = styled.div`
  margin: 0 4px;

  ${SharedAmount}

  ${respondTo("lg")} {
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;
    letter-spacing: 0.01em;
    color: ${({ theme }) => theme.brandColors.secondary};
  }
`
export const Amount = styled.div`
  margin: 0 0 0 8px;
  ${SharedAmount}

  ${respondTo("lg")} {
    margin: 0;
  }
`
export const FundSymbol = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  margin: 0 8px;
  color: #616d8b;
  transform: translateY(2px);
`
