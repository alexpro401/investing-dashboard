import styled from "styled-components/macro"

export const OneValueCardWrapper = styled.div`
  padding: 20px 0 15px 10px;
  box-sizing: border-box;
  position: relative;
  height: 75px;
  width: 100%;
  background: linear-gradient(64.44deg, #24272f 32.35%, #2c313c 100%);
  mix-blend-mode: normal;
  // filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.08));
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.08);
  border-radius: 0 10px 10px 0px;

  &::before {
    content: "";
    position: absolute;
    width: 3px;
    top: 0;
    bottom: 0;
    left: 0px;
    background: linear-gradient(244.44deg, #63b49b 0%, #a4ebd4 67.65%);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
    border-radius: 10px 0 0 10px;
  }
`

export const Icon = styled.img`
  display: block;
  position: absolute;
  fill: #5c6166;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
`

export const Label = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-family: ${(props) => props.theme.appFontFamily};
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #9ae2cb;
`

export const Value = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-family: ${(props) => props.theme.appFontFamily};
  font-weight: 400;
  font-size: 18px;
  line-height: 41px;
  color: #dadada;
`

export default {}
