import styled from "styled-components/macro"

const Styled = {
  Text: styled.div`
    padding: 0 16px 0;
    box-sizing: border-box;
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 130%;
    color: #e4f2ff;
    & > ul {
      padding-inline-start: 16px;
      margin-block-start: 0;
      margin-block-end: 0;
    }
    & ul > li {
      margin-bottom: 16px;
    }
    & ul > li:last-child {
      margin-bottom: 0;
    }
  `,
  CheckboxContainer: styled.div`
    display: flex;
    align-items: center;
    padding: 28px 20px;
    box-sizing: border-box;
  `,
  CheckboxText: styled.div`
    padding-left: 10px;
    box-sizing: border-box;
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    letter-spacing: 0.03em;
    color: #e4f2ff;
  `,
  CheckboxLink: styled.a`
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 12px;
    letter-spacing: 0.03em;
    color: #0076bc;
  `,
  ButtonContainer: styled.div`
    padding: 0 16px 20px;
    box-sizing: border-box;
  `,
  Button: styled.div`
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 16px;
    text-align: center;
    color: #202020;
  `,
}

export default Styled
