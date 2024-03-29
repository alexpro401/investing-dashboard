import styled from "styled-components/macro"

export const Text = styled.div`
  margin-top: 25px;
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  text-align: center;
  letter-spacing: 0.03em;
  color: #e4f2ff;
  max-width: 162px;
`
