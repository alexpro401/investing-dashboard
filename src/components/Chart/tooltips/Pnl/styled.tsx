import styled from "styled-components/macro"
import { GradientBorder, getAmountColor } from "theme"

export const Styled = {
  Container: styled(GradientBorder)`
    border-radius: 12px;

    &::after {
      background: #181e2c;
    }
  `,
  Content: styled.div`
    padding: 8px 12px;
  `,
  Date: styled.div`
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 500;
    font-size: 11px;
    line-height: 13px;
    color: #788ab4;
  `,
  Label: styled.div`
    margin-right: 12px;
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 500;
    font-size: 11px;
    line-height: 13px;
    color: #e4f2ff;
  `,
  Value: styled.div<{ amount: number }>`
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 600;
    font-size: 11px;
    line-height: 13px;
    color: ${(p) => getAmountColor(p.amount)};
  `,
}

export default Styled
