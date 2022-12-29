import styled from "styled-components/macro"

import { Text } from "theme"
import { AppButton } from "common"

export const TableContainer = styled.div`
  width: 100%;
`

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: rgba(32, 41, 58, 0.6);
  opacity: 0.5;
`

export const Link = styled.a`
  display: block;
  width: 100%;
  text-decoration: none;
  color: initial;
`

export const Title = styled(Text).attrs(() => ({
  fz: 13,
  fw: 500,
  lh: "19px",
}))``

export const NavButton = styled(AppButton).attrs(() => ({
  color: "default",
  size: "x-small",
  scheme: "filled",
  iconSize: 26,
}))`
  width: 16px;
  height: 16px;
  padding: 4px 5.5px;
  color: #e4f2ff;
`
