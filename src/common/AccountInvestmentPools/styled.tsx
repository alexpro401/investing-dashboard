import styled from "styled-components"
import { Flex } from "theme"

export const PortraitsPlus = styled(Flex)`
  background: #181e2c;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 7px;
  text-align: center;
  width: 24px;
  height: 24px;

  color: #616d8b;
  font-size: 18px;
  font-weight: 500;
  font-family: ${(props) => props.theme.appFontFamily};
  line-height: 18px;
`

export const FundWrapper = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 0 solid #363f4e80;

  &:not(:first-child) {
    margin-left: -25%;
  }
`

export const Funds = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 44px;

  & > ${FundWrapper}:nth-child(1) {
    right: 0;
  }
  & > ${FundWrapper}:nth-child(2) {
    right: 10px;
  }
`
