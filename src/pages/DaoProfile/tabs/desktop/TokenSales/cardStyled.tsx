import styled, { css } from "styled-components/macro"

import ExternalLink from "components/ExternalLink"
import { Icon, AppButton, Card, CardHead, DashedBadge, TokenLink } from "common"

export const ContainerWrp = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const Container = styled(Card)<{
  isFlatBottomBorders?: boolean
}>`
  width: 100%;
  background: #0c1018;

  ${(props) =>
    props.isFlatBottomBorders
      ? css`
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        `
      : ""}
`

export const ContainerBottom = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 14px;
  line-height: 1.3;
  font-weight: 700;
  letter-spacing: 0.01em;
  background: #182031;
  border-radius: 0 0 12px 12px;
  color: #368bc9;
  width: 100%;
  padding: 12px;
`

export const ContainerHead = styled(CardHead)``

export const ContainerNodeLeft = styled.div`
  display: flex;
  align-items: center;
  gap: var(--app-gap);
`

export const ContainerNodeRight = styled.div`
  display: flex;
  align-items: center;
  gap: var(--app-gap);
`

export const DashedBadgeWrp = styled(DashedBadge)``

export const PricingWrp = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  line-height: 1.3;
  color: #368bc9;
`

export const TokenLinkWrp = styled(TokenLink)``

export const HeadExplorerLink = styled(ExternalLink).attrs({
  iconColor: "#368BC9",
})`
  color: #368bc9;
`

export const HeadProceedToBtn = styled(AppButton).attrs({
  size: "no-paddings",
  color: "default",
  iconSize: 14,
})`
  color: #6781bd;
  font-size: 14px;
  line-height: 1.3;
  font-weight: 600;
  letter-spacing: 0.01em;
`

export const ProgressBar = styled.div<{
  progress: number
}>`
  position: relative;
  width: 100%;
  height: 3px;

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

export const Body = styled.div<{
  isSplitted?: boolean
}>`
  ${(props) =>
    props.isSplitted
      ? css`
          display: grid;
          grid-template-columns: 1fr 1fr;
          justify-content: space-between;
        `
      : css`
          display: flex;
          align-items: center;
          gap: var(--app-gap);
        `}
`

export const BodyLeft = styled.div`
  display: flex;
  align-items: center;
`

export const BodyRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

export const InfoTextWrp = styled.div<{
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info"
}>`
  display: flex;
  align-items: center;
  color: ${(props) =>
    props.color
      ? {
          primary: props.theme.textColors.primary,
          secondary: props.theme.textColors.secondary,
          success: "#2DE3E3",
          error: props.theme.statusColors.success,
          warning: props.theme.statusColors.warning,
          info: props.theme.statusColors.info,
        }[props.color]
      : "#368BC9"};
  gap: 4px;
`

export const InfoIcon = styled(Icon)`
  width: 18px;
  height: 18px;
  transform: translateY(-3px); // FIXME: temp
`
