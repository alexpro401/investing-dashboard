import styled from "styled-components"

import { Icon as IconComponent } from "common"
import { motion } from "framer-motion"
import {
  fieldBg,
  fieldLabelColor,
  fieldLabelFocusColor,
  fieldLabelFontSize,
  fieldPaddingLeft,
  fieldPaddingRight,
  fieldPaddings,
  getDefaultFieldBorderStyles,
  getDefaultFieldErrorStyles,
  getDefaultFieldLabelStyles,
  getDefaultFieldPlaceholderStyles,
  getDefaultFieldTextStyles,
} from "fields/styled"
import theme from "theme"

export const Root = styled.div<{ isDisabled: boolean; isReadonly: boolean }>`
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

export const InputWrp = styled(motion.div)`
  display: flex;
  flex-direction: column;
  position: relative;
`

export const IconWrap = styled.div`
  position: absolute;
  top: 50%;
  left: ${fieldPaddingLeft}px;
  transform: translateY(-50%);
`

export const NodeRightWrap = styled.div`
  position: absolute;
  top: 50%;
  right: ${fieldPaddingLeft}px;
  transform: translateY(-50%);
`

export const Icon = styled(IconComponent)<{ isActive: boolean }>`
  color: ${(props) =>
    props.isActive ? theme.textColors.secondary : theme.brandColors.secondary};
`

export const Label = styled(motion.label)<{
  isActive: boolean
  empty: boolean
}>`
  display: flex;
  gap: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: absolute;
  top: 0;
  left: ${fieldPaddingLeft}px;
  transform: translateY(-50%);
  margin-bottom: 8px;
  background: ${fieldBg};
  padding: 4px;
  transition-property: all;

  ${getDefaultFieldLabelStyles()}

  right: auto;
  width: min-content;

  ${(props) =>
    !props.isActive ? `color: ${theme.brandColors.secondary} !important;` : ""}

  ${(props) => (props.empty ? "opacity: 0;" : "")}
`

export const Input = styled(motion.input)<{
  hasNodeLeft: boolean
  hasNodeRight: boolean
}>`
  background: none;
  border: none;
  outline: none;
  text-overflow: ellipsis;
  padding: ${fieldPaddings};
  transition-property: box-shadow;

  ${getDefaultFieldTextStyles()}

  ${getDefaultFieldBorderStyles()}

  &::-webkit-input-placeholder {
    ${getDefaultFieldPlaceholderStyles()}
  }

  &::-moz-placeholder {
    ${getDefaultFieldPlaceholderStyles()}
  }

  &:-moz-placeholder {
    ${getDefaultFieldPlaceholderStyles()}
  }

  &:-ms-input-placeholder {
    ${getDefaultFieldPlaceholderStyles()}
  }

  &::placeholder {
    ${getDefaultFieldPlaceholderStyles()}
  }

  &:not(:read-only),
  &:-webkit-autofill,
  &:-webkit-autofill:focus {
    box-shadow: inset 0 0 0 50px ${fieldBg};
    background: ${fieldBg};
  }

  &:read-only,
  &:disabled {
    cursor: default;
    filter: grayscale(100%);
  }

  ${(props) =>
    props.hasNodeLeft ? `padding-left: ${fieldPaddingLeft * 3}px;` : ""}

  ${(props) =>
    props.hasNodeRight ? `padding-right: ${fieldPaddingRight * 3}px;` : ""}

  &:not([disabled]):focus {
    box-sizing: border-box;
  }

  // changing label styles
  &:not(:focus):placeholder-shown + ${Label} {
    top: 50%;
    color: ${fieldLabelColor};

    ${(props) =>
      props.hasNodeLeft ? `left: calc(${fieldPaddingRight * 3}px)` : ""}
  }

  &:not([disabled]):focus
    ~ ${Label},
    &:not(:focus):not(:placeholder-shown)
    + ${Label} {
    color: ${fieldLabelFocusColor};
    left: ${fieldPaddingLeft}px;
    font-size: ${fieldLabelFontSize}px;
  }

  &:not(:focus):placeholder-shown:-webkit-autofill + ${Label} {
    top: 50%;
    color: ${fieldLabelColor};
  }
`
