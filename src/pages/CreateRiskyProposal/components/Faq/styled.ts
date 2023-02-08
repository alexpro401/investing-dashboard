import { Headline3 } from "common"
import styled from "styled-components"
import theme, { Flex, respondTo } from "theme"

export const Container = styled(Flex)`
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  max-width: 420px;
  width: 100%;
  height: fill-available;

  background: ${theme.backgroundColors.secondary};
  border-radius: 20px;

  ${respondTo("sm")} {
    height: 560px;
  }
`

export const Header = styled(Flex)`
  position: relative;
  width: 100%;
  height: 58px;
  padding: 16px;

  &:after {
    content: "";
    display: block;
    width: 100%;
    height: 1px;
    background: #28334a;
    opacity: 0.5;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
`

export const Body = styled(Flex)`
  flex-direction: column;
  justify-content: flex-start;
  height: fill-available;
  width: 100%;
  font-family: "Gilroy";
  font-style: normal;
  overflow-y: auto;
  padding: 16px;
  gap: 16px;

  font-size: 13px;
  font-weight: 400;
  line-height: 170%;
  letter-spacing: 0.01em;
  color: #e4f2ff;

  ${respondTo("xmd")} {
    font-weight: 500;
    font-size: 14px;
  }
`

export const Footer = styled(Flex).attrs({ full: true })`
  flex-direction: column;
`

export const CheckboxLabel = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0.03em;
  color: #e4f2ff;
  margin-left: 8px;
  transform: translateY(3px);
`

export const Buttons = styled(Flex).attrs({ full: true })`
  padding: 16px;
  gap: 24px;

  & > a {
    width: 100%;
  }
`

export const Title = styled(Headline3)`
  display: flex;
  gap: 4px;
  align-items: center;
  font-weight: 700;
  margin: 0;
`
