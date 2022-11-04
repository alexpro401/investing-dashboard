import { Icon } from "common"
import { NavLink } from "react-router-dom"

import theme from "theme"
import styled, { css } from "styled-components"
import { COLORS, SCHEMES, SIZES } from "./index"

export const defaultButtonStyles = (
  schema: SCHEMES,
  modifications: string[],
  states: string[],
  size: SIZES,
  color: COLORS
) => {
  const appButtonTransitionDuration = `0.2s`

  let appButtonBorder = ""
  let appButtonBg = ""
  let appButtonText = ""
  let appButtonTextHover = ""
  let appButtonBgHover = ""
  let appButtonBorderHover = ""
  let appButtonBgActive = ""
  let appButtonBorderActive = ""

  const filledScheme = {
    appButtonBg: theme.brandColors.primary,
    appButtonBgHover: theme.brandColors.primary,
    appButtonBgActive: theme.brandColors.primary,

    appButtonText: theme.textColors.primaryNegative,
    appButtonTextHover: theme.textColors.primaryNegative,

    appButtonBorder: 0,
    appButtonBorderHover: 0,
    appButtonBorderActive: 0,
  }

  const flatScheme = {
    appButtonBg: "transparent",
    appButtonBgHover: "transparent",
    appButtonBgActive: "transparent",

    appButtonText: theme.brandColors.primary,
    appButtonTextHover: theme.brandColors.primary,

    appButtonBorder: `1px solid ${theme.brandColors.primary}`,
    appButtonBorderHover: `1px solid ${theme.brandColors.primary}`,
    appButtonBorderActive: `1px solid ${theme.brandColors.primary}`,
  }

  switch (color) {
    case "primary":
      break
    case "secondary":
      filledScheme.appButtonBg = theme.additionalColors.primary
      filledScheme.appButtonBgHover = theme.additionalColors.primary
      filledScheme.appButtonBgActive = theme.additionalColors.primary

      filledScheme.appButtonText = theme.textColors.secondary
      filledScheme.appButtonTextHover = theme.textColors.secondary

      flatScheme.appButtonText = theme.textColors.secondary
      flatScheme.appButtonTextHover = theme.textColors.secondary

      flatScheme.appButtonBorder = `1px solid ${"#293C54"}`
      flatScheme.appButtonBorderHover = `1px solid ${"#293C54"}`
      flatScheme.appButtonBorderActive = `1px solid ${"#293C54"}`
      break
    case "success":
      filledScheme.appButtonBg = theme.statusColors.success
      filledScheme.appButtonBgHover = theme.statusColors.success
      filledScheme.appButtonBgActive = theme.statusColors.success

      filledScheme.appButtonText = theme.textColors.primaryNegative
      filledScheme.appButtonTextHover = theme.textColors.primaryNegative

      flatScheme.appButtonText = theme.statusColors.success
      flatScheme.appButtonTextHover = theme.statusColors.success

      flatScheme.appButtonBorder = `1px solid ${theme.statusColors.success}`
      flatScheme.appButtonBorderHover = `1px solid ${theme.statusColors.success}`
      flatScheme.appButtonBorderActive = `1px solid ${theme.statusColors.success}`
      break
    case "error":
      filledScheme.appButtonBg = theme.statusColors.error
      filledScheme.appButtonBgHover = theme.statusColors.error
      filledScheme.appButtonBgActive = theme.statusColors.error

      filledScheme.appButtonText = theme.textColors.primaryNegative
      filledScheme.appButtonTextHover = theme.textColors.primaryNegative

      flatScheme.appButtonText = theme.statusColors.error
      flatScheme.appButtonTextHover = theme.statusColors.error

      flatScheme.appButtonBorder = `1px solid ${theme.statusColors.error}`
      flatScheme.appButtonBorderHover = `1px solid ${theme.statusColors.error}`
      flatScheme.appButtonBorderActive = `1px solid ${theme.statusColors.error}`
      break
    case "warning":
      filledScheme.appButtonBg = theme.statusColors.warning
      filledScheme.appButtonBgHover = theme.statusColors.warning
      filledScheme.appButtonBgActive = theme.statusColors.warning

      filledScheme.appButtonText = theme.textColors.primaryNegative
      filledScheme.appButtonTextHover = theme.textColors.primaryNegative

      flatScheme.appButtonText = theme.statusColors.warning
      flatScheme.appButtonTextHover = theme.statusColors.warning

      flatScheme.appButtonBorder = `1px solid ${theme.statusColors.warning}`
      flatScheme.appButtonBorderHover = `1px solid ${theme.statusColors.warning}`
      flatScheme.appButtonBorderActive = `1px solid ${theme.statusColors.warning}`
      break
    case "info":
      filledScheme.appButtonBg = theme.statusColors.info
      filledScheme.appButtonBgHover = theme.statusColors.info
      filledScheme.appButtonBgActive = theme.statusColors.info

      filledScheme.appButtonText = theme.textColors.primaryNegative
      filledScheme.appButtonTextHover = theme.textColors.primaryNegative

      flatScheme.appButtonText = theme.statusColors.info
      flatScheme.appButtonTextHover = theme.statusColors.info

      flatScheme.appButtonBorder = `1px solid ${theme.statusColors.info}`
      flatScheme.appButtonBorderHover = `1px solid ${theme.statusColors.info}`
      flatScheme.appButtonBorderActive = `1px solid ${theme.statusColors.info}`
      break
    case "default":
      filledScheme.appButtonBg = "transparent"
      filledScheme.appButtonBgHover = "transparent"
      filledScheme.appButtonBgActive = "transparent"

      filledScheme.appButtonText = theme.brandColors.secondary
      filledScheme.appButtonTextHover = theme.brandColors.secondary

      flatScheme.appButtonText = theme.brandColors.secondary
      flatScheme.appButtonTextHover = theme.brandColors.secondary

      flatScheme.appButtonBorder = "0"
      flatScheme.appButtonBorderHover = "0"
      flatScheme.appButtonBorderActive = "0"
      break
    default:
  }

  switch (schema) {
    case "filled":
      appButtonBg = filledScheme.appButtonBg
      appButtonBgHover = filledScheme.appButtonBg
      appButtonBgActive = filledScheme.appButtonBg

      appButtonBorder = filledScheme.appButtonBg
      appButtonBorderHover = filledScheme.appButtonBg
      appButtonBorderActive = filledScheme.appButtonBg

      appButtonText = filledScheme.appButtonText
      appButtonTextHover = filledScheme.appButtonTextHover
      break
    case "flat":
      appButtonBg = flatScheme.appButtonBg
      appButtonBgHover = flatScheme.appButtonBg
      appButtonBgActive = flatScheme.appButtonBg

      appButtonBorder = flatScheme.appButtonBorder
      appButtonBorderHover = flatScheme.appButtonBorderHover
      appButtonBorderActive = flatScheme.appButtonBorderActive

      appButtonText = flatScheme.appButtonText
      appButtonTextHover = flatScheme.appButtonTextHover
      break
    default:
      break
  }

  return css`
    outline: 0;
    font-family: ${theme.appFontFamily};
    margin: 0;
    cursor: pointer;
    user-select: none;
    overflow: hidden;
    display: grid;
    width: min-content;
    grid: auto / auto-flow max-content;
    grid-gap: 10px;
    align-items: center;
    justify-content: center;
    padding: 18px 30px;
    font-size: 16px;
    line-height: 1.1;
    font-weight: 700;
    letter-spacing: 0;
    transition: ${appButtonTransitionDuration} ease-in;
    transition-property: background-color, color;
    text-decoration: none;
    border: ${appButtonBorder};
    background-color: ${appButtonBg};
    color: ${appButtonText};

    &:disabled {
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.5;
    }

    &:not([disabled]):hover,
    &:not([disabled]):focus {
      text-decoration: none;
      transition-timing-function: ease-out;
      color: ${appButtonTextHover};
      background-color: ${appButtonBgHover};
      border-color: ${appButtonBorderHover};
      border: ${appButtonBorderHover};
    }

    &:not([disabled]):active {
      text-decoration: none;
      transition-timing-function: ease-out;
      background-color: ${appButtonBgActive};
      border: ${appButtonBorderActive};
    }

    ${size === "medium"
      ? css`
          padding: 14px 30px;
        `
      : size === "small"
      ? css`
          padding: 12px 30px;
          font-size: 13px;
        `
      : size === "x-small"
      ? css`
          padding: 8px 22px;
          font-size: 13px;
        `
      : size === "no-paddings"
      ? css`
          padding: 0;
          border-radius: 0px !important;
        `
      : ""}

    ${modifications.includes("border-rounded")
      ? css`
          border-radius: 16px;

          ${size === "medium"
            ? css`
                border-radius: 16px;
              `
            : size === "small"
            ? css`
                border-radius: 12px;
              `
            : size === "x-small"
            ? css`
                border-radius: 10px;
              `
            : ""}
        `
      : ""}
  `
}

