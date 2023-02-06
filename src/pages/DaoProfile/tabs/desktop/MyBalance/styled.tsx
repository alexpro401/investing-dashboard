import styled from "styled-components/macro"

import theme, { Flex, respondTo } from "theme"
import { AppButton } from "common"

export const Root = styled(Flex).attrs(() => ({
  full: true,
  gap: "48",
  dir: "column",
}))`
  padding-bottom: 24px;
`

export const OnChainVotingSection = styled(Flex).attrs(() => ({
  full: true,
  gap: "16",
  dir: "column",
}))``

export const OnChainVotingSectionHeader = styled(Flex).attrs(() => ({
  full: true,
  gap: "16",
  ai: "center",
  jc: "space-between",
}))``

export const OnChainTutorialLink = styled.a`
  color: ${theme.brandColors.secondary};
  font-weight: 700;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: 0.01em;
  text-decoration: none;
`

export const OnChainVotingContent = styled(Flex).attrs(() => ({
  full: true,
  ai: "center",
  gap: "32",
}))`
  border-radius: 20px;
  background-color: #0c1018;
  border: 2px dashed #336683;
  padding: 0 24px;
`

export const OnChainClaimButtonWrp = styled(Flex).attrs(() => ({
  ai: "center",
  jc: "center",
}))``

export const OnChainClaimButton = styled(AppButton)`
  min-width: 150px;

  ${respondTo("lg")} {
    min-width: 200px;
  }
`
