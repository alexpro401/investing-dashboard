import styled from "styled-components"
import { AppButton } from "common"
import { ICON_NAMES } from "constants/icon-names"

export const Container = styled.div`
  margin: 0 auto;
  width: fill-available;
  overflow-y: hidden;
  background-color: #0e121b;

  height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  height: calc(var(--vh, 1vh) * 100 - 94px);
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

export const AppButtonFull = styled(AppButton)`
  width: 100%;
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
