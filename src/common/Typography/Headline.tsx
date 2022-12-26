import { ComponentType } from "react"
import styled, { css } from "styled-components"
import theme, { respondTo } from "theme"
import DynamicComponent, { TypographyProps } from "./DynamicTag"

/*
    # HEADLINES
*/

const HeadlineStyle = css`
  color: ${theme.textColors.primary};
`

const Headline1Style = (props) => css`
  ${HeadlineStyle}

  font-weight: ${props.weight || 600};
  font-size: ${props.size || "20px"};
  line-height: 24px;
  letter-spacing: -0.01em;

  ${respondTo("sm")} {
    font-size: ${props.desktopSize || "24px"};
    font-weight: ${props.desktopWeight || "700"};
  }
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

export const Headline1: ComponentType<TypographyProps> = styled(
  DynamicComponent
).attrs({ tag: "h1" })`
  ${(props) => Headline1Style(props)}
`

export const Headline2 = styled(DynamicComponent).attrs({ tag: "h2" })`
  ${Headline2Style}
`

export const Headline3 = styled(DynamicComponent).attrs({ tag: "h3" })`
  ${Headline3Style}
`

// export const Component = () => {
//   return (
//     <Headline1 size="13px" desktopSize="24px" weight={300} desktopWeight={800}>
//       Headline 1
//     </Headline1>
//   )
// }
