import styled from "styled-components"
import { Flex, GradientBorder } from "theme"
import ArrowOutlineRight from "assets/icons/ArrowOutlineRight"

export const Container = styled(Flex)`
  width: 100%;
  padding: 16px 16px 80px;
  flex-direction: column;
  justify-content: flex-start;
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100vh - 94px);

  @media all and (display-mode: standalone) {
    height: calc(100vh - 115px);
  }
`

export const Details = styled(GradientBorder)`
  flex-direction: column;
  padding: 0 16px 16px;
  border-radius: 10px;
  margin-top: 16px;
  width: 100%;
  position: relative;

  &:after {
    background: #181e2c;
  }
`

export const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr;
  grid-gap: 16px;
  width: 100%;
`

export const DetailsEditLinkFrame = styled(Flex)`
  position: absolute;
  top: 6px;
  right: 8px;
  z-index: 2;
`

export const OwnInvesting = styled(GradientBorder)`
  padding: 16px;
  margin-top: 16px;
  border-radius: 10px;
  width: 100%;

  &:after {
    background: #181e2c;
  }
`
export const OwnInvestingLabel = styled.div`
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  line-height: 13px;
  color: #788ab4;
`
export const OwnInvestingValue = styled.div`
  margin-top: 8px;
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  color: #e4f2ff;
`
export const OwnInvestingLinkContainer = styled(Flex)`
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: #e4f2ff;
`
export const OwnInvestingLinkText = styled.span`
  display: inline-block;
  margin-right: 9px;
`
export const OwnInvestingLink = (props) => (
  <OwnInvestingLinkContainer {...props}>
    <OwnInvestingLinkText>Invest in my fund</OwnInvestingLinkText>
    <ArrowOutlineRight color="#e4f2ff" width="4.7px" height="8px" />
  </OwnInvestingLinkContainer>
)
