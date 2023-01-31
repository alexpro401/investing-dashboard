import styled from "styled-components/macro"

import { Flex, GradientBorder, respondTo } from "theme"

export const Root = styled.div`
  position: relative;
`

const Styled = {
  Container: styled.div`
    width: 100%;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
    background: ${({ theme }) => theme.backgroundColors.secondary};
    border-radius: 16px;
    margin-bottom: 18px;
    z-index: initial;

    ${respondTo("lg")} {
      padding: var(--app-padding);
      background: rgba(20, 25, 38, 0.5);
      box-shadow: initial;
      margin-bottom: 0;
    }
  `,
  Card: styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;

    ${respondTo("lg")} {
      display: grid;
      grid-template-columns: minmax(0, 150px) 1fr max-content;
      grid-template-rows: 1fr max-content;
    }
  `,
  Head: styled(Flex)<{ isTrader: boolean | null }>`
    width: 100%;
    justify-content: space-between;
    padding: ${(props) =>
      props.isTrader || props.isTrader === null
        ? "8px 8px 7px 16px"
        : "8px 14px 7px 16px"};
    border-bottom: 1px solid #1d2635;
    position: relative;

    ${respondTo("lg")} {
      width: initial;
      flex-direction: column;
      align-items: flex-start;
      border-bottom: none;
      padding: 0;
      justify-content: center;
    }
  `,
  Body: styled.div`
    width: 100%;
    padding: 12px 14px 16px 16px;
    display: grid;
    grid-template-columns: 0.3fr 0.35fr 0.35fr;
    gap: 16px 6px;

    ${respondTo("lg")} {
      width: initial;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      padding: 0;

      & > * {
        flex: 0 1 135px;
        width: initial;
        min-width: 120px;
      }
    }
  `,
  Title: styled.div`
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 100%;
    color: #e4f2ff;
    margin: 0 4px;
    transform: translateY(2px);
  `,
  Status: styled.div<{ active?: boolean }>`
    padding: 5px 6px;
    border-radius: 36px;
    white-space: nowrap;
    border: 1px solid ${(props) => (props.active ? "#9ae2cb" : "#788AB4")};
    color: ${(props) => (props.active ? "#9ae2cb" : "#788AB4")};
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 600;
    font-size: 11px;
    line-height: 13px;
  `,
  Ticker: styled.div`
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 100%;
    color: #788ab4;
  `,
  FundSymbol: styled.div`
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 100%;
    margin: 0 8px;
    color: #788ab4;
    transform: translateY(2px);
  `,
  ReadMoreContainer: styled.div<{ color: string }>`
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    padding: 0 14px 16px 16px;
    font-weight: 400;
    font-size: 13px;
    line-height: 130%;
    color: ${(p) => p.color};

    ${respondTo("lg")} {
      padding: var(--app-padding-top) 0 0;
      border-top: 1px solid rgba(32, 41, 58, 0.6);
      grid-column: 1/4;
      margin-top: 18px;
    }
  `,
}

export default Styled
