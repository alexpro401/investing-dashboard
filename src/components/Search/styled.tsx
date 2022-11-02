import styled from "styled-components"
import { Flex, GradientBorderSearch } from "theme"

export const Container = styled(GradientBorderSearch)<{ height: string }>`
  border-radius: 32px;
  box-sizing: border-box;
  padding: 0 10px 0 14px;
  width: fill-available;
  height: ${(props) => props.height || "30px"};
  align-items: center;
`

export const Input = styled.input`
  background: none;
  outline: none;
  border: none;

  flex: 1;
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 15px;
  color: ${(props) => props.theme.textColors.primary};
  padding-top: 5px;
  padding-left: 8px;

  &::-webkit-input-placeholder {
    font-family: "Gilroy";
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 16px;
    color: #788ab4;
  }
  &:-moz-placeholder {
    font-family: "Gilroy";
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 16px;
    color: #788ab4;
  }
  &::-moz-placeholder {
    font-family: "Gilroy";
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 16px;
    color: #788ab4;
  }
  &:-ms-input-placeholder {
    font-family: "Gilroy";
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 16px;
    color: #788ab4;
  }
`

export const IconWrapper = styled(Flex)`
  height: 24px;
  width: 24px;
  justify-content: center;
`
