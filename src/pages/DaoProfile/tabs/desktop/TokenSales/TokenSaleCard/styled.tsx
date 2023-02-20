import styled, { css } from "styled-components/macro"
import Tooltip from "components/Tooltip"
import ExternalLink from "components/ExternalLink"
import { TokenLink, DashedBadge, AppButton } from "common"

export const Root = styled.div<{
  isActive?: boolean
}>`
  display: flex;
  flex-direction: column;
  background: #0c1018;
  border-radius: 20px;
  gap: var(--app-gap);

  ${(props) =>
    props.isActive
      ? css`
          border: 1px dashed #202c41;
        `
      : ""}
`

export const Head = styled.div`
  display: flex;
  align-items: center;
  gap: var(--app-gap);
  padding: 24px 24px 0;
`

export const DashedBadgeWrp = styled(DashedBadge)``

export const HeadBuyMsgWrp = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  line-height: 1.3;
  color: #368bc9;
`

export const HeadTokenLink = styled(TokenLink)`
  color: #368bc9;
`

export const HeadActions = styled.div`
  display: flex;
  align-items: baseline;
  gap: var(--app-gap);
  margin-left: auto;
`

export const HeadExplorerLink = styled(ExternalLink).attrs({
  iconColor: "#368BC9",
})`
  color: #368bc9;
`

export const HeadActionsBtn = styled(AppButton).attrs({
  size: "no-paddings",
  color: "default",
  iconSize: 14,
})`
  color: #6781bd;
`

export const ProgressBar = styled.div<{
  progress: number
}>`
  position: relative;
  width: 100%;
  height: 3px;
  margin: 0 24px;

  &:after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: ${(props) => `${props.progress}%`};
    height: 3px;
    background: linear-gradient(41.86deg, #2680eb 0%, #7fffd4 117.98%);
    box-shadow: 0 1px 4px rgba(164, 235, 212, 0.29),
      0 2px 5px rgba(164, 235, 212, 0.14);
    border-radius: 2px;
  }
`

export const Body = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--app-gap);
  padding: 0 24px 24px;
`

export const StatisticItem = styled.div``

export const StatisticItemLabelWrp = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const StatisticItemLabelText = styled.span`
  font-size: 12px;
  line-height: 1.25;
  color: #6781bd;
`

export const StatisticTooltip = styled(Tooltip)``

export const StatisticItemValueWrp = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const StatisticItemValueText = styled.span`
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: 0.01em;
  color: ${(props) => props.theme.textColors.primary};
`
