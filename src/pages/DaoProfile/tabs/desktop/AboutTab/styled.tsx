import styled from "styled-components/macro"

import { Card } from "common"
import theme, { Flex } from "theme"
import ExternalLink from "components/ExternalLink"

export const Root = styled(Flex).attrs(() => ({
  full: true,
  gap: "48",
  dir: "column",
}))`
  padding-bottom: 24px;
`

export const ChartTreasuryWrp = styled.div`
  display: grid;
  gap: 24px;
  grid-template-rows: max-content 1fr;
  grid-template-columns: minmax(0, 1fr) 450px;
  width: 100%;
`

export const ChartSection = styled.div`
  width: 100%;
`

export const TreasurySection = styled.div``

export const DecriptionDetailsWrp = styled.div`
  display: grid;
  gap: 24px;
  grid-template-rows: max-content 1fr;
  grid-template-columns: minmax(0, 1fr) 450px;
  width: 100%;
`

export const DescriptionCard = styled(Card)`
  width: 100%;
  padding: 16px;
  height: min-content;
`

export const DescriptionLinksCard = styled(Card)`
  width: 100%;
  padding: 16px;
  height: min-content;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const DescriptionText = styled.p`
  color: ${theme.textColors.primary};
  font-size: 14px;
  font-weight: 500;
  line-height: 170%;
  letter-spacing: 0.01em;
  white-space: pre-line;
`

export const LinkLabel = styled.span`
  color: ${theme.textColors.primary};
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.01em;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #20293a;
`

export const LinkExternaLink = styled(ExternalLink).attrs(() => ({
  iconColor: theme.brandColors.secondary,
}))`
  flex-shrink: 0;
  display: flex;
  align-items: center;

  span {
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.01em;
    color: ${theme.brandColors.secondary};
    margin-top: 0px;
  }

  div {
    transform: none;
  }
`
