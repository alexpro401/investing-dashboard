import styled from "styled-components/macro"

import theme, { Flex, respondTo } from "theme"
import { AppButton } from "common"
import { PoolBaseToken } from "pages/PoolProfile/components" // FIXME

export const Root = styled(Flex).attrs(() => ({
  full: true,
  gap: "48",
  dir: "column",
}))`
  padding-bottom: 24px;
`

export const TutorialBlock = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 46px 128px;
  width: 100%;
  margin: 64px 0 0;
  min-height: 135px;
  background: linear-gradient(180deg, #0c1018 0%, #0c1018 100%);
  border-radius: 20px;
`

export const TutorialTitle = styled.h2`
  font-style: normal;
  font-size: 36px;
  line-height: 1.2;
  font-weight: 400;
  letter-spacing: -0.02em;
  color: #ffffff;
  margin: 0;
`

export const TutorialBtn = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.brandColors.secondary};
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

export const OnChainVotingContent = styled.div`
  display: flex;
  align-items: center;
  border-radius: 20px;
  background-color: #0c1018;
  width: 100%;
  border: 2px dashed #336683;
  padding: 0 24px;
`

export const OnChainVotingContentStatistics = styled.div`
  flex: 1;
  display: grid;
  justify-items: center;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: var(--app-gap);
`

export const OnChainClaimButtonWrp = styled(Flex).attrs(() => ({
  ai: "center",
  jc: "center",
}))``

export const OnChainClaimButton = styled(AppButton)`
  min-width: 150px;
  border: none;

  ${respondTo("lg")} {
    min-width: 200px;
  }
`

export const BalanceSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--app-gap);
  width: 100%;
`

export const BalanceSectionTitle = styled.h2`
  font-size: 20px;
  line-height: 1.2;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: ${(props) => props.theme.textColors.primary};
`

export const BalanceSectionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: #0c1018;
  border-radius: 20px;
  padding: var(--app-padding);
  gap: var(--app-gap);
`

export const BalanceSectionItemBtn = styled(AppButton).attrs({
  color: "secondary",
})``

export const BalanceBaseToken = styled(PoolBaseToken)``
