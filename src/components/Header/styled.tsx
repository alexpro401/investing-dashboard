import { Flex, BaseButton, respondTo } from "theme"
import styled from "styled-components"

export const Container = styled(Flex)`
  touch-action: none;
  user-select: none;
  width: 100%;
  background: ${(props) => props.theme.backgroundColors.primary};
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.15);
  flex-direction: column;

  ${respondTo("sm")} {
    height: 84px;
    background: ${(props) => props.theme.backgroundColors.primary};
    box-shadow: none;
    justify-content: center;
  }
`

export const Bar = styled(Flex)`
  width: 100%;
  height: 45px;
  justify-content: space-between;
  max-width: ${(props) => props.theme.pageContentMaxWidth};
  padding: 0 var(--app-padding-right) 0 var(--app-padding-left);
`

export const ClickableArea = styled(BaseButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 24px;
  min-width: 24px;
  padding: 12px 0;
`

export const Tabs = styled(Flex)`
  width: 100%;
  height: 34px;
  position: relative;
  justify-content: space-between;
  gap: var(--app-gap);

  &:before {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    margin: auto;
    content: "";
    height: 1px;
    background: #181e2c;
    opacity: 1;
  }
`

export const Tab = styled(ClickableArea)<{ active?: boolean }>`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 100%;

  text-align: center;
  letter-spacing: 0.5px;

  display: flex;
  align-items: center;
  position: relative;
  color: ${(props) => (props.active ? "#C5D1DC" : "#838ba3")};

  &:after {
    opacity: ${(props) => (props.active ? "1" : "0")};
    content: "";
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    background: linear-gradient(64.44deg, #63b49b 12.29%, #a4ebd4 76.64%);
    box-shadow: 0 1px 4px rgba(164, 235, 212, 0.29),
      0 2px 5px rgba(164, 235, 212, 0.14);
    border-radius: 2px 2px 0 0;
    height: 2px;
    width: ${(props) => (props.active ? "100%" : "0")};
    transition: opacity, width 0.2s ease-in-out;
  }
`

export const TabAmount = styled(Flex)`
  width: 12px;
  height: 12px;
  margin-left: 3px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #ee4c4c;
  font-weight: 700;
  font-size: 9px;
  line-height: 9px;
  color: #ffffff;
`

export const Title = styled(Flex)`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 32px;
  text-align: center;
  letter-spacing: -0.02em;
  align-items: center;
  color: #e4f2ff;
  display: none;

  ${respondTo("sm")} {
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    letter-spacing: 0.01em;
    color: #b1c7fc;
    display: flex;
  }
`

export const Icons = styled(Flex)`
  width: 70px;

  &:first-child {
    justify-content: flex-start;
  }
  &:last-child {
    justify-content: flex-end;
  }

  ${respondTo("sm")} {
    display: none;
  }
`

export const PortraitsPlus = styled(Flex)`
  background: #181e2c;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 7px;
  text-align: center;
  width: 26px;
  height: 26px;

  color: #616d8b;
  font-size: 18px;
  font-weight: 500;
  font-family: ${(props) => props.theme.appFontFamily};
  line-height: 18px;
`

export const FundWrapper = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50px;
  border: 0 solid #363f4e80;
  position: absolute;
`

export const Funds = styled(Flex)`
  position: relative;
  width: 44px;

  & > ${FundWrapper}:nth-child(1) {
    right: 0;
  }
  & > ${FundWrapper}:nth-child(2) {
    right: 10px;
  }
`

export const IconButton = styled.img`
  margin: 0 3px;
`

export const WidgetWrapper = styled.div`
  display: none;

  ${respondTo("sm")} {
    display: block;
  }
`
