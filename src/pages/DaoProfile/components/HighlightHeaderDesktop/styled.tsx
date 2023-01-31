import styled from "styled-components/macro"

import theme, { Flex } from "theme"
import { MediumText } from "common"
import ExternalLink from "components/ExternalLink"
import Icon from "components/Icon"

export const HeaderWrp = styled(Flex).attrs(() => ({
  full: true,
  ai: "stretch",
}))`
  margin-left: 20px;
  margin-right: 20px;
  width: calc(100% - 40px);
  gap: 16px;
`

export const IconProfile = styled(Icon)`
  flex-shrink: 0;
`

export const HeaderMain = styled(Flex).attrs(() => ({
  dir: "column",
  ai: "flex-start",
  jc: "center",
  gap: "4",
}))`
  flex: 1 1 auto;
`

export const Title = styled(MediumText).attrs(() => ({
  color: theme.statusColors.info,
  weight: 900,
  size: "32px",
}))`
  line-height: 40px;
  max-height: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`

export const TitleLinks = styled(Flex).attrs(() => ({
  gap: "16",
}))`
  flex-shrink: 0;
  flex-wrap: wrap;
`

export const TitleLink = styled(ExternalLink)`
  font-size: 16px;
  line-height: 19.5px;
  font-weight: 700;
  display: flex;
  gap: 4px;
  align-items: center;
`

export const HeaderLinks = styled(Flex).attrs(() => ({
  gap: "24",
  ai: "flex-start",
  jc: "center",
}))`
  margin-top: 40px;
`
