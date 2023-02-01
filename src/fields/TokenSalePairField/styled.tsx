import styled from "styled-components/macro"

import { Icon } from "common"
import theme, { Flex, respondTo } from "theme"
import { ICON_NAMES } from "consts"
import { OverlapInputField, InputField } from "fields"
import { fieldLabelColor } from "fields/styled"
import { Input } from "fields/InputField/styled"

export const TrashIcon = styled(Icon).attrs(() => ({
  name: ICON_NAMES.trash,
}))`
  color: ${theme.statusColors.info};
`

export const TrashIconHolder = styled(Flex).attrs(() => ({
  ai: "center",
  jc: "center",
}))`
  width: 30px;
  height: 30px;
  padding: 4px;
  cursor: pointer;
`

export const TokenPlaceholder = styled.span`
  color: #5a6071;
`

export const TokenUnknownValue = styled.span`
  color: ${theme.textColors.primary};
`

export const TokenInput = styled.input`
  background: transparent;
  border: none;
  flex: 1;
  max-width: 80px;
  text-align: right;

  ${respondTo("xxs")} {
    max-width: 150px;
  }

  ${respondTo("md")} {
    max-width: 300px;
  }

  &::placeholder {
    color: ${fieldLabelColor} !important;
    -webkit-text-fill-color: ${fieldLabelColor} !important;
    fill: ${fieldLabelColor} !important;
  }

  color: ${theme.textColors.primary} !important;
  -webkit-text-fill-color: ${theme.textColors.primary} !important;
  fill: ${theme.textColors.primary} !important;

  &:focus {
    outline: none;
  }
`

export const DektopFieldContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
`

export const DesktopLeftInput = styled(OverlapInputField)`
  width: 50%;

  ${Input} {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    border-right: none;
  }
`

export const DesktopRightInput = styled(InputField)`
  width: 50%;

  ${Input} {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    border: 1px solid #293c54 !important;
  }
`
