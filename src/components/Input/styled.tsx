import { motion } from "framer-motion"
import styled from "styled-components"
import { GradientBorder, Flex } from "theme"

const background = {
  black: "#08121a",
  grey: "#191F2C",
  clear: "transparent",
}

const height = {
  normal: "50px",
  small: "24px",
}

const padding = {
  normal: "14px 16px",
  small: "6px 8px",
}

const borderRadius = {
  normal: "10px",
  small: "15px",
}

export const Container = styled(GradientBorder)<{
  theme: "grey" | "black" | "clear"
  size?: string
  error?: boolean
}>`
  position: relative;
  width: 100%;
  border-radius: ${(props) =>
    props.size ? borderRadius[props.size] : borderRadius.normal};
  padding: ${(props) => (props.size ? padding[props.size] : padding.normal)};
  min-height: ${(props) => (props.size ? height[props.size] : height.normal)};
  box-sizing: border-box;

  &:after {
    background: ${({ theme }) => background[theme]};
  }

  ${(props) =>
    props.theme === "clear" &&
    `
      &:after,
      &:before {
        background: transparent;
      }
  `}
  ${(props) =>
    props.error &&
    `
      &:before {
        background: #db6d6d;
      }
  `}
`

export const Label = styled(Flex)`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;
  color: #616d8b;
  padding: 4px 8px;
  position: absolute;
  border-radius: 10px;
  width: fit-content;
`

export const LimitText = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 12px;
  letter-spacing: 0.03em;
  color: #616d8b;
`

export const InputField = styled(motion.input)`
  outline: none;
  appearance: none;
  background: transparent;
  border: none;
  width: fill-available;
  height: 16px;
  padding: 0;

  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;
  color: #e4f2ff;

  &::placeholder {
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 16px;
    color: #616d8b;
  }
`
