import styled from "styled-components/macro"

import theme, { Flex } from "theme"
import { AppButton } from "common"
import { PoolStatisticsItem } from "pages/PoolProfile/components"
import { PoolStatisticsItemDetailsLabel } from "common/PoolStatisticsItem/styled"

export const Root = styled(Flex).attrs(() => ({
  full: true,
  ai: "center",
  jc: "space-between",
  gap: "36",
}))`
  background-color: #101520;
  border-radius: 24px;
  padding: 20px 24px;
`

export const Actions = styled(Flex).attrs(() => ({ gap: "24", ai: "center" }))``

export const ActionButton = styled(AppButton).attrs(() => ({
  size: "small",
}))`
  width: 100%;
  border: none;
`

export const ActionButtonSecondary = styled(AppButton).attrs(() => ({
  size: "small",
}))`
  width: 100%;
  border: none;
  background: rgba(38, 105, 235, 0.15);
  font-weight: 600;
  color: ${theme.brandColors.secondary};

  &:hover {
    background: rgba(38, 105, 235, 0.15) !important;
    color: ${theme.brandColors.secondary} !important;
  }
`

export const Statistics = styled(Flex).attrs(() => ({
  ai: "center",
  jc: "space-around",
  gap: "16",
}))`
  flex: 1 1 auto;
`

export const PoolStatisticsItemMyVotes = styled(PoolStatisticsItem)`
  ${PoolStatisticsItemDetailsLabel} {
    color: ${theme.brandColors.secondary};
  }
`
