import styled from "styled-components/macro"
import { AppButton } from "common"
import { rgba } from "polished"
import { respondTo } from "theme"

export const Root = styled.div`
  position: relative;
`

export const Status = styled.div<{ active: boolean }>`
  padding: 5px 6px;
  border-radius: 36px;
  white-space: nowrap;
  border: 1px solid ${(props) => (props.active ? "#9ae2cb" : "#788AB4")};
  color: ${(props) => (props.active ? "#9ae2cb" : "#788AB4")};
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 600;
  font-size: 11px;
  line-height: 13px;
`
export const Ticker = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 100%;
  color: #788ab4;
`

export const AddButton = styled(AppButton)`
  margin-left: 0.5px;
  padding: 0;
  font-size: 11px;

  ${respondTo("lg")} {
    margin-left: 4px;
    background: ${({ theme }) => theme.brandColors.secondary};
    font-size: 12px;
    line-height: 14px;
    padding: 2px 6px;
  }
`

export const RiskyProposalCardSettingsButton = styled(AppButton)`
  background: ${({ theme }) => rgba(theme.brandColors.secondary, 0.15)};
`

export const DescriptionWrp = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 16px;
  padding: 0 16px;

  font-weight: 400;
  font-size: 13px;
  line-height: 130%;
  letter-spacing: 0.01em;
  color: #e4f2ff;

  ${respondTo("lg")} {
    font-weight: 500;
    font-size: 14px;
    line-height: 170%;
    padding: 0;
    margin-top: 16px;
  }
`
