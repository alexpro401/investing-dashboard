import styled from "styled-components/macro"

import { Icon } from "common"
import theme from "theme"
import { fieldLabelColor } from "fields/styled"
import { OverlapInputField, InputField } from "fields"
import { Input } from "fields/InputField/styled"

export const Root = styled.div`
  position: relative;
`
export const BlueIcon = styled(Icon)`
  color: ${theme.brandColors.secondary};
  cursor: pointer;
`
export const AddressContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`

export const TokenContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`

export const Address = styled.div<{ isHidden: boolean }>`
  color: ${theme.textColors.secondary};

  ${(props) => (props.isHidden ? "opacity: 0.5" : "")}
`

export const TokenLabel = styled.span<{ isHidden: boolean }>`
  color: ${theme.textColors.secondary};

  ${(props) => (props.isHidden ? "opacity: 0.5" : "")}
`

export const TokenInput = styled.input<{ isHidden: boolean }>`
  background: transparent;
  border: none;
  flex: 1;
  max-width: 80px;
  text-align: right;

  &::placeholder {
    color: ${fieldLabelColor} !important;
    -webkit-text-fill-color: ${fieldLabelColor} !important;
    fill: ${fieldLabelColor} !important;
  }

  ${(props) =>
    props.isHidden
      ? `
      color: ${theme.textColors.secondary} !important;
  -webkit-text-fill-color: ${theme.textColors.secondary} !important;
  fill: ${theme.textColors.secondary} !important;
  opacity: 0.5;
  `
      : `
  color: ${theme.textColors.primary} !important;
  -webkit-text-fill-color: ${theme.textColors.primary} !important;
  fill: ${theme.textColors.primary} !important;
  `}

  &:focus {
    outline: none;
  }
`

export const DektopInputContainer = styled.div`
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
