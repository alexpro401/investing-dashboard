import styled from "styled-components"

function getPnlColor(amount: number): string {
  if (amount > 0) {
    return "#9ae2cb"
  }
  if (amount < 0) {
    return "red"
  }
  return "gray"
}

const Styled = {
  Container: styled.div<{ m?: string }>`
    display: grid;
    grid-template-columns: 33% 35.7% 1fr;
    width: 100%;
    margin: ${(props) => props.m ?? 0};
  `,
  Date: styled.div`
    font-family: "Gilroy";
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 15px;
    font-feature-settings: "tnum" on, "lnum" on;
    color: #788ab4;
  `,
  PNL: styled.div<{ amount: number }>`
    margin-top: 2px;
    font-family: "Gilroy";
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 16px;
    color: ${(props) => getPnlColor(props.amount)};
  `,
  Link: styled.a`
    display: block;
    width: 100%;
    text-decoration: none;
    color: initial;
  `,
}

export default Styled
