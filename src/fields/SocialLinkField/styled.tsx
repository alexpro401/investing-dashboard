import styled, { css } from "styled-components/macro"
import { AppButton, Icon } from "common"
import { fieldLabelHoverColor } from "fields/styled"
import { ICON_NAMES } from "consts/icon-names"
import { OverlapInputField } from "fields"

export const Root = styled.div``

export const OverlapPaste = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  color: ${(props) => props.theme.brandColors.secondary};
`

export const OverlapInputFieldWrp = styled(OverlapInputField)`
  ${(props) =>
    !props.value
      ? css`
          svg {
            color: ${(props) => props.theme.brandColors.secondary} !important;
          }
        `
      : ""}
  input {
    pointer-events: none;
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
