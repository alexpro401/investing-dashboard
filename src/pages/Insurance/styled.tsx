import styled from "styled-components/macro"
import { Card, CardDescription, CardHead, AppButton } from "common"
import { ICON_NAMES } from "constants/icon-names"
import { respondTo } from "theme"
import Management from "pages/Management"

export const Container = styled.div`
  margin: 0 auto;
  width: fill-available;
`

export const Content = styled.div`
  width: inherit;
  height: inherit;
  overflow-y: auto;
`

export const Indents = styled.div<{ top?: boolean; side?: boolean }>`
  width: 100%;
  margin-top: ${({ top = false }) => (top ? "16px" : "0")};
  padding-left: ${({ side = true }) => (side ? "16px" : "0")};
  padding-right: ${({ side = true }) => (side ? "16px" : "0")};
`

export const InsuranceInfoCard = styled(Card)`
  ${respondTo("sm")} {
    background: transparent;
    gap: 24px;
  }
`
export const InsuranceInfoCardHead = styled(CardHead)`
  & > * {
    ${respondTo("sm")} {
      font-weight: 900;
      font-size: 24px;
      line-height: 30px;
      letter-spacing: -0.01em;
    }
  }
`
export const InsuranceInfoCardDescription = styled(CardDescription)`
  ${respondTo("sm")} {
    font-weight: 500;
    font-size: 14px;
    line-height: 170%;
    letter-spacing: 0.01em;
    color: #e4f2ff;
  }
`
export const InsuranceInfoCardAction = styled(AppButton)`
  ${respondTo("sm")} {
    background: rgba(38, 105, 235, 0.15);
    border-radius: 16px;
  }
`
export const InsuranceTerminal = styled(Management)`
  ${respondTo("sm")} {
    margin: 0 20px 0 auto;
  }
`

export const InsuranceAllProposalsLink = styled(AppButton).attrs(() => ({
  color: "default",
  size: "x-small",
  iconRight: ICON_NAMES.angleRightOutlined,
}))`
  padding: 8px 0 8px 22px;
`

export const InsuranceProposalsList = styled.div`
  width: 100%;
  max-height: 460px;
  overflow-y: auto;

  & > * {
    width: inherit;
    &:not(:first-child) {
      margin-top: 16px;
    }
  }
`
