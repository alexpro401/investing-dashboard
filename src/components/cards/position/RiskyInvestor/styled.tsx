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

export const Body = styled.div`
  width: 100%;
  padding: 12px 16px;
  display: grid;
  grid-template-columns: 0.34fr 0.38fr 0.28fr;
  grid-template-rows: 1fr;
  grid-column-gap: 12px;
  overflow-x: auto;

  ${respondTo("lg")} {
    display: flex;
    flex-direction: row;

    & > * {
      flex: 1 0 155px;
      max-width: 167px;

      &:last-child {
        max-width: 100%;
      }
    }
  }
`

export const PositionSymbol = styled.div`
  margin: 0 0 0 4px;

  ${SharedAmount}
`

export const Amount = styled.div`
  margin: 0 0 0 8px;

  ${SharedAmount}

  ${respondTo("lg")} {
    margin: 0;
    white-space: nowrap;
  }
`

export const FundSymbol = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  color: #616d8b;
  transform: translateY(2px);
  margin-right: 4px;
`
export const Symbols = styled.div`
  position: relative;
  width: 41px;
  height: 26px;
`

export const SymbolItem = styled.div`
  position: absolute;

  &:nth-child(1) {
    z-index: 1;
    left: 0;
    top: 1px;
  }
  &:nth-child(2) {
    z-index: 2;
    right: 0;
    top: 0;
  }
`
