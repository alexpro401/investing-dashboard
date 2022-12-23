import styled from "styled-components/macro"

import { GradientBorder } from "theme"

export const SettingsStyled = {
  Container: styled(GradientBorder)`
    width: 97%;
    padding: 16px 16px 13px;
    position: absolute;
    top: 38px;
    right: 0;
    box-shadow: 7px 4px 21px #0a1420;
    border-radius: 20px;

    &:after {
      background: #181e2c;
    }
  `,
  Row: styled.div<{ minInputW?: string }>`
    width: 100%;
    display: grid;
    grid-template-columns:
      max-content
      minmax(max-content, 1fr)
      ${({ minInputW }) => minInputW ?? "62px"}
      minmax(28px, max-content);
    grid-template-rows: 1fr;
    align-items: center;
    gap: 4.5px;
  `,
  Title: styled.div`
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 15px;
    color: #788ab4;
  `,
  InputType: styled.div`
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 15px;
    color: #788ab4;
    text-align: right;
  `,
  ErrorMessage: styled.div`
    width: 100%;
    margin: 4px 0;
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 15px;
    color: #db6d6d;
  `,
  ButtonGroup: styled.div`
    width: 100%;
    margin: 4px 0 0;
    display: grid;
    grid-template-columns: 0.8fr 1fr;
    gap: 16px;
  `,
}
