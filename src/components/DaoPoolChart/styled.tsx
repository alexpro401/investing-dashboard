import styled from "styled-components"
import { GradientBorder } from "theme"

const Styled = {
  Container: styled.div`
    width: 100%;
  `,

  Body: styled.div`
    overflow: hidden;
    height: 130px;
  `,

  NoData: styled.div`
    font-family: "Gilroy";
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 130%;
    letter-spacing: 0.03em;
    color: #616d8b;

    opacity: 0.9;
  `,
}

export default Styled

function getAmountColor(a: number): string {
  if (a > 0) {
    return "#9AE2CB"
  } else if (a < 0) {
    return "#D75E65"
  } else {
    return "#788AB4"
  }
}

// Chart tooltip
export const TooltipStyled = {
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
    font-family: "Gilroy";
    font-style: normal;
    font-weight: 500;
    font-size: 11px;
    line-height: 13px;
    color: #788ab4;
  `,
  Label: styled.div`
    margin-right: 12px;
    font-family: "Gilroy";
    font-style: normal;
    font-weight: 500;
    font-size: 11px;
    line-height: 13px;
    color: #e4f2ff;
  `,
  Value: styled.div<{ amount: number }>`
    font-family: "Gilroy";
    font-style: normal;
    font-weight: 600;
    font-size: 11px;
    line-height: 13px;
    color: ${(p) => getAmountColor(p.amount)};
  `,
}
