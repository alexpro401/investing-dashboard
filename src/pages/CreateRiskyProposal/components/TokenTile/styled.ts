import { Flex } from "theme"
import styled from "styled-components/macro"

export const TokenContainer = styled(Flex)`
  padding: 0 16px;
  background: #20293e;
  border-radius: 24px;
  min-height: 61px;
  width: 100%;
`

export const TokenInfo = styled(Flex)`
  flex-direction: column;
  align-items: flex-start;
  margin-right: auto;
`

export const Symbol = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  text-align: left;
  letter-spacing: 0.0168em;
  font-feature-settings: "tnum" on, "lnum" on;
  color: #e4f2ff;
`

export const Name = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 142%;
  text-align: left;
  letter-spacing: 0.03em;
  font-feature-settings: "tnum" on, "lnum" on;
  color: #616d8b;
`

export const Price = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 130%;
  text-align: right;
  letter-spacing: 0.03em;
  color: #e4f2ff;
`
