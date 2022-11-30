import styled from "styled-components"
import { motion } from "framer-motion"

import {
  getDefaultFieldErrorStyles,
  getDefaultFieldTextStyles,
} from "fields/styled"
import { Collapse, Icon } from "common"
import theme from "theme"

export const Root = styled.div<{
  isDisabled?: boolean
  isReadonly?: boolean
}>`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  flex: 1;

  ${(props) => (props.isDisabled || props.isReadonly ? "opacity: 0.5" : "")}
`

export const ErrorMessage = styled(motion.span).attrs(() => ({
  initial: "collapsed",
  animate: "open",
  exit: "collapsed",
  variants: {
    open: { opacity: 1, height: "auto" },
    collapsed: { opacity: 0, height: 0 },
  },
  transition: { duration: 0.15 },
}))`
  ${getDefaultFieldErrorStyles()}
`

export const SuccessLabelIcon = styled(Icon)`
  color: ${theme.statusColors.success};
`

export const NodeRightIcon = styled(Icon)`
  color: ${theme.textColors.secondary};
`

export const NodeRightContainer = styled(motion.div)`
  padding: 5px;
  cursor: pointer;
`

export const SearchingValue = styled.span`
  ${getDefaultFieldTextStyles()}
`

export const ListCollapse = styled(Collapse)`
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  width: 100%;
  z-index: 3;
  overflow: hidden;
`

export const ListItem = styled(motion.li).attrs(() => ({
  whileHover: { backgroundColor: theme.additionalColors.primary },
}))`
  list-style-type: none;
  width: 100%;
  padding: 12px;
  background-color: ${theme.textColors.secondaryNegative};
  cursor: pointer;

  &:first-child {
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
  }

  &:last-child {
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
  }
`
