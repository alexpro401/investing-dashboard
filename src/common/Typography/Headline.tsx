import styled, { css } from "styled-components"
import theme from "theme"
import DynamicComponent from "./DynamicTag"

/*
    # HEADLINES
*/

const HeadlineStyle = css`
  color: ${theme.textColors.primary};
`

const Headline1Style = css`
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: -0.01em;
  ${HeadlineStyle}
`

const Headline2Style = css`
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: 0.01em;
  ${HeadlineStyle}
`

const Headline3Style = css`
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: 0.01em;
  ${HeadlineStyle}
`

export const Headline1 = styled(DynamicComponent).attrs({ tag: "h1" })`
  ${Headline1Style}
`

export const Headline2 = styled(DynamicComponent).attrs({ tag: "h2" })`
  ${Headline2Style}
`

export const Headline3 = styled(DynamicComponent).attrs({ tag: "h3" })`
  ${Headline3Style}
`
