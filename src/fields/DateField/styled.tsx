import styled from "styled-components/macro"

import { Icon } from "common"
import theme from "theme"

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  flex: 1;
`

export const SuccessLabelIcon = styled(Icon)`
  color: ${theme.statusColors.success};
`

export const Placeholder = styled.span`
  color: #788ab4;
  -webkit-text-fill-color: #788ab4;
  fill: #788ab4;
  transition: 0.3s ease;
  transition-property: opacity, color;
`

export const Value = styled.span`
  font-size: 16px;
  line-height: 1;
  -webkit-text-fill-color: ${theme.textColors.primary};
  color: ${theme.textColors.primary};
  transition: color 0.3s ease;
  font-weight: 500;
`
