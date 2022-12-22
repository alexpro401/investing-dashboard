import styled from "styled-components"
import { ColorizedNumber } from "theme"

const Styled = {
  Container: styled.div<{ m?: string }>`
    display: grid;
    grid-template-columns: 33% 35.7% 1fr;
    width: 100%;
    margin: ${(props) => props.m ?? 0};
  `,
  Date: styled.div`
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 15px;
    font-feature-settings: "tnum" on, "lnum" on;
    color: #788ab4;
  `,
  PNL: styled(ColorizedNumber)`
    margin-top: 2px;
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 16px;
  `,
  Link: styled.a`
    display: block;
    width: 100%;
    text-decoration: none;
    color: initial;
  `,
}

export default Styled
