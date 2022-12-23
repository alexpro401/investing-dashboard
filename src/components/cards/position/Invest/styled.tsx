import styled, { css } from "styled-components/macro"

const SharedAmount = css`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 100%;
  color: #e4f2ff;
  transform: translateY(2px);
`
const Styled = {
  PositionSymbol: styled.div`
    margin: 0 4px;

    ${SharedAmount}
  `,

  Amount: styled.div`
    ${SharedAmount}
    margin: 0 0 0 8px;
  `,

  FundSymbol: styled.div`
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 100%;
    margin: 0 8px;
    color: #616d8b;
    transform: translateY(2px);
  `,
}

export default Styled
