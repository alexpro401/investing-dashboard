import { Icon } from "common"
import { respondTo } from "theme"

import styled from "styled-components"

import { ICON_NAMES } from "consts/icon-names"

import { Props } from "."

export const LogoWrapper = styled.div<Props>`
  display: flex;
  width: ${(props) => props.size || 32}px;
  height: ${(props) => props.size || 32}px;
  justify-content: center;
  align-items: center;

  ${(props) => props.desktopOnly && "display: none;"}

  ${respondTo("sm")} {
    ${(props) => props.mobileOnly && "display: none;"}

    ${(props) => props.desktopOnly && "display: flex;"}
  }
`

export const LogoIcon = styled(Icon).attrs({
  name: ICON_NAMES.logoIcon,
})``
