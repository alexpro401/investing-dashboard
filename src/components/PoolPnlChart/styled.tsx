import styled from "styled-components"

const Styled = {
  Container: styled.div`
    width: 100%;
  `,

  Body: styled.div`
    overflow: hidden;
  `,

  NoData: styled.div`
    font-family: ${(props) => props.theme.appFontFamily};
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
