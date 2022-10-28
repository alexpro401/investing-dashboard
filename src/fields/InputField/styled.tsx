import styled from "styled-components"
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
  getFieldSuccessBorderStyles,
  getDefaultFieldErrorStyles,
  getDefaultFieldLabelStyles,
  getDefaultFieldPlaceholderStyles,
  getDefaultFieldTextStyles,
} from "fields/styled"
import { EInputBorderColors } from "./index"

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

  ${(props) => (props.isDisabled ? "opacity: 0.5" : "")}
`

export const InputWrp = styled(motion.div)`
  display: flex;
  flex-direction: column;
  position: relative;
`

export const Input = styled(motion.input)<{
  isNodeLeftExist?: boolean
  isNodeRightExist?: boolean
  borderColor?: EInputBorderColors
}>`
  background: none;
  border: none;
  outline: none;
  text-overflow: ellipsis;
  padding: ${fieldPaddings};
  transition-property: box-shadow;

  ${getDefaultFieldTextStyles()}

  ${({ borderColor }) => (!borderColor ? getDefaultFieldBorderStyles() : "")}

  ${({ borderColor }) =>
    borderColor === EInputBorderColors.success
      ? getFieldSuccessBorderStyles()
      : ""}

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

  ${(props) =>
    props.isNodeRightExist ? `padding-right: ${fieldPaddingRight * 3}px;` : ""}

  ${(props) =>
    props.isNodeLeftExist ? `padding-left: ${fieldPaddingLeft * 3}px;` : ""}

  &:not([disabled]):focus {
    box-sizing: border-box;
  }
`

export const Label = styled(motion.label)<{
  isNodeLeftExist?: boolean
  isNodeRightExist?: boolean
  inputId: string
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

  ${(props) =>
    props.isNodeLeftExist
      ? `
        right: auto;
        width: min-content;
      `
      : ""}

  #${(props) => props.inputId}:not(:focus):placeholder-shown + & {
    top: 50%;
    color: ${fieldLabelColor};
    ${(props) =>
      props.isNodeLeftExist ? `left: calc(${fieldPaddingLeft * 3}px);` : ""}
  }

  #${(props) => props.inputId}:not([disabled]):focus ~ &,
  #${(props) => props.inputId}:not(:focus):not(:placeholder-shown) + & {
    color: ${fieldLabelFocusColor};
    left: ${fieldPaddingLeft}px;
    font-size: ${fieldLabelFontSize}px;
  }

  #${(props) => props.inputId}:not(:focus):placeholder-shown:-webkit-autofill
    + & {
    top: 50%;
    color: ${fieldLabelColor};
  }
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

export const InputFieldHint = styled.span`
  display: block;
  color: ${(props) => props.theme.textColors.secondary};
  font-size: 14px;
  line-height: 1.5;
  margin-top: 8px;
`