interface AppButtonStyledProps {
  modifications: string[]
  states: string[]
  scheme: SCHEMES
  size: SIZES
  coloring: COLORS
}

export const ButtonType = styled.button<AppButtonStyledProps>`
  ${(props) =>
    defaultButtonStyles(
      props.scheme,
      props.modifications,
      props.states,
      props.size,
      props.coloring
    )}
`

export const HrefType = styled.a<AppButtonStyledProps>`
  ${(props) =>
    defaultButtonStyles(
      props.scheme,
      props.modifications,
      props.states,
      props.size,
      props.coloring
    )}
`

export const NavLinkType = styled(NavLink)<AppButtonStyledProps>`
  ${(props) =>
    defaultButtonStyles(
      props.scheme,
      props.modifications,
      props.states,
      props.size,
      props.coloring
    )}
`

export const AppButtonText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: inherit;
  font: inherit;
  pointer-events: none;
  word-break: break-all;
  min-width: 0;
`

export const AppButtonIcon = styled(Icon)<{ size?: number }>`
  ${(props) =>
    !!props.size
      ? css`
          max-width: ${props.size}px;
          max-height: ${props.size}px;
          width: 100%;
          height: 100%;
        `
      : css`
          height: 1.2em;
          width: 1.2em;
        `}
`
