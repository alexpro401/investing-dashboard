import styled from "styled-components/macro"

import theme, { Flex } from "theme"
import { MediumText } from "common"
import ExternalLink from "components/ExternalLink"

export const HeaderWrp = styled(Flex).attrs(() => ({
  full: true,
  ai: "stretch",
}))`
  margin-top: 24px;
  margin-left: 20px;
  margin-right: 20px;
  width: calc(100% - 40px);
  gap: 16px;
`

export const HeaderMain = styled(Flex).attrs(() => ({
  dir: "column",
  ai: "flex-start",
  jc: "center",
  gap: "16",
}))`
  flex: 1 0 auto;
`

export const Title = styled(MediumText).attrs(() => ({
  color: theme.statusColors.info,
  weight: 900,
  size: "32px",
}))``

export const TitleLinks = styled(Flex).attrs(() => ({
  gap: "16",
}))``

export const TitleLink = styled(ExternalLink)`
  font-size: 16px;
  line-height: 19.5px;
  font-weight: 700;
  display: flex;
  gap: 4px;
  align-items: center;
`

export const HeaderLinks = styled(Flex).attrs(() => ({}))``
