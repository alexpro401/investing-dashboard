import { Link } from "react-router-dom"
import styled, { css } from "styled-components/macro"
import { motion } from "framer-motion"
import { colorsTheme } from "./colors.theme"
import { respondTo } from "./mixins.theme"

export const pageContentMaxWidth = "1200px"

export const ease = [0.29, 0.98, 0.29, 1]

export const breakpoints = {
  xxs: 375,
  xs: 500,
  sm: 768,
  xmd: 825,
  md: 1024,
  lg: 1280,
}

export const To = styled(Link)`
  text-decoration: none;
  color: ${(props) => props.theme.textPrimary};
`

export const ExternalLink = styled.a`
  text-decoration: none;
  color: #0076bc;
`

export const BaseButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  border: none;
  cursor: pointer;
  user-select: none;
  background: none;

  // TODO: remove outdated animation, use only framer-motion package
  /* &:active {
    transform: scale(0.98);
  } */
  &:focus {
    outline: 0 solid transparent;
  }
`

const LinkWrap = styled(Link)<{ c: string; fw: number }>`
  font-size: 16px;
  color: ${(props) => props.c};
  user-select: none;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
  text-decoration: none;
  padding: 0 10px;
  font-weight: ${(props) => props.fw};

  ${respondTo("sm")} {
    font-size: 14px;
  }

  ${respondTo("md")} {
    padding: 0 20px;
  }
`

export const Tab = ({ children, active, to }) => (
  <LinkWrap c={active ? "#F5F5F5" : "#999999"} to={to} fw={active ? 800 : 300}>
    {children}
  </LinkWrap>
)

export const Flex = styled(motion.div)<{
  m?: string
  p?: string
  full?: boolean
  dir?: string
  ai?: string
  jc?: string
  op?: number
  gap?: string
  wrap?: string
}>`
  width: ${(props) => (props.full ? "100%" : "fit-content")};
  flex-direction: ${(props) => (props.dir ? props.dir : "row")};
  display: flex;
  align-items: ${(props) => (props.ai ? props.ai : "center")};
  justify-content: ${(props) => (props.jc ? props.jc : "space-between")};
  margin: ${(props) => (props.m ? props.m : 0)};
  padding: ${(props) => (props.p ? props.p : 0)};
  opacity: ${(props) => (props.op ? props.op : 1)};
  gap: ${(props) => (props.gap ? props.gap : 0)}px;
  ${(props) => (props.wrap ? `flex-wrap: ${props.wrap};` : "")}
`

export const Block = styled(Flex)`
  position: relative;
  background: linear-gradient(64.44deg, #24272f 32.35%, #333a48 100%);
  border-radius: 10px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  height: 120px;
  width: 100%;
  justify-content: space-around;
`

export const BasicCard = styled(Flex)`
  width: 100%;
  background: linear-gradient(64.44deg, #1f232c 32.35%, #282f3f 100%);

  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
`

export const GradientBorderBase = css`
  position: relative;
  z-index: 5;

  &:before {
    content: "";
    display: block;
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    z-index: -1;
    border-radius: inherit;
  }
  &:after {
    content: "";
    display: block;
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: inherit;
  }
`

export const GradientBorder = styled(Flex)<{ focused?: boolean }>`
  ${GradientBorderBase}

  &:before {
    transition: all 0.3s ease-in-out;
    background-image: ${(props) =>
      props.focused
        ? "linear-gradient(to bottom right,#2680eb 0%,#7fffd4 40%,#2680eb 60%,#2680eb 100%)"
        : "linear-gradient(to bottom right,#587eb76e 0%,#26324482 20%,#2632447d 40%,#6d99db80 100%)"};
  }
  &:after {
    background: linear-gradient(
        0deg,
        rgba(16, 20, 32, 0.32),
        rgba(16, 20, 32, 0.32)
      ),
      linear-gradient(64.44deg, #222630 32.35%, #2e3442 100%);
  }
`

export const GradientBorderLightGreen = styled(Flex)<{ focused?: boolean }>`
  ${GradientBorderBase}

  &:before {
    background-image: ${(props) =>
      props.focused
        ? "linear-gradient(to bottom right,#a4ebd4 100%,#63b49b 100%)"
        : "linear-gradient(to bottom right,#587eb76e 0%,#26324482 20%,#2632447d 40%,#6d99db80 100%)"};
  }
  &:after {
    background: linear-gradient(64.44deg, #191e2b 32.35%, #272e3e 100%);
  }
`

export const GradientBorderSearch = styled(Flex)<{ focused?: boolean }>`
  ${GradientBorderBase}

  &:before {
    background-image: ${(props) =>
      props.focused
        ? "linear-gradient(to bottom right,#a4ebd4 100%,#63b49b 100%)"
        : "linear-gradient(to bottom right,#28334A 0%,#28334A 100%)"};
  }
  &:after {
    background: ${(props) => (props.focused ? "#141926" : "#141A27")};
  }
`

export const Text = styled(motion.span)<{
  color?: string
  fz?: number
  fw?: number
  fs?: string
  ff?: string
  lh?: string
  align?: string
  p?: string
  block?: boolean
}>`
  display: ${(props) => (props?.block ? "block" : "inline")};
  font-family: ${(props) => (props?.ff ? props.ff : props.theme.appFontFamily)};
  font-size: ${(props) => (props?.fz ? `${props.fz}px` : "14px")};
  font-weight: ${(props) => (props?.fw ? props.fw : 400)};
  line-height: ${(props) => (props?.lh ? props.lh : "initial")};
  color: ${(props) => (props.color ? props.color : "#999999")};
  text-align: ${(props) => (props?.align ? props.align : "left")};
  font-style: ${(props) => props.fs || "normal"};
  padding: ${(props) => props.p || "0px"};
`

export const IconButton = styled.div`
  cursor: pointer;
  min-height: 32px;
  min-width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
`

export const Center = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

export function getAmountColor(
  value?: string | number,
  initialColor?: string
): string {
  const v = Number(value ?? 0)

  if (v > 0) return colorsTheme.statusColors.success
  if (v < 0) return colorsTheme.statusColors.error
  return initialColor ?? colorsTheme.textColors.secondary
}

export const ColorizedNumber = styled.div<{ value: string | number }>`
  color: ${(p) => getAmountColor(p.value)};
`

export * from "./mixins.theme"

export default {
  textPrimary: "#FAFAFA",
  appFontFamily: "Gilroy",
  pageContentMaxWidth,
  ...colorsTheme,
}
