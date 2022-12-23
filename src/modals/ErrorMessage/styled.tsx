import styled from "styled-components/macro"

export const Icon = styled.img`
  height: 76px;
  width: 76px;
  margin: 16px auto;
`

export const Text = styled.div`
  max-width: 80%;
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 17px;
  text-align: center;
  letter-spacing: 0.03em;
  padding: 0 0 16px;

  color: #e4f2ff;
`
