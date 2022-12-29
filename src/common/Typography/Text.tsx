import styled, { css } from "styled-components"

import theme, { respondTo } from "theme"
import DynamicComponent from "./DynamicTag"

/*
    # TEXT
*/

const TextStyle = css`
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  letter-spacing: 0.01em;
  color: ${theme.textColors.primary};
`

const RegularTextStyle = (props) => css`
  ${TextStyle}
  color: ${props.color || theme.textColors.primary};

  ${respondTo("sm")} {
    font-size: ${props.desktopSize || "13px"};
    font-weight: ${props.desktopWeight || "400"};
  }
`

const MediumTextStyle = (props) => css`
  ${TextStyle}

  font-weight: 500;

  ${respondTo("sm")} {
    font-size: ${props.desktopSize || "13px"};
    font-weight: ${props.desktopWeight || "400"};
  }
`

const ButtonTextStyle = css`
  ${TextStyle}

  font-weight: 700;
`

const ThinTextStyle = css`
  ${TextStyle}

  font-size: 11px;
  line-height: 13px;
`

const DescriptionTextStyle = css`
  ${TextStyle}

  line-height: 150%;
  color: ${theme.textColors.secondary};
`

export const RegularText = styled(DynamicComponent).attrs({ tag: "span" })`
  ${RegularTextStyle}
`

export const MediumText = styled(DynamicComponent).attrs({ tag: "span" })`
  ${MediumTextStyle}
`

export const ButtonText = styled(DynamicComponent).attrs({ tag: "span" })`
  ${ButtonTextStyle}
`

export const ThinText = styled(DynamicComponent).attrs({ tag: "span" })`
  ${ThinTextStyle}
`

export const DescriptionText = styled(DynamicComponent).attrs({ tag: "span" })`
  ${DescriptionTextStyle}
`
