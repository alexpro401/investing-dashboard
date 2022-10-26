import styled from "styled-components"
import { AppButton, Icon } from "common"
import {
  fieldLabelHoverColor,
  fieldPaddings,
  getDefaultFieldBorderStyles,
} from "../styled"
import { ICON_NAMES } from "constants/icon-names"

export const Root = styled.div<{
  isGap: boolean
}>`
  display: flex;
  flex-direction: column;
  gap: ${({ isGap }) => (isGap ? "24px" : "0")};
  overflow: hidden;
  transition: all 0.15s ease;
`

export const InputBtn = styled(AppButton).attrs(() => ({
  type: "button",
  color: "default",
  size: "no-paddings",
}))`
  width: 100%;
  padding: ${fieldPaddings};
  ${getDefaultFieldBorderStyles()}
  border-radius: 16px !important;
  justify-content: flex-start;

  &:hover,
  &:focus {
    border: 1px solid ${"#293C54"}!important;
  }
`

export const InputIcon = styled(Icon)`
  color: ${fieldLabelHoverColor};
  width: 20px;
  height: 20px;
`

export const RemoveBtn = styled(AppButton).attrs(() => ({
  iconRight: ICON_NAMES.trash,
  size: "no-paddings",
  color: "default",
}))`
  color: ${(props) => props.theme.brandColors.secondary};
`
