import styled from "styled-components"
import { motion } from "framer-motion"
import {
  fieldBg,
  fieldErrorColor,
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

/* CHANGED */

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

export const InputWrp = styled(motion.div)`
  display: flex;
  flex-direction: column;
  position: relative;
`

export const Input = styled(motion.input)<{
  isError?: boolean
  isNodeLeftExist?: boolean
  isNodeRightExist?: boolean
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

  &:not(:read-only) {
    box-shadow: inset 0 0 0 50px ${fieldBg};
  }

  &:read-only,
  &:disabled {
    cursor: default;
    filter: grayscale(100%);
  }

  &[type="number"] {
    -moz-appearance: textfield;

    /* Chrome, Safari, Edge, Opera */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  ${(props) => (props.isError ? `border-color: ${fieldErrorColor};` : "")}

  ${(props) =>
    props.isNodeRightExist ? `padding-right: ${fieldPaddingRight * 3}px;` : ""}

  ${(props) =>
    props.isNodeLeftExist ? `padding-left: ${fieldPaddingLeft * 3}px;` : ""}

  &:not([disabled]):focus {
    box-sizing: border-box;
  }
`

export const Label = styled(motion.label)<{
  isError?: boolean
  isNodeLeftExist?: boolean
  isNodeRightExist?: boolean
}>`
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

  ${(props) =>
    props.isNodeLeftExist
      ? `
        right: 0;
        width: min-content;

        ${Input}:not(:focus):placeholder-shown + & {
          left: calc(${fieldPaddingRight * 3}px);
        }
      `
      : ""}

  ${Input}:not(:focus):placeholder-shown + & {
    top: 50%;
    color: ${fieldLabelColor};
  }

  ${Input}:not([disabled]):focus ~ &,
  ${Input}:not(:focus):not(:placeholder-shown) + & {
    color: ${fieldLabelFocusColor};
    left: ${fieldPaddingLeft}px;
    font-size: ${fieldLabelFontSize}px;
  }

  ${Input}:not(:focus):placeholder-shown:-webkit-autofill + & {
    top: 50%;
    color: ${fieldLabelColor};
  }

  ${(props) => (props.isError ? `color: ${fieldErrorColor} !important;` : "")}
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

export const NodeLeftWrp = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: ${fieldPaddingLeft}px;
  transform: translateY(-50%);
  color: inherit;
`

export const NodeRightWrp = styled(motion.div)`
  position: absolute;
  top: 50%;
  right: ${fieldPaddingRight}px;
  transform: translateY(-50%);
  color: inherit;
`
